import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader, FooterCopy } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeScam } from "@/lib/ai.functions";
import { listScamChecks, getProfile } from "@/lib/data.functions";

export const Route = createFileRoute("/_authenticated/dashboard/scam-shield")({
  head: () => ({ meta: [{ title: "Scam Shield · Bharat Buddy AI" }] }),
  component: ScamShield,
});

function verdictColor(score: number) {
  if (score >= 70) return "text-destructive";
  if (score >= 40) return "text-warning";
  return "text-success";
}

function ScamShield() {
  const [text, setText] = useState("");
  const qc = useQueryClient();
  const analyze = useServerFn(analyzeScam);
  const listFn = useServerFn(listScamChecks);
  const fetchProfile = useServerFn(getProfile);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });
  const { data: checks = [] } = useQuery({ queryKey: ["scams"], queryFn: () => listFn() });

  const mutation = useMutation({
    mutationFn: () => analyze({ data: { text: text.trim(), language: profile?.preferred_language ?? "English" } }),
    onSuccess: () => {
      toast.success("Analysis complete");
      setText("");
      qc.invalidateQueries({ queryKey: ["scams"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        icon={ShieldAlert}
        title="Scam Shield"
        description="Paste any SMS, WhatsApp message or email. Get a risk score and clear safety advice."
        accent="from-destructive to-[oklch(0.7_0.2_15)]"
      />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <label className="text-sm font-semibold">Paste the suspicious message</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-3 min-h-32"
          placeholder="e.g. Your account will be blocked today, click this link..."
        />
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => mutation.mutate()}
            disabled={!text.trim() || mutation.isPending}
            className="gradient-bg text-primary-foreground shadow-glow"
          >
            {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysing…</> : <><Send className="mr-2 h-4 w-4" /> Analyse</>}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {checks.map((c) => {
          const indicators = (c.indicators as string[]) ?? [];
          return (
            <div key={c.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.verdict}</span>
                <span className={`font-display text-3xl font-bold ${verdictColor(c.risk_score)}`}>
                  {c.risk_score}<span className="text-sm">/100</span>
                </span>
              </div>
              <p className="mt-2 truncate text-xs text-muted-foreground">"{c.input_text.slice(0, 140)}…"</p>
              {indicators.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-sm">
                  {indicators.map((ind, i) => <li key={i} className="flex gap-2"><span className="text-destructive">•</span>{ind}</li>)}
                </ul>
              )}
              {c.advice && <div className="mt-3 rounded-xl bg-secondary p-3 text-sm"><strong>Buddy says:</strong> {c.advice}</div>}
            </div>
          );
        })}
      </div>

      <FooterCopy />
    </div>
  );
}
