import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader, FooterCopy } from "@/components/PageHeader";
import { getStats } from "@/lib/data.functions";

export const Route = createFileRoute("/_authenticated/dashboard/analytics")({
  head: () => ({ meta: [{ title: "Analytics · Bharat Buddy AI" }] }),
  component: AnalyticsPage,
});

const TOOL_LABELS: Array<[string, string]> = [
  ["document", "Docs"],
  ["form", "Forms"],
  ["scam", "Scam"],
  ["career", "Career"],
  ["reminder", "Remind"],
];

function AnalyticsPage() {
  const fetchStats = useServerFn(getStats);
  const { data } = useQuery({ queryKey: ["stats"], queryFn: () => fetchStats() });

  const counts = data?.kindCounts ?? {};
  const maxKind = Math.max(1, ...Object.values(counts));
  const total = data?.totalEvents ?? 0;
  const langs = data?.langCounts ?? {};
  const langTotal = Math.max(1, Object.values(langs).reduce((a, b) => a + b, 0));

  const metrics = [
    { label: "Documents", value: data?.documents ?? 0 },
    { label: "Scam checks", value: data?.scams ?? 0 },
    { label: "Upcoming reminders", value: data?.upcomingReminders ?? 0 },
    { label: "Total AI actions", value: total },
  ];

  return (
    <div className="space-y-8">
      <PageHeader icon={BarChart3} title="Your Buddy stats" description="See how Buddy is helping you stay on top of things." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-sm text-muted-foreground">{m.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="font-semibold">Tool usage</p>
          <div className="mt-6 flex h-48 items-end gap-3">
            {TOOL_LABELS.map(([k]) => {
              const h = ((counts[k] ?? 0) / maxKind) * 100;
              return <div key={k} className="flex-1 rounded-t-lg gradient-bg" style={{ height: `${Math.max(4, h)}%` }} />;
            })}
          </div>
          <div className="mt-3 grid grid-cols-5 text-center text-xs text-muted-foreground">
            {TOOL_LABELS.map(([k, l]) => <span key={k}>{l}</span>)}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="font-semibold">Languages used</p>
          {Object.keys(langs).length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Try a few features — your language mix will appear here.</p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {Object.entries(langs).map(([lang, count]) => {
                const pct = Math.round((count / langTotal) * 100);
                return (
                  <li key={lang}>
                    <div className="flex justify-between"><span>{lang}</span><span className="text-muted-foreground">{pct}%</span></div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full gradient-bg" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <FooterCopy />
    </div>
  );
}
