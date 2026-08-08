import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileText,
  ShieldAlert,
  Briefcase,
  CalendarClock,
  ScrollText,
  GraduationCap,
  Users,
  Globe2,
  Mic,
  Moon,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bharat Buddy AI — Your Everyday AI Assistant for Life" },
      {
        name: "description",
        content:
          "Understand documents, fill government forms, spot scams, plan your career, and never miss a deadline. Built for India, in your language.",
      },
      { property: "og:title", content: "Bharat Buddy AI — Your Everyday AI Assistant for Life" },
      {
        property: "og:description",
        content:
          "Understand documents, fill government forms, spot scams, plan your career, and never miss a deadline. Built for India.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { t } = useT();
  const features = [
    { icon: FileText, title: t("feat.docs"), description: "Upload any PDF, image or screenshot. Get a plain-language summary, key dates and action items.", to: "/dashboard/documents" as const, accent: "from-primary to-primary-glow" },
    { icon: ScrollText, title: t("feat.forms"), description: "Every field explained in your language, with a checklist of documents you need.", to: "/dashboard/forms" as const, accent: "from-[oklch(0.65_0.16_155)] to-[oklch(0.78_0.14_165)]" },
    { icon: ShieldAlert, title: t("feat.scam"), description: "Paste a message or screenshot. Get a risk score, fraud indicators and safety advice instantly.", to: "/dashboard/scam-shield" as const, accent: "from-destructive to-[oklch(0.7_0.2_15)]" },
    { icon: Briefcase, title: t("feat.career"), description: "Upload your resume for a skill-gap analysis, custom roadmap and curated learning paths.", to: "/dashboard/career" as const, accent: "from-[oklch(0.55_0.18_280)] to-[oklch(0.7_0.16_300)]" },
    { icon: CalendarClock, title: t("feat.reminders"), description: "Automatically extracts deadlines from your documents and reminds you before they pass.", to: "/dashboard/reminders" as const, accent: "from-[oklch(0.72_0.16_200)] to-[oklch(0.78_0.14_220)]" },
  ];
  const audiences = [
    { icon: GraduationCap, label: t("aud.students") },
    { icon: Briefcase, label: t("aud.jobSeekers") },
    { icon: Users, label: t("aud.parents") },
    { icon: Globe2, label: t("aud.firstNet") },
    { icon: Sparkles, label: t("aud.ruralUrban") },
  ];
  const steps = [
    { n: "01", title: t("step.1.title"), text: t("step.1.text") },
    { n: "02", title: t("step.2.title"), text: t("step.2.text") },
    { n: "03", title: t("step.3.title"), text: t("step.3.text") },
  ];
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              {t("hero.badge")}
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              {t("hero.title1")} <br />
              {t("hero.title2")} <span className="gradient-text">{t("hero.title3")}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/dashboard">
                <Button size="lg" className="gradient-bg h-12 px-7 text-base text-primary-foreground shadow-glow hover:opacity-95">
                  {t("hero.cta.try")} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="h-12 px-7 text-base">
                  {t("hero.cta.see")}
                </Button>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> {t("hero.perk.noCard")}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> {t("hero.perk.langs")}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> {t("hero.perk.voice")}</span>
            </div>
          </motion.div>

          {/* Hero mock card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <div className="absolute inset-x-10 -top-6 h-24 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <span className="ml-3 text-xs text-muted-foreground">buddy.ai / scam-shield</span>
              </div>
              <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
                <div className="space-y-3">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Suspicious SMS</div>
                  <div className="rounded-2xl bg-muted p-4 text-sm">
                    "Dear customer, your KYC will be blocked today. Click bit.ly/sbi-verify to update immediately."
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mic className="h-3.5 w-3.5" /> You can also speak it out loud
                  </div>
                </div>
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-destructive">High risk</span>
                    <span className="font-display text-2xl font-bold text-destructive">94<span className="text-sm">/100</span></span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex gap-2"><span className="text-destructive">•</span> Uses urgency to scare you ("today")</li>
                    <li className="flex gap-2"><span className="text-destructive">•</span> Shortened link hides real destination</li>
                    <li className="flex gap-2"><span className="text-destructive">•</span> No bank asks for KYC over SMS link</li>
                  </ul>
                  <div className="mt-4 rounded-xl bg-card p-3 text-xs">
                    <strong>Buddy says:</strong> Do not click. Call your bank using the number on your debit card.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">{t("features.heading")}</h2>
          <p className="mt-3 text-muted-foreground">{t("features.sub")}</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* WHO */}
      <section id="who" className="container mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft md:p-14">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">{t("who.heading")}</h2>
              <p className="mt-3 text-muted-foreground">{t("who.sub")}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {audiences.map((a) => (
                <div key={a.label} className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="container mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">{t("how.heading")}</h2>
          <p className="mt-3 text-muted-foreground">{t("how.sub")}</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="font-display text-4xl font-bold gradient-text">{s.n}</span>
              <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PERKS */}
      <section className="container mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          {[
            { icon: Mic, label: "Voice input & output" },
            { icon: Globe2, label: "Regional languages" },
            { icon: Moon, label: "Dark mode" },
            { icon: Sparkles, label: "Powered by Gemini" },
          ].map((p) => (
            <div key={p.label} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-soft">
              <p.icon className="h-4 w-4 text-primary" /> {p.label}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto max-w-6xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl gradient-bg p-10 text-center shadow-elegant md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)] opacity-20" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-5xl">
              {t("cta.heading")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
              {t("cta.sub")}
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="h-12 px-8 text-base shadow-soft">
                  {t("cta.button")} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <Logo />
          <p className="text-xs text-muted-foreground">{t("footer.copy", { year: new Date().getFullYear() })}</p>
        </div>
      </footer>
    </div>
  );
}
