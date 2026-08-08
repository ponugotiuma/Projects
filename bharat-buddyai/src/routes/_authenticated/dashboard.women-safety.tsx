import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Phone, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader, FooterCopy } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeScam } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/dashboard/women-safety")({
  head: () => ({ meta: [{ title: "Women Safety & Alerts · Bharat Buddy AI" }] }),
  component: WomenSafetyPage,
});

const EMERGENCY_CONTACTS = [
  { name: "Police (All India)", number: "112", desc: "National emergency helpline" },
  { name: "Women Helpline", number: "1091", desc: "24/7 women in distress" },
  { name: "Women Helpline (Domestic Abuse)", number: "181", desc: "Support for harassment & abuse" },
  { name: "Cyber Crime Helpline", number: "1930", desc: "Report online fraud & cyber crime" },
  { name: "Child Helpline", number: "1098", desc: "Children in need of care" },
  { name: "Senior Citizen Helpline", number: "14567", desc: "Elder support" },
  { name: "Ambulance", number: "108", desc: "Medical emergency" },
];

const FAKE_JOB_REDFLAGS = [
  "Asks you to pay a registration / training / security fee upfront",
  "Offer letter arrives within hours without an interview",
  "Communication only via WhatsApp / Telegram, never an official email domain",
  "Salary is suspiciously high for the role and your experience",
  "Asks for Aadhaar, PAN, bank OTP, or full KYC before any contract is signed",
  "Recruiter email uses a free domain (gmail / outlook) instead of company domain",
  "Company website is missing, brand-new, or copy-pasted",
  "Pressures you to decide today or lose the offer",
];

function WomenSafetyPage() {
  const qc = useQueryClient();
  const analyze = useServerFn(analyzeScam);
  const [text, setText] = useState("");
  const [result, setResult] = useState<{
    risk_score: number;
    verdict: string;
    indicators: string[];
    advice: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: () => analyze({ data: { text, language: "English" } }),
    onSuccess: (row: any) => {
      setResult({
        risk_score: row.risk_score ?? 0,
        verdict: row.verdict ?? "Unknown",
        indicators: row.indicators ?? [],
        advice: row.advice ?? "",
      });
      qc.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Analysis complete");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to analyze"),
  });

  function verdictColor(v: string) {
    const s = v.toLowerCase();
    if (s.includes("high")) return "text-destructive border-destructive/30 bg-destructive/5";
    if (s.includes("suspic")) return "text-warning border-warning/30 bg-warning/5";
    return "text-success border-success/30 bg-success/5";
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={ShieldCheck}
        title="Women Safety & Alerts"
        description="Spot suspicious calls, fake job offers, and one-tap access to emergency helplines."
      />

      {/* Scam / call analyzer */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold">Analyze a suspicious call or message</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste the transcript of a phone call, voice message, SMS, WhatsApp, or job offer. Buddy
          will tell you how risky it looks and why.
        </p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. The caller said he was from a bank and asked me to share an OTP to verify my account…"
          rows={6}
          className="mt-4"
        />
        <div className="mt-3 flex justify-end">
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !text.trim()}
            className="gradient-bg text-primary-foreground shadow-glow"
          >
            {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…</> : "Analyze risk"}
          </Button>
        </div>

        {result && (
          <div className={`mt-5 rounded-xl border p-5 ${verdictColor(result.verdict)}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider">{result.verdict}</span>
              <span className="font-display text-2xl font-bold">
                {result.risk_score}<span className="text-sm">/100</span>
              </span>
            </div>
            {result.indicators.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-sm">
                {result.indicators.map((ind, i) => (
                  <li key={i} className="flex gap-2"><span>•</span>{ind}</li>
                ))}
              </ul>
            )}
            {result.advice && (
              <div className="mt-4 rounded-lg bg-card p-3 text-sm text-foreground">
                <strong>Buddy says:</strong> {result.advice}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Emergency contacts */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold">Emergency helplines (India)</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Tap to call directly from your phone.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {EMERGENCY_CONTACTS.map((c) => (
            <a
              key={c.number}
              href={`tel:${c.number}`}
              className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-colors hover:bg-accent"
            >
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
              <span className="font-display text-xl font-bold text-primary">{c.number}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Fake job red flags */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="font-display text-lg font-semibold">Fake job offer red flags</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          If any of these match your offer, paste the message into the analyzer above before responding.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {FAKE_JOB_REDFLAGS.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      <FooterCopy />
    </div>
  );
}
