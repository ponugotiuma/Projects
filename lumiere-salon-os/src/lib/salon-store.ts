import { useSyncExternalStore } from "react";
import { Appointment, initialAppointments, services } from "./salon-data";

let state = {
  appointments: [...initialAppointments],
  activeBranchId: "b1" as string | "all",
};

type State = typeof state;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const store = {
  getState: () => state,
  subscribe: (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; },
  setBranch(id: string) { state = { ...state, activeBranchId: id }; emit(); },
  addAppointment(a: Appointment) {
    // prevent overlap on same stylist + start
    const exists = state.appointments.some(
      (x) => x.stylistId === a.stylistId && x.start === a.start && x.status !== "cancelled"
    );
    if (exists) return false;
    state = { ...state, appointments: [...state.appointments, a] };
    emit();
    return true;
  },
  markDone(id: string) {
    state = {
      ...state,
      appointments: state.appointments.map((a) => {
        if (a.id !== id) return a;
        const svc = services.find((s) => s.id === a.serviceId)!;
        return { ...a, status: "done", commission: svc.price * (svc.commissionPct / 100) };
      }),
    };
    emit();
  },
  confirmPending(id: string) {
    state = { ...state, appointments: state.appointments.map((a) => a.id === id ? { ...a, status: "confirmed" } : a) };
    emit();
  },
  cancel(id: string) {
    state = { ...state, appointments: state.appointments.map((a) => a.id === id ? { ...a, status: "cancelled" } : a) };
    emit();
  },
};

export function useSalonStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()), () => selector(store.getState()));
}
