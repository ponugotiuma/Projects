import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

const ProfileUpdate = z.object({
  full_name: z.string().max(120).optional(),
  preferred_language: z.string().max(40).optional(),
  voice_input: z.boolean().optional(),
  voice_output: z.boolean().optional(),
  dark_mode: z.boolean().optional(),
});

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ProfileUpdate.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const getStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const today = new Date().toISOString().slice(0, 10);
    const [docs, scams, rems, events, langEvents] = await Promise.all([
      supabase.from("documents").select("*", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("scam_checks").select("*", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("reminders").select("*", { count: "exact", head: true }).eq("user_id", userId).gte("due_date", today).eq("done", false),
      supabase.from("usage_events").select("kind").eq("user_id", userId),
      supabase.from("usage_events").select("language").eq("user_id", userId),
    ]);

    const kindCounts: Record<string, number> = { document: 0, form: 0, scam: 0, career: 0, reminder: 0 };
    (events.data ?? []).forEach((e) => {
      kindCounts[e.kind] = (kindCounts[e.kind] ?? 0) + 1;
    });
    const langCounts: Record<string, number> = {};
    (langEvents.data ?? []).forEach((e) => {
      const k = e.language ?? "English";
      langCounts[k] = (langCounts[k] ?? 0) + 1;
    });

    return {
      documents: docs.count ?? 0,
      scams: scams.count ?? 0,
      upcomingReminders: rems.count ?? 0,
      kindCounts,
      langCounts,
      totalEvents: (events.data ?? []).length,
    };
  });

export const listReminders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", userId)
      .order("due_date", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const NewReminder = z.object({
  title: z.string().min(1).max(200),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(2000).optional(),
});

export const addReminder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => NewReminder.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("reminders")
      .insert({ user_id: userId, ...data, source: "Manual" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    await supabase.from("usage_events").insert({ user_id: userId, kind: "reminder" });
    return row;
  });

export const toggleReminder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), done: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("reminders").update({ done: data.done }).eq("id", data.id).eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteReminder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("reminders").delete().eq("id", data.id).eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listDocuments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listScamChecks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("scam_checks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listCareer = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("career_analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listForms = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("form_lookups")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
