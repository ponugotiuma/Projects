import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSalonStore } from "@/lib/salon-store";
import { branches, services, stylists, customers, channelMeta, type Appointment } from "@/lib/salon-data";
import { Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/commissions")({
  head: () => ({ meta: [{ title: "Commissions · Lumière Salon OS" }] }),
  component: Commissions,
});

function Commissions() {
  const appts = useSalonStore((s) => s.appointments);
  const active = useSalonStore((s) => s.activeBranchId);
  const scoped = active === "all" ? appts : appts.filter((a) => a.branchId === active);

  const [stylistFilter, setStylistFilter] = useState<string>("all");
  const [drawerStylistId, setDrawerStylistId] = useState<string | null>(null);

  const levelRank: Record<string, number> = { Master: 0, Senior: 1, Stylist: 2, Junior: 3 };
  const branchStylists = stylists.filter((s) => active === "all" || s.branchId === active);
  const visibleStylists = stylistFilter === "all" ? branchStylists : branchStylists.filter((s) => s.id === stylistFilter);

  const byStylist = visibleStylists.map((s) => {
      const done = scoped.filter((a) => a.stylistId === s.id && a.status === "done");
      const total = done.reduce((sum, a) => sum + (a.commission ?? 0), 0);
      const revenue = done.reduce((sum, a) => sum + (services.find((sv) => sv.id === a.serviceId)?.price ?? 0), 0);
      return { ...s, total, revenue, services: done.length };
    }).sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      const r = levelRank[a.level] - levelRank[b.level];
      return r !== 0 ? r : b.yearsExp - a.yearsExp;
    });

  const totalCommission = byStylist.reduce((s, x) => s + x.total, 0);

  // recent done log (respects stylist filter)
  const log = scoped.filter((a) => a.status === "done" && (stylistFilter === "all" || a.stylistId === stylistFilter))
    .sort((a, b) => +new Date(b.start) - +new Date(a.start)).slice(0, 12);

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">Commission Engine</div>
          <h1 className="font-display text-4xl mt-2">Earnings ledger</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Auto-calculated the moment a stylist marks a service done. Zero spreadsheets, zero arguments.
          </p>
        </div>
        <div className="rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/10 to-transparent px-6 py-4">
          <div className="text-[11px] uppercase tracking-widest text-gold flex items-center gap-2"><Sparkles className="size-3.5" /> Paid out today</div>
          <div className="font-display text-3xl mt-1 tabular-nums">₹{Math.round(totalCommission).toLocaleString("en-IN")}</div>
        </div>
      </div>

      {/* Stylist filter */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-widest text-muted-foreground mr-1">Filter</span>
        <button
          onClick={() => setStylistFilter("all")}
          className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${stylistFilter === "all" ? "border-gold bg-gold/10 text-gold" : "border-border bg-secondary hover:bg-accent"}`}
        >
          All stylists
        </button>
        {branchStylists.map((s) => (
          <button
            key={s.id}
            onClick={() => setStylistFilter(s.id)}
            className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${stylistFilter === s.id ? "border-gold bg-gold/10 text-gold" : "border-border bg-secondary hover:bg-accent"}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Stylist leaderboard */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex justify-between items-baseline">
            <h2 className="font-display text-xl">Stylist leaderboard</h2>
            <span className="text-xs text-muted-foreground">{active === "all" ? "All branches" : branches.find((b) => b.id === active)?.name}</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="text-left font-normal py-3 px-6">Stylist</th>
                <th className="text-right font-normal py-3">Services</th>
                <th className="text-right font-normal py-3">Revenue</th>
                <th className="text-right font-normal py-3 px-6">Commission</th>
              </tr>
            </thead>
            <tbody>
              {byStylist.map((s) => (
                <tr key={s.id} onClick={() => setDrawerStylistId(s.id)} className="border-t border-border/60 hover:bg-accent/30 cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center text-xs font-medium">{s.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{s.name}</span>
                          <span className="inline-flex items-center rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{s.level}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">{branches.find((b) => b.id === s.branchId)?.name} · {s.yearsExp} yr</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right tabular-nums">{s.services}</td>
                  <td className="text-right tabular-nums text-muted-foreground">₹{s.revenue.toLocaleString("en-IN")}</td>
                  <td className="text-right font-display text-lg tabular-nums px-6 text-gold">₹{Math.round(s.total).toLocaleString("en-IN")}</td>
                </tr>
              ))}
              {byStylist.length === 0 && (
                <tr><td colSpan={4} className="py-10 text-center text-muted-foreground text-sm">No stylists for this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent payouts */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display text-xl">Recent payouts</h2>
            <p className="text-xs text-muted-foreground mt-1">Live as services complete</p>
          </div>
          <div className="divide-y divide-border/60 max-h-[460px] overflow-y-auto">
            {log.map((a) => {
              const svc = services.find((s) => s.id === a.serviceId)!;
              const cust = customers.find((c) => c.id === a.customerId)!;
              const st = stylists.find((s) => s.id === a.stylistId)!;
              const chan = channelMeta[a.channel];
              return (
                <div key={a.id} className="px-6 py-4 flex items-center gap-3">
                  <span className="size-2 rounded-full mt-1.5" style={{ background: chan.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{svc.name} · <span className="text-muted-foreground">{cust.name}</span></div>
                    <div className="text-[11px] text-muted-foreground">{st.name} · {new Date(a.start).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-base tabular-nums text-gold">+₹{Math.round(a.commission ?? 0)}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{svc.commissionPct}% of ₹{svc.price}</div>
                  </div>
                </div>
              );
            })}
            {log.length === 0 && <div className="px-6 py-10 text-center text-muted-foreground text-sm">Mark a service done on the calendar to see payouts appear here.</div>}
          </div>
        </div>
      </section>

      {/* Formula */}
      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-xl">How commission is calculated</h3>
        <div className="mt-4 font-mono text-sm bg-secondary/60 rounded-lg p-4">
          commission = service.price × service.commissionPct
        </div>
        <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
          Calculated and frozen onto the appointment row the moment the stylist marks the service complete —
          so future price changes never rewrite history. Owners get an immutable, auditable ledger.
        </p>
      </section>

      {drawerStylistId && (
        <StylistDrawer
          stylistId={drawerStylistId}
          appts={appts}
          onClose={() => setDrawerStylistId(null)}
        />
      )}
    </main>
  );
}

function StylistDrawer({ stylistId, appts, onClose }: { stylistId: string; appts: Appointment[]; onClose: () => void }) {
  const s = stylists.find((x) => x.id === stylistId);
  if (!s) return null;
  const branch = branches.find((b) => b.id === s.branchId);
  const history = appts.filter((a) => a.stylistId === s.id)
    .sort((a, b) => +new Date(b.start) - +new Date(a.start));
  const doneCount = history.filter((a) => a.status === "done").length;
  const totalCommission = history.reduce((sum, a) => sum + (a.commission ?? 0), 0);
  const totalRevenue = history.filter((a) => a.status === "done")
    .reduce((sum, a) => sum + (services.find((sv) => sv.id === a.serviceId)?.price ?? 0), 0);

  const levelStyle: Record<string, string> = {
    Master: "bg-gold/15 text-gold border-gold/40",
    Senior: "bg-primary/15 text-primary border-primary/40",
    Stylist: "bg-secondary text-foreground border-border",
    Junior: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md h-full bg-card border-l border-border overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-12 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center text-sm font-medium shrink-0">{s.avatar}</div>
            <div className="min-w-0">
              <div className="font-display text-xl truncate">{s.name}</div>
              <div className="text-xs text-muted-foreground truncate">{branch?.name} · {branch?.city}</div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${levelStyle[s.level]}`}>{s.level}</span>
                <span className="text-[11px] text-muted-foreground">{s.yearsExp} years experience</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground shrink-0"><X className="size-4" /></button>
        </div>

        <div className="p-6 grid grid-cols-3 gap-2">
          <Stat label="Services" value={String(doneCount)} />
          <Stat label="Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} />
          <Stat label="Earned" value={`₹${Math.round(totalCommission).toLocaleString("en-IN")}`} accent />
        </div>

        <div className="px-6">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Specialties</div>
          <div className="flex flex-wrap gap-1.5">
            {s.specialties.map((sp) => (
              <span key={sp} className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-xs">{sp}</span>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Appointment history</div>
          {history.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No appointments yet.
            </div>
          ) : (
            <div className="divide-y divide-border/60 rounded-xl border border-border bg-secondary/20 overflow-hidden">
              {history.map((a) => {
                const svc = services.find((sv) => sv.id === a.serviceId)!;
                const cust = customers.find((c) => c.id === a.customerId);
                const chan = channelMeta[a.channel];
                const statusColor: Record<string, string> = {
                  done: "text-success",
                  confirmed: "text-foreground",
                  pending: "text-warning",
                  cancelled: "text-muted-foreground line-through",
                };
                return (
                  <div key={a.id} className="px-4 py-3 flex items-center gap-3">
                    <span className="size-2 rounded-full shrink-0" style={{ background: chan.color }} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm truncate ${statusColor[a.status]}`}>{svc.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {cust?.name ?? "Guest"} · {new Date(a.start).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{a.status}</div>
                      {a.commission ? <div className="text-xs text-gold tabular-nums">+₹{Math.round(a.commission)}</div> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? "border-gold/40 bg-gold/5" : "border-border bg-secondary/40"}`}>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-lg tabular-nums ${accent ? "text-gold" : ""}`}>{value}</div>
    </div>
  );
}
