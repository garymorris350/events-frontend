import { useRouter } from "next/router";
import { useEffect, useState, FormEvent } from "react";
import { createSignup, getEvent, type Event } from "@/lib/api";
import { googleCalUrl } from "@/lib/calendar";

type FirestoreTimestampish = { _seconds: number } | string | Date;

function toDate(v: FirestoreTimestampish): Date {
  if (v instanceof Date) return v;
  if (typeof v === "string") return new Date(v);
  if (v && typeof v === "object" && "_seconds" in v && typeof v._seconds === "number") {
    return new Date(v._seconds * 1000);
  }
  return new Date(String(v));
}

export default function EventDetail() {
  const router = useRouter();
  const { id } = (router.query as { id?: string }) || {};
  const [data, setData] = useState<Event | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const d = await getEvent(id);
        setData(d);
      } catch {
        setMsg("Event not found");
      }
    })();
  }, [id]);

  if (!data) {
    return <main className="max-w-xl mx-auto p-6">{msg || "Loading…"}</main>;
  }

  const event: Event = data;
  const start = toDate((event as any).start);
  const end = toDate((event as any).end);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    try {
      await createSignup({ eventId: event.id, name, email });
      setMsg("Thanks for signing up!");
      setName("");
      setEmail("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setMsg(message);
    }
  }

  // Build calendar URLs
  const googleUrl = googleCalUrl({
    title: event.title,
    details: event.description,
    location: event.location,
    start,
    end,
  });
  const icsUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${event.id}/ics`;

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p>{event.description}</p>
      <p>
        <strong>When:</strong> {start.toLocaleString()} – {end.toLocaleString()}
      </p>
      <p>
        <strong>Where:</strong> {event.location}
      </p>

      <form onSubmit={onSubmit} className="space-y-3 border p-4 rounded">
        <div>
          <label className="block text-sm">Name</label>
          <input
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="px-3 py-2 bg-black text-white rounded">Sign Up</button>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>

      {msg === "Thanks for signing up!" && (
        <div className="space-y-2">
          <p className="font-medium">Add this event to your calendar:</p>
          <div className="flex gap-3">
            <a
              href={googleUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
            >
              Google Calendar
            </a>
            <a
              href={icsUrl}
              className="px-3 py-2 rounded border border-purple-600 text-purple-700 hover:bg-purple-50"
            >
              Download .ics
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
