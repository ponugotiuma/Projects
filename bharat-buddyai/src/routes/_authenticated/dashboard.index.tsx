import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ScrollText, ShieldAlert, Briefcase, CalendarClock, TrendingUp, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getStats, getProfile } from "@/lib/data.functions";
import { FooterCopy } from "@/components/PageHeader";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard · Bharat Buddy AI" }] }),
  component: Overview,
});

function Overview() {
  const { t } = useT();
  const tools = [
    { to: "/dashboard/documents", icon: FileText, title: t("quick.docs.title"), desc: t("quick.docs.desc") },
    { to: "/dashboard/forms", icon: ScrollText, title: t("quick.forms.title"), desc: t("quick.forms.desc") },
    { to: "/dashboard/scam-shield", icon: ShieldAlert, title: t("quick.scam.title"), desc: t("quick.scam.desc") },
    { to: "/dashboard/career", icon: Briefcase, title: t("quick.career.title"), desc: t("quick.career.desc") },
    { to: "/dashboard/reminders", icon: CalendarClock, title: t("quick.reminders.title"), desc: t("quick.reminders.desc") },
  ] as const;
  const fetchStats = useServerFn(getStats);
  const fetchProfile = useServerFn(getProfile);
  const { data } = useQuery({ queryKey: ["stats"], queryFn: () => fetchStats() });
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });

  const firstName = (profile?.full_name || profile?.email || "").split(/[\s@]/)[0];
  const isNewUser = (data?.documents ?? 0) + (data?.scams ?? 0) + (data?.upcomingReminders ?? 0) === 0;

  const stats = [
    { label: t("dash.stats.docs"), value: data?.documents ?? 0, trend: t("dash.stats.allTime") },
    { label: t("dash.stats.scams"), value: data?.scams ?? 0, trend: t("dash.stats.staySafe") },
    { label: t("dash.stats.upcoming"), value: data?.upcomingReminders ?? 0, trend: t("dash.stats.notDone") },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          {t("dash.namaste")} {firstName ? `${firstName} 👋` : "👋"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {isNewUser ? t("dash.welcomeNew") : t("dash.welcomeReturning")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-success"><TrendingUp className="h-3 w-3" /> {s.trend}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold">{t("dash.quick")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.to} to={t.to} className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-bg text-primary-foreground shadow-glow">
                <t.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{t.title}</p>
                <p className="truncate text-sm text-muted-foreground">{t.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
      <FooterCopy />
    </div>
  );
}
