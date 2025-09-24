const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!; // e.g. http://localhost:10000

export async function listEvents() {
  const r = await fetch(`${BASE}/events`, { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to load events");
  const data = await r.json();
  return Array.isArray(data) ? data : data.events;
}

export async function getEvent(id: string) {
  const r = await fetch(`${BASE}/events/${id}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Not found");
  return await r.json();
}

export async function createSignup(payload: { eventId: string; name: string; email: string; amountPence?: number }) {
  const r = await fetch(`${BASE}/signups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e.error ? JSON.stringify(e.error) : "Signup failed");
  }
  return await r.json();
}

export async function startCheckout(eventTitle: string, amountPence: number) {
  const r = await fetch(`${BASE}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventTitle, amountPence }),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e.error ? JSON.stringify(e.error) : "Checkout failed");
  }
  return (await r.json()) as { url: string };
}

export async function createEvent(payload: any, adminPass: string) {
  const r = await fetch(`${BASE}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-passcode": adminPass },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e.error ? JSON.stringify(e.error) : "Create event failed");
  }
  return await r.json();
}
