import { createFileRoute } from "@tanstack/react-router";
import { ScrollText, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader, FooterCopy } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { explainForm } from "@/lib/ai.functions";
import { listForms, getProfile } from "@/lib/data.functions";

export const Route = createFileRoute("/_authenticated/dashboard/forms")({
  head: () => ({ meta: [{ title: "Govt Form Assistant · Bharat Buddy AI" }] }),
  component: FormsPage,
});

const popular = [
  "Aadhaar Update",
  "PAN Application (Form 49A)",
  "Passport Application",
  "PMAY (Housing Scheme)",
  "Ration Card",
  "Income Tax ITR-1",
];

function FormsPage() {
  const [formName, setFormName] = useState("");
  const qc = useQueryClient();
  const explain = useServerFn(explainForm);
  const listFn = useServerFn(listForms);
  const fetchProfile = useServerFn(getProfile);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });
  const { data: lookups = [] } = useQuery({ queryKey: ["forms"], queryFn: () => listFn() });

  const mutation = useMutation({
    mutationFn: (name: string) =>
      explain({ data: { formName: name, language: profile?.preferred_language ?? "English" } }),
    onSuccess: () => {
      toast.success("Form explained!");
      setFormName("");
      qc.invalidateQueries({ queryKey: ["forms"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        icon={ScrollText}
        title="Government Form Assistant"
        description="Every field explained in your language, with a checklist of documents you need."
        accent="from-[oklch(0.65_0.16_155)] to-[oklch(0.78_0.14_165)]"
      />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <label className="text-sm font-semibold">Which form do you need help with?</label>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g. Aadhaar update, scholarship form, PAN..."
            className="h-11"
          />
          <Button
            onClick={() => formName.trim() && mutation.mutate(formName.trim())}
            disabled={!formName.trim() || mutation.isPending}
            className="h-11 gradient-bg text-primary-foreground shadow-glow"
          >
            {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Explaining…</> : <><Sparkles className="mr-2 h-4 w-4" /> Explain</>}
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {popular.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => mutation.mutate(p)}
              disabled={mutation.isPending}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {lookups.map((f) => {
          const fields = (f.fields as Array<{ name: string; help: string }>) ?? [];
          const checklist = (f.checklist as string[]) ?? [];
          return (
            <div key={f.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="font-display text-lg font-semibold">{f.form_name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{f.explanation}</p>
              {fields.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Field-by-field</p>
                  <ul className="mt-2 space-y-2 text-sm">
                    {fields.map((fl, i) => (
                      <li key={i}><strong>{fl.name}:</strong> <span className="text-muted-foreground">{fl.help}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {checklist.length > 0 && (
                <div className="mt-4 rounded-xl bg-secondary p-4">
                  <p className="text-xs font-semibold uppercase">Documents you'll need</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    {checklist.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <FooterCopy />
    </div>
  );
}
