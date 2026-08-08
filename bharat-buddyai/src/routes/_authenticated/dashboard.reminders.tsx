import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Bell, Plus, Loader2, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader, FooterCopy } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listReminders, addReminder, deleteReminder, toggleReminder } from "@/lib/data.functions";

export const Route = createFileRoute("/_authenticated/dashboard/reminders")({
  head: () => ({ meta: [{ title: "Reminders · Bharat Buddy AI" }] }),
  component: RemindersPage,
});

function daysUntil(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
  return diff;
}

function RemindersPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listReminders);
  const addFn = useServerFn(addReminder);
  const delFn = useServerFn(deleteReminder);
  const toggleFn = useServerFn(toggleReminder);

  const { data: reminders = [], isLoading } = useQuery({ queryKey: ["reminders"], queryFn: () => listFn() });
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const addM = useMutation({
    mutationFn: () => addFn({ data: { title: title.trim(), due_date: date } }),
    onSuccess: () => {
      toast.success("Reminder added");
      setTitle(""); setDate("");
      qc.invalidateQueries({ queryKey: ["reminders"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        icon={CalendarClock}
        title="Smart Reminders"
        description="Buddy adds reminders from documents you upload — and you can add your own here."
        accent="from-[oklch(0.72_0.16_200)] to-[oklch(0.78_0.14_220)]"
      />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <p className="text-sm font-semibold">Add a reminder</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Pay electricity bill" />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Button onClick={() => addM.mutate()} disabled={!title.trim() || !date || addM.isPending} className="gradient-bg text-primary-foreground shadow-glow">
            {addM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="mr-1 h-4 w-4" /> Add</>}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : reminders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-semibold">No reminders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Upload a document or add one above — Buddy will keep track for you.</p>
          </div>
        ) : reminders.map((r) => {
          const days = daysUntil(r.due_date);
          return (
            <div key={r.id} className={`flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft ${r.done ? "opacity-60" : ""}`}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-bg text-primary-foreground">
                <Bell className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`font-semibold ${r.done ? "line-through" : ""}`}>{r.title}</p>
                <p className="truncate text-xs text-muted-foreground">From {r.source ?? "Manual"}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-bold">{r.due_date}</p>
                <p className="text-xs text-muted-foreground">{days >= 0 ? `in ${days} days` : `${Math.abs(days)} days ago`}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Button size="icon" variant="outline" onClick={() => {
                  toggleFn({ data: { id: r.id, done: !r.done } }).then(() => qc.invalidateQueries({ queryKey: ["reminders"] }));
                }}><Check className="h-4 w-4" /></Button>
                <Button size="icon" variant="outline" onClick={() => {
                  delFn({ data: { id: r.id } }).then(() => {
                    toast.success("Removed"); qc.invalidateQueries({ queryKey: ["reminders"] }); qc.invalidateQueries({ queryKey: ["stats"] });
                  });
                }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          );
        })}
      </div>

      <FooterCopy />
    </div>
  );
}
