import { createFileRoute, Link } from "@tanstack/react-router";
import { useSalonStore } from "@/lib/salon-store";
import { branches, services, stylists, customers, channelMeta, DAY_END_HOUR, DAY_START_HOUR, SALON_PHONE, SALON_PHONE_TEL } from "@/lib/salon-data";
import { ArrowUpRight, TrendingUp, Users, Calendar as CalIcon, Sparkles, Phone } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Overview · Lumière Salon OS" }] }),
  component: Overview,
});

function Overview() {
  const appts = useSalonStore((s) => s.appointments);
  const active = useSalonStore((s) => s.activeBranchId);
  const scoped = active === "all" ? appts : appts.filter((a) => a.branchId === active);

  const revenueToday = scoped.filter((a) => a.status === "done")
    .reduce((sum, a) => sum + (services.find((s) => s.id === a.serviceId)?.price ?? 0), 0);
  const commissionToday = scoped.filter((a) => a.status === "done")
    .reduce((sum, a) => sum + (a.commission ?? 0), 0);
  const upcoming = scoped.filter((a) => a.status !== "cancelled" && a.status !== "done").length;

  // channel breakdown
  const channels = scoped.reduce<Record<string, number>>((acc, a) => {
    acc[a.channel] = (acc[a.channel] ?? 0) + 1; return acc;
  }, {});
  const totalChan = Object.values(channels).reduce((a, b) => a + b, 0) || 1;

  // branch cards
  const branchStats = branches.map((b) => {
    const list = appts.filter((a) => a.branchId === b.id);
    const slots = (DAY_END_HOUR - DAY_START_HOUR) * 4 * stylists.filter((s) => s.branchId === b.id).length;
    const booked = list.filter((a) => a.status !== "cancelled").length;
    const rev = list.filter((a) => a.status === "done")
      .reduce((s, a) => s + (services.find((sv) => sv.id === a.serviceId)?.price ?? 0), 0);
    return { ...b, occupancy: Math.round((booked / slots) * 100), revenue: rev, bookings: list.length };
  });

  // bookings count per stylist (scoped to active branch — matches commissions)
  const branchStylists = active === "all" ? stylists : stylists.filter((s) => s.branchId === active);
  const stylistBookings = branchStylists.map((st) => ({
    ...st,
    bookings: scoped.filter((a) => a.stylistId === st.id && a.status !== "cancelled").length,
  })).sort((a, b) => b.bookings - a.bookings).slice(0, 5);

  // seniority chart — sorted senior → junior, same branch scope as commissions
  const levelRank: Record<string, number> = { Master: 0, Senior: 1, Stylist: 2, Junior: 3 };
  const senioritySorted = [...branchStylists].sort((a, b) => {
    const r = levelRank[a.level] - levelRank[b.level];
    return r !== 0 ? r : b.yearsExp - a.yearsExp;
  });
  const maxYears = Math.max(...branchStylists.map((s) => s.yearsExp), 1);

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-end">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold mb-5">
            <Sparkles className="size-3.5" /> Today · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05]">
            One console for <em className="text-gold not-italic">every chair</em>,
            <br /> every channel, every branch.
          </h1>
          <p className="mt-5 text-muted-foreground max-w-xl">
            Bookings from WhatsApp, web, calls and walk-ins land in a single calendar.
            Commissions calculate themselves. Owners see all branches in one glance.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 items-center">
            <Link to="/calendar" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
              Open today's calendar <ArrowUpRight className="size-4" />
            </Link>
            <Link to="/commissions" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:bg-accent">
              View commissions
            </Link>
            <a href={`tel:${SALON_PHONE_TEL}`}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-5 py-2.5 text-sm text-gold hover:bg-gold/10">
              <Phone className="size-4" /> Book by call · {SALON_PHONE}
            </a>
          </div>

        </div>

        {/* KPI stack */}
        <div className="grid grid-cols-2 gap-3">
          <KpiCard icon={<TrendingUp className="size-4" />} label="Revenue today" value={`₹${revenueToday.toLocaleString("en-IN")}`} accent />
          <KpiCard icon={<Sparkles className="size-4" />} label="Commission paid" value={`₹${Math.round(commissionToday).toLocaleString("en-IN")}`} />
          <KpiCard icon={<CalIcon className="size-4" />} label="Upcoming today" value={String(upcoming)} />
          <KpiCard icon={<Users className="size-4" />} label="Active customers" value={String(customers.length)} />
        </div>
      </section>

      {/* Branch grid */}
      <section className="mt-16">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-2xl">All branches</h2>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Live · refreshes every 30s</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branchStats.map((b) => (
            <div key={b.id} className="group relative rounded-2xl border border-border bg-card p-6 overflow-hidden hover:border-gold/60 transition-colors">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{b.city}</div>
                  <div className="font-display text-xl mt-1">{b.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Occupancy</div>
                  <div className={`font-display text-2xl ${b.occupancy > 75 ? "text-warning" : "text-foreground"}`}>{b.occupancy}%</div>
                </div>
              </div>
              <div className="mt-5 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold to-gold-soft" style={{ width: `${Math.min(100, b.occupancy)}%` }} />
              </div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Revenue today</div>
                  <div className="font-medium">₹{b.revenue.toLocaleString("en-IN")}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Bookings</div>
                  <div className="font-medium">{b.bookings}</div>
                </div>
                <button
                  onClick={() => { (document.activeElement as HTMLElement)?.blur(); import("@/lib/salon-store").then(({ store }) => store.setBranch(b.id)); }}
                  className="rounded-full border border-border px-3 py-1 text-xs hover:bg-accent"
                >
                  Focus
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Channels + Top stylists */}
      <section className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl">Bookings by channel</h3>
          <p className="text-xs text-muted-foreground mt-1">Omnichannel funnel — today, scoped to {active === "all" ? "all branches" : branches.find((b) => b.id === active)?.name}</p>
          <div className="mt-6 space-y-3">
            {Object.entries(channelMeta).map(([k, meta]) => {
              const count = channels[k] ?? 0;
              const pct = Math.round((count / totalChan) * 100);
              return (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full" style={{ background: meta.color }} />
                      {meta.label}
                    </span>
                    <span className="text-muted-foreground">{count} · {pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full" style={{ width: `${pct}%`, background: meta.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-xl">Most-booked stylists</h3>
          <p className="text-xs text-muted-foreground mt-1">Live bookings count — updates the moment a slot is locked</p>
          <div className="mt-5 divide-y divide-border/60">
            {stylistBookings.every((s) => s.bookings === 0) ? (
              <div className="py-10 text-center">
                <div className="mx-auto size-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-3">
                  <Sparkles className="size-5 text-gold" />
                </div>
                <div className="text-sm font-medium">No bookings yet</div>
                <div className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Lock the first slot to see who's pulling the crowd.
                </div>
              </div>
            ) : (
              stylistBookings.map((s, i) => {
                const max = stylistBookings[0]?.bookings || 1;
                return (
                  <div key={s.id} className="py-3 flex items-center gap-4">
                    <div className="text-muted-foreground tabular-nums w-5">{i + 1}</div>
                    <div className="size-9 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center text-xs font-medium">{s.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{branches.find((b) => b.id === s.branchId)?.name}</div>
                    </div>
                    <div className="flex-[1.4] hidden sm:block">
                      <div className="h-1 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gold to-gold-soft" style={{ width: `${(s.bookings / max) * 100}%` }} />
                      </div>
                    </div>
                    <div className="font-display text-base tabular-nums">{s.bookings}</div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground hidden md:block">{s.bookings === 1 ? "booking" : "bookings"}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Seniority chart */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-2xl">Stylist roster · by seniority</h2>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Master → Junior</span>
        </div>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_1.4fr_auto] gap-x-4 gap-y-0 px-6 py-3 border-b border-border bg-secondary/30 text-[11px] uppercase tracking-widest text-muted-foreground">
            <div>Rank</div><div>Stylist</div><div>Level</div><div className="hidden md:block">Experience</div><div className="text-right">Years</div>
          </div>
          <div className="divide-y divide-border/60">
            {senioritySorted.map((s, i) => {
              const levelStyle: Record<string, string> = {
                Master: "bg-gold/15 text-gold border-gold/40",
                Senior: "bg-primary/15 text-primary border-primary/40",
                Stylist: "bg-secondary text-foreground border-border",
                Junior: "bg-muted text-muted-foreground border-border",
              };
              return (
                <div key={s.id} className="grid grid-cols-[auto_1fr_auto_1.4fr_auto] gap-x-4 items-center px-6 py-4">
                  <div className="text-muted-foreground tabular-nums w-5">{i + 1}</div>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center text-xs font-medium shrink-0">{s.avatar}</div>
                    <div className="min-w-0">
                      <div className="text-sm truncate">{s.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{s.specialties.join(" · ")}</div>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-widest ${levelStyle[s.level]}`}>{s.level}</span>
                  </div>
                  <div className="hidden md:block">
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gold to-gold-soft" style={{ width: `${(s.yearsExp / maxYears) * 100}%` }} />
                    </div>
                  </div>
                  <div className="font-display text-lg tabular-nums text-right">{s.yearsExp}<span className="text-xs text-muted-foreground ml-1">yr</span></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function KpiCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-gold/40 bg-gradient-to-br from-gold/10 to-transparent" : "border-border bg-card"}`}>
      <div className={`flex items-center gap-2 text-xs uppercase tracking-widest ${accent ? "text-gold" : "text-muted-foreground"}`}>
        {icon} {label}
      </div>
      <div className="mt-3 font-display text-3xl tabular-nums">{value}</div>
    </div>
  );
}
