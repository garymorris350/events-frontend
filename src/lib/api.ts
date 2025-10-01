// src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!; // e.g. http://localhost:10000

export type PriceType = "free" | "fixed" | "pay_what_you_feel";

export type Event = {
  id: string;
  title: string;
  description: string;
  start: string;   // ISO string
  end: string;     // ISO string
  location: string;
  /** optional TMDb link */
  movieId?: string | null;

  // pricing/capacity (optional; matches backend schema if present)
  priceType?: PriceType;
  pricePence?: number | null;
  capacity?: number | null;
  isPaid?: boolean;

  createdAt?: string;
  updatedAt?: string;
};

export type CreateEventInput = {
  title: string;
  description: string;
  start: string;   // ISO string
  end: string;     // ISO string
  location: string;
  /** optional TMDb link */
  movieId?: string | null;

  // optional pricing fields
  priceType?: PriceType;
  pricePence?: number | null;
  capacity?: number | null;
  isPaid?: boolean;
};

export type SignupInput = {
  eventId: string;
  name: string;
  email: string;
  amountPence?: number;
};

export async function listEvents(): Promise<Event[]> {
  const r = await fetch(`${BASE}/events`, { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to load events");
  const data = await r.json();
  return Array.isArray(data) ? (data as Event[]) : (data.events as Event[]);
}

export async function getEvent(id: string): Promise<Event> {
  const r = await fetch(`${BASE}/events/${id}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Not found");
  return (await r.json()) as Event;
}

export async function createSignup(payload: SignupInput) {
  const r = await fetch(`${BASE}/signups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    let message = "Signup failed";
    try {
      const e = await r.json();
      if (e?.error) message = typeof e.error === "string" ? e.error : JSON.stringify(e.error);
    } catch {}
    throw new Error(message);
  }
  return r.json();
}

export async function startCheckout(eventTitle: string, amountPence: number): Promise<{ url: string }> {
  const r = await fetch(`${BASE}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventTitle, amountPence }),
  });
  if (!r.ok) {
    let message = "Checkout failed";
    try {
      const e = await r.json();
      if (e?.error) message = typeof e.error === "string" ? e.error : JSON.stringify(e.error);
    } catch {}
    throw new Error(message);
  }
  return r.json() as Promise<{ url: string }>;
}

export async function createEvent(payload: CreateEventInput, adminPass: string): Promise<Event> {
  const r = await fetch(`${BASE}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-passcode": adminPass },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    let message = "Create event failed";
    try {
      const e = await r.json();
      if (e?.error) message = typeof e.error === "string" ? e.error : JSON.stringify(e.error);
    } catch {}
    throw new Error(message);
  }
  return (await r.json()) as Event;
}
