export type Channel = "web" | "whatsapp" | "walkin" | "call";
export type AppointmentStatus = "pending" | "confirmed" | "done" | "cancelled";

export interface Branch { id: string; name: string; city: string; }
export type StylistLevel = "Master" | "Senior" | "Stylist" | "Junior";
export interface Stylist { id: string; name: string; branchId: string; avatar: string; level: StylistLevel; yearsExp: number; specialties: string[]; }
export interface Service { id: string; name: string; price: number; durationMin: number; commissionPct: number; }
export interface Customer { id: string; name: string; phone: string; }
export interface Appointment {
  id: string; customerId: string; stylistId: string; serviceId: string; branchId: string;
  start: string; // ISO
  channel: Channel; status: AppointmentStatus;
  commission?: number;
}

export const branches: Branch[] = [
  { id: "b1", name: "Lumière Bandra", city: "Mumbai" },
  { id: "b2", name: "Lumière Indiranagar", city: "Bengaluru" },
  { id: "b3", name: "Lumière CP", city: "Delhi" },
];

export const stylists: Stylist[] = [
  { id: "s1", name: "Priya Menon", branchId: "b1", avatar: "PM", level: "Master", yearsExp: 14, specialties: ["Bridal Makeup", "Hair Color"] },
  { id: "s4", name: "Vikram Rao", branchId: "b2", avatar: "VR", level: "Master", yearsExp: 12, specialties: ["Keratin", "Signature Cut"] },
  { id: "s2", name: "Rahul Sharma", branchId: "b1", avatar: "RS", level: "Senior", yearsExp: 8, specialties: ["Signature Cut", "Beard Sculpt"] },
  { id: "s6", name: "Arjun Das", branchId: "b3", avatar: "AD", level: "Senior", yearsExp: 7, specialties: ["Hair Color", "Spa"] },
  { id: "s3", name: "Aisha Khan", branchId: "b1", avatar: "AK", level: "Stylist", yearsExp: 4, specialties: ["Spa", "Signature Cut"] },
  { id: "s5", name: "Neha Iyer", branchId: "b2", avatar: "NI", level: "Junior", yearsExp: 2, specialties: ["Beard Sculpt", "Signature Cut"] },
];

export const services: Service[] = [
  { id: "sv1", name: "Signature Haircut", price: 1800, durationMin: 45, commissionPct: 25 },
  { id: "sv2", name: "Hair Color — Global", price: 4500, durationMin: 90, commissionPct: 20 },
  { id: "sv3", name: "Keratin Treatment", price: 6800, durationMin: 120, commissionPct: 18 },
  { id: "sv4", name: "Beard Sculpt", price: 700, durationMin: 30, commissionPct: 30 },
  { id: "sv5", name: "Spa & Head Massage", price: 1400, durationMin: 45, commissionPct: 22 },
  { id: "sv6", name: "Bridal Makeup", price: 12000, durationMin: 180, commissionPct: 15 },
];

export const customers: Customer[] = [];

// Generate today's appointments
function todayAt(h: number, m = 0): string {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}
// `todayAt` retained for future seed data; not used in the fresh-release state.
void todayAt;

export const initialAppointments: Appointment[] = [];

export const channelMeta: Record<Channel, { label: string; color: string }> = {
  web: { label: "Website", color: "var(--channel-web)" },
  whatsapp: { label: "WhatsApp", color: "var(--channel-whatsapp)" },
  walkin: { label: "Walk-in", color: "var(--channel-walkin)" },
  
  call: { label: "Call", color: "var(--channel-call)" },
};

export const SLOT_MINUTES = 15;
export const DAY_START_HOUR = 9;
export const DAY_END_HOUR = 20;

export const SALON_PHONE = "+91 88888 12345";
export const SALON_PHONE_TEL = "+918888812345";

export const referralSources = [
  { value: "web", label: "Website" },
  { value: "whatsapp", label: "WhatsApp" },
  
  { value: "call", label: "Phone call" },
  { value: "walkin", label: "Walk-in / passing by" },
] as const;
