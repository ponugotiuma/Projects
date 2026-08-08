import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { store, useSalonStore } from "@/lib/salon-store";
import { branches, channelMeta, customers, DAY_END_HOUR, DAY_START_HOUR, SALON_PHONE, SALON_PHONE_TEL, services, stylists, type Channel } from "@/lib/salon-data";
import { Check, MessageCircle, Phone, Plus, X } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar · Lumière Salon OS" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const appts = useSalonStore((s) => s.appointments);
  const active = useSalonStore((s) => s.activeBranchId);
  const branchId = active === "all" ? "b1" : active;
  const branchStylists = useMemo(() => stylists.filter((s) => s.branchId === branchId), [branchId]);

  const [showBot, setShowBot] = useState(false);
  const [newBooking, setNewBooking] = useState<{ stylistId: string; hour: number; min: number } | null>(null);

  // hourly rows
  const hours = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, i) => DAY_START_HOUR + i);

  const todays = appts.filter((a) => a.branchId === branchId && a.status !== "cancelled");

  function findAppt(stylistId: string, hour: number) {
    return todays.find((a) => {
      const d = new Date(a.start);
      return a.stylistId === stylistId && d.getHours() === hour;
    });
  }

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-8">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">Omnichannel Calendar</div>
          <h1 className="font-display text-4xl mt-2">
            {active === "all" ? "Lumière Bandra" : branches.find((b) => b.id === branchId)?.name}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">15-minute slot locking · double-booking prevented at the schema level</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBot(true)}
            className="rounded-full border border-border bg-secondary px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent">
            <MessageCircle className="size-4" /> Simulate WhatsApp booking
          </button>
        </div>
      </div>

      {/* Channel legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {Object.entries(channelMeta).map(([k, m]) => (
          <span key={k} className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-2 rounded-full" style={{ background: m.color }} /> {m.label}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: `90px repeat(${branchStylists.length}, minmax(0, 1fr))` }}>
          <div className="p-3 border-b border-r border-border bg-secondary/40"></div>
          {branchStylists.map((s) => (
            <div key={s.id} className="p-3 border-b border-border bg-secondary/40 flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center text-xs font-medium">{s.avatar}</div>
              <div className="min-w-0">
                <div className="text-sm truncate">{s.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Senior Stylist</div>
              </div>
            </div>
          ))}

          {hours.map((h) => (
            <div key={h} className="contents">
              <div className="p-3 border-r border-b border-border text-xs text-muted-foreground tabular-nums">
                {h.toString().padStart(2, "0")}:00
              </div>
              {branchStylists.map((s) => {
                const a = findAppt(s.id, h);
                if (!a) {
                  return (
                    <button key={s.id + h}
                      onClick={() => setNewBooking({ stylistId: s.id, hour: h, min: 0 })}
                      className="border-b border-l border-border hover:bg-accent/40 transition-colors group h-20 flex items-center justify-center"
                    >
                      <Plus className="size-4 text-muted-foreground/40 group-hover:text-gold transition-colors" />
                    </button>
                  );
                }
                const svc = services.find((sv) => sv.id === a.serviceId)!;
                const cust = customers.find((c) => c.id === a.customerId)!;
                const chan = channelMeta[a.channel];
                return (
                  <div key={s.id + h} className="border-b border-l border-border p-2 h-20 relative">
                    <div className="h-full rounded-lg p-2.5 relative overflow-hidden"
                      style={{ background: `color-mix(in oklab, ${chan.color} 18%, var(--card))`, borderLeft: `3px solid ${chan.color}` }}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">{cust.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{svc.name} · ₹{svc.price}</div>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest" style={{ color: chan.color }}>{chan.label}</span>
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 flex gap-1">
                        {a.status === "pending" && (
                          <button onClick={() => store.confirmPending(a.id)} title="Confirm"
                            className="size-5 rounded-full bg-warning/20 text-warning hover:bg-warning/30 flex items-center justify-center text-[10px]">!</button>
                        )}
                        {a.status === "confirmed" && (
                          <button onClick={() => store.markDone(a.id)} title="Mark done"
                            className="size-5 rounded-full bg-success/20 text-success hover:bg-success/30 flex items-center justify-center">
                            <Check className="size-3" />
                          </button>
                        )}
                        {a.status === "done" && (
                          <span className="text-[9px] uppercase tracking-widest text-success">✓ Done · +₹{Math.round(a.commission ?? 0)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {showBot && <WhatsAppBot onClose={() => setShowBot(false)} branchId={branchId} />}
      {newBooking && <NewBookingModal {...newBooking} branchId={branchId} onClose={() => setNewBooking(null)} />}
    </main>
  );
}

function WhatsAppBot({ onClose, branchId }: { onClose: () => void; branchId: string }) {
  const branchStylists = stylists.filter((s) => s.branchId === branchId);
  const [step, setStep] = useState(0);
  const [pickedStylist, setPickedStylist] = useState<string | null>(null);
  const [pickedHour, setPickedHour] = useState<number | null>(null);

  const messages: { from: "bot" | "user"; text: string }[] = [];
  messages.push({ from: "user", text: "Book haircut" });
  messages.push({ from: "bot", text: `Hi! Welcome to Lumière. Choose your stylist:\n${branchStylists.map((s, i) => `${i + 1}. ${s.name}`).join("\n")}` });
  if (step >= 1 && pickedStylist) {
    const s = branchStylists.find((x) => x.id === pickedStylist)!;
    messages.push({ from: "user", text: `${branchStylists.indexOf(s) + 1}` });
    messages.push({ from: "bot", text: `Great. Available slots today with ${s.name.split(" ")[0]}: 4:00 PM, 4:30 PM, 5:00 PM. Reply with time.` });
  }
  if (step >= 2 && pickedHour) {
    messages.push({ from: "user", text: `${pickedHour}:00` });
    messages.push({ from: "bot", text: `Locked for 2 mins ⏳ — confirming…` });
  }
  if (step >= 3) {
    messages.push({ from: "bot", text: `✨ Confirmed! See you at ${pickedHour}:00 PM. Reply CANCEL anytime.` });
  }

  function confirm() {
    if (!pickedStylist || !pickedHour) return;
    const d = new Date(); d.setHours(pickedHour, 0, 0, 0);
    const demoCustomer = {
      id: "c" + Date.now(),
      name: "WhatsApp Guest",
      phone: "+91 90000 00000",
    };
    customers.push(demoCustomer);
    const ok = store.addAppointment({
      id: "wa" + Date.now(),
      customerId: demoCustomer.id,
      stylistId: pickedStylist,
      serviceId: "sv1",
      branchId,
      start: d.toISOString(),
      channel: "whatsapp" as Channel,
      status: "confirmed",
    });
    if (ok) setStep(3);
  }


  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/40">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-channel-whatsapp/20 text-channel-whatsapp flex items-center justify-center">
              <MessageCircle className="size-4" />
            </div>
            <div>
              <div className="text-sm font-medium">Lumière on WhatsApp</div>
              <div className="text-[11px] text-muted-foreground">Bot · online</div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto space-y-2 bg-background/30">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${m.from === "bot" ? "bg-secondary mr-auto rounded-bl-sm" : "bg-channel-whatsapp/20 text-foreground ml-auto rounded-br-sm"}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-border space-y-2">
          {step === 0 && (
            <div className="flex flex-wrap gap-2">
              {branchStylists.map((s, i) => (
                <button key={s.id} onClick={() => { setPickedStylist(s.id); setStep(1); }}
                  className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent">{i + 1}. {s.name.split(" ")[0]}</button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="flex gap-2">
              {[16, 17, 18].map((h) => (
                <button key={h} onClick={() => { setPickedHour(h); setStep(2); setTimeout(confirm, 500); }}
                  className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent">{h}:00</button>
              ))}
            </div>
          )}
          {step >= 2 && (
            <button onClick={onClose} className="w-full rounded-full bg-primary text-primary-foreground py-2 text-sm font-medium">Close · See it in calendar</button>
          )}
        </div>
      </div>
    </div>
  );
}

function NewBookingModal({ stylistId, hour, branchId, onClose }: { stylistId: string; hour: number; min: number; branchId: string; onClose: () => void }) {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<Channel>("walkin");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedName = name.trim();
  const phoneDigits = phone.replace(/\D/g, "");
  const nameValid = trimmedName.length >= 2 && trimmedName.length <= 60;
  const phoneRequired = channel === "whatsapp" || channel === "call";
  const phoneValid = phoneRequired ? phoneDigits.length === 10 : (phoneDigits.length === 0 || phoneDigits.length === 10);
  const canSubmit = nameValid && phoneValid && confirmed;

  function submit() {
    if (!nameValid) return setError("Enter a valid customer name (2–60 chars).");
    if (phoneRequired && phoneDigits.length !== 10) return setError("Enter a valid 10-digit mobile number.");
    if (phoneDigits.length > 0 && phoneDigits.length !== 10) return setError("Mobile number must be 10 digits or left blank.");
    if (!confirmed) return setError("Please confirm the customer details.");

    const newCustomer = {
      id: "c" + Date.now(),
      name: trimmedName,
      phone: phoneDigits.length === 10
        ? "+91 " + phoneDigits.slice(0, 5) + " " + phoneDigits.slice(5)
        : "—",
    };
    customers.push(newCustomer);

    const d = new Date(); d.setHours(hour, 0, 0, 0);
    store.addAppointment({
      id: "m" + Date.now(),
      customerId: newCustomer.id, stylistId, serviceId, branchId,
      start: d.toISOString(), channel, status: "confirmed",
    });

    // Auto-open WhatsApp chat after booking via WhatsApp
    if (channel === "whatsapp" && phoneDigits.length === 10) {
      const svc = services.find((s) => s.id === serviceId)!;
      const st = stylists.find((s) => s.id === stylistId)!;
      const msg = encodeURIComponent(
        `Hi ${trimmedName.split(" ")[0]}! Your ${svc.name} with ${st.name} at ${hour}:00 is confirmed at Lumière. Reply CANCEL to release the slot.`
      );
      window.open(`https://wa.me/91${phoneDigits}?text=${msg}`, "_blank", "noopener");
    }
    onClose();
  }

  const channelOptions: { value: Channel; label: string }[] = [
    { value: "walkin", label: "Walk-in" },
    { value: "call", label: "Phone call" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "web", label: "Website" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-widest text-gold">New booking</div>
            <h3 className="font-display text-2xl mt-1">{stylists.find((s) => s.id === stylistId)?.name} · {hour}:00</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground"><X className="size-4" /></button>
        </div>
        <div className="mt-5 space-y-4">
          <Field label="Booking channel">
            <div className="grid grid-cols-4 gap-1.5">
              {channelOptions.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => { setChannel(c.value); setError(null); }}
                  className={`rounded-lg border px-2 py-2 text-xs transition-colors ${channel === c.value ? "border-gold bg-gold/10 text-gold" : "border-border bg-secondary hover:bg-accent"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </Field>

          {channel === "call" && (
            <a
              href={`tel:${SALON_PHONE_TEL}`}
              className="flex items-center gap-3 rounded-xl border border-gold/40 bg-gradient-to-br from-gold/10 to-transparent px-4 py-3 hover:bg-gold/15 transition-colors"
            >
              <div className="size-9 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                <Phone className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-gold">Tap to dial the salon</div>
                <div className="text-sm font-display tabular-nums">{SALON_PHONE}</div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Call now</span>
            </a>
          )}

          <Field label="Customer name">
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              placeholder="e.g. Ananya Verma"
              maxLength={60}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
            />
          </Field>

          {channel !== "web" && (
            <Field label={`Mobile number${phoneRequired ? "" : " (optional)"}`}>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground px-3 py-2 bg-secondary border border-border rounded-lg">+91</span>
                <input
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(null); }}
                  placeholder="10-digit mobile"
                  inputMode="numeric"
                  className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm tabular-nums"
                />
              </div>
              {phone && phoneDigits.length !== 10 && <div className="text-[11px] text-warning mt-1">Mobile must be 10 digits.</div>}
              {channel === "whatsapp" && phoneValid && phoneDigits.length === 10 && (
                <div className="text-[11px] text-channel-whatsapp mt-1.5 flex items-center gap-1.5">
                  <MessageCircle className="size-3" /> WhatsApp confirmation opens after you lock the slot.
                </div>
              )}
            </Field>
          )}

          <Field label="Service">
            <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm">
              {services.map((s) => <option key={s.id} value={s.id}>{s.name} · ₹{s.price} · {s.commissionPct}% comm</option>)}
            </select>
          </Field>

          <label className="flex items-start gap-2.5 cursor-pointer select-none rounded-lg border border-border bg-secondary/40 p-3">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => { setConfirmed(e.target.checked); setError(null); }}
              className="mt-0.5 size-4 accent-gold cursor-pointer"
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              I confirm the customer details above are correct{phoneDigits.length === 10 && <> and consent to send appointment updates to <span className="text-foreground">+91 {phoneDigits}</span></>}.
            </span>
          </label>

          {error && <div className="text-xs text-destructive">{error}</div>}
        </div>
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="mt-6 w-full rounded-full bg-primary text-primary-foreground py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Lock the slot
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">{label}</div>
      {children}
    </div>
  );
}
