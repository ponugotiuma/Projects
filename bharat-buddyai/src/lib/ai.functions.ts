import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Helpers ----------
async function logUsage(supabase: any, userId: string, kind: string, language: string) {
  try {
    await supabase.from("usage_events").insert({ user_id: userId, kind, language });
  } catch (e) {
    console.error("logUsage failed", e);
  }
}

// ---------- Schemas ----------
const LangSchema = z.string().min(1).max(40).default("English");

const DocInput = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(120),
  dataBase64: z.string().min(1).max(28_000_000), // ~20MB
  language: LangSchema,
});

const ScamInput = z.object({
  text: z.string().min(1).max(8000),
  language: LangSchema,
});

const ResumeInput = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(120),
  dataBase64: z.string().min(1).max(28_000_000),
  language: LangSchema,
});

const FormInput = z.object({
  formName: z.string().min(1).max(200),
  language: LangSchema,
});

// ---------- Document Explainer ----------
export const summarizeDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => DocInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { callGemini, tryParseJson } = await import("./ai-gateway.server");

    const isImage = data.mimeType.startsWith("image/");
    const dataUrl = `data:${data.mimeType};base64,${data.dataBase64}`;

    const system = `You are Bharat Buddy AI, a helpful assistant for Indian citizens.
Explain the uploaded document in simple ${data.language}.
Respond ONLY in valid JSON with this exact shape:
{
  "summary": "2-4 sentence plain-language summary",
  "action_items": ["short next step", "..."],
  "important_dates": [{ "date": "YYYY-MM-DD or natural", "label": "what this date is for" }]
}`;

    const userContent = isImage
      ? [
          { type: "text" as const, text: "Please explain this document." },
          { type: "image_url" as const, image_url: { url: dataUrl } },
        ]
      : [
          {
            type: "text" as const,
            text:
              "Please explain this document. The file is attached as a data URL. " +
              "If you cannot read it directly, infer from the filename and respond with your best guidance and ask the user to paste key text.\nFilename: " +
              data.fileName,
          },
          { type: "image_url" as const, image_url: { url: dataUrl } },
        ];

    const raw = await callGemini({
      messages: [
        { role: "system", content: system },
        { role: "user", content: userContent },
      ],
      responseJson: true,
    });

    const parsed = tryParseJson<{
      summary: string;
      action_items: string[];
      important_dates: Array<{ date: string; label: string }>;
    }>(raw) ?? { summary: raw || "Could not summarise the document.", action_items: [], important_dates: [] };

    const { data: row, error } = await supabase
      .from("documents")
      .insert({
        user_id: userId,
        file_name: data.fileName,
        mime_type: data.mimeType,
        summary: parsed.summary,
        action_items: parsed.action_items ?? [],
        important_dates: parsed.important_dates ?? [],
        language: data.language,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    // Auto-create reminders for any dates that look like a real YYYY-MM-DD
    const reminders = (parsed.important_dates ?? []).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.date));
    if (reminders.length) {
      await supabase.from("reminders").insert(
        reminders.map((r) => ({
          user_id: userId,
          title: r.label || "Deadline from document",
          due_date: r.date,
          source: data.fileName,
        })),
      );
    }

    await logUsage(supabase, userId, "document", data.language);
    return row;
  });

// ---------- Scam Shield ----------
export const analyzeScam = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ScamInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { callGemini, tryParseJson } = await import("./ai-gateway.server");

    const system = `You are Bharat Buddy AI Scam Shield.
Analyse the user-supplied message for scam / phishing indicators common in India (fake KYC, fake refund, OTP theft, fake jobs, lottery, courier, UPI fraud, etc.).
Respond ONLY in valid JSON in ${data.language}:
{
  "risk_score": 0-100,
  "verdict": "Safe" | "Suspicious" | "High risk",
  "indicators": ["short bullet", "..."],
  "advice": "One paragraph of clear safety advice."
}`;

    const raw = await callGemini({
      messages: [
        { role: "system", content: system },
        { role: "user", content: data.text },
      ],
      responseJson: true,
    });

    const parsed = tryParseJson<{
      risk_score: number;
      verdict: string;
      indicators: string[];
      advice: string;
    }>(raw) ?? { risk_score: 0, verdict: "Unknown", indicators: [], advice: raw };

    const { data: row, error } = await supabase
      .from("scam_checks")
      .insert({
        user_id: userId,
        input_text: data.text,
        risk_score: Math.max(0, Math.min(100, Math.round(parsed.risk_score || 0))),
        verdict: parsed.verdict,
        indicators: parsed.indicators ?? [],
        advice: parsed.advice,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    await logUsage(supabase, userId, "scam", data.language);
    return row;
  });

// ---------- Career Navigator ----------
export const analyzeResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ResumeInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { callGemini, tryParseJson } = await import("./ai-gateway.server");

    const dataUrl = `data:${data.mimeType};base64,${data.dataBase64}`;
    const system = `You are Bharat Buddy AI Career Navigator.
Analyse the attached resume. Respond ONLY in valid JSON in ${data.language}:
{
  "summary": "2 sentences about the candidate",
  "skills": ["skill", "..."],
  "skill_gaps": ["missing skill or gap", "..."],
  "roadmap": [{ "step": "...", "months": "0-3 months" }],
  "learning_links": [{ "title": "Free resource", "url": "https://..." }]
}
Suggest only free or low-cost resources (NPTEL, SWAYAM, YouTube, freeCodeCamp, official docs).`;

    const raw = await callGemini({
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "text", text: `Resume file: ${data.fileName}` },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      responseJson: true,
    });

    const parsed = tryParseJson<{
      summary: string;
      skills: string[];
      skill_gaps: string[];
      roadmap: Array<{ step: string; months: string }>;
      learning_links: Array<{ title: string; url: string }>;
    }>(raw) ?? { summary: raw, skills: [], skill_gaps: [], roadmap: [], learning_links: [] };

    const { data: row, error } = await supabase
      .from("career_analyses")
      .insert({
        user_id: userId,
        resume_name: data.fileName,
        summary: parsed.summary,
        skills: parsed.skills ?? [],
        skill_gaps: parsed.skill_gaps ?? [],
        roadmap: parsed.roadmap ?? [],
        learning_links: parsed.learning_links ?? [],
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    await logUsage(supabase, userId, "career", data.language);
    return row;
  });

// ---------- Govt Form Assistant ----------
export const explainForm = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => FormInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { callGemini, tryParseJson } = await import("./ai-gateway.server");

    const system = `You are Bharat Buddy AI Form Assistant.
Explain the Indian government form named "${data.formName}" in simple ${data.language}.
Respond ONLY in valid JSON:
{
  "explanation": "What this form is for, in 2-3 sentences.",
  "fields": [{ "name": "field name", "help": "what to write here in plain language" }],
  "checklist": ["document or item the user needs", "..."]
}`;

    const raw = await callGemini({
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Explain the form: ${data.formName}` },
      ],
      responseJson: true,
    });

    const parsed = tryParseJson<{
      explanation: string;
      fields: Array<{ name: string; help: string }>;
      checklist: string[];
    }>(raw) ?? { explanation: raw, fields: [], checklist: [] };

    const { data: row, error } = await supabase
      .from("form_lookups")
      .insert({
        user_id: userId,
        form_name: data.formName,
        explanation: parsed.explanation,
        fields: parsed.fields ?? [],
        checklist: parsed.checklist ?? [],
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    await logUsage(supabase, userId, "form", data.language);
    return row;
  });
