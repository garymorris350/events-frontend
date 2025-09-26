// src/pages/events/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState, FormEvent } from "react";
import { getEvent, createSignup, type Event } from "@/lib/api";
import { googleCalUrl } from "@/lib/calendar";
import Custom404 from "../404"; // ✅ reuse your 404 page

type FirestoreTimestampish = { _seconds: number } | string | Date;

function toDate(v: FirestoreTimestampish): Date {
  if (v instanceof Date) return v;
  if (typeof v === "string") return new Date(v);
  if (v && typeof v === "object" && "_seconds" in v) {
    return new Date(v._seconds * 1000);
  }
  return new Date(String(v));
}

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = (router.query as { id?: string }) || {};

  const [event, setEvent] = useState<Event | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const d = await getEvent(id);
        if (!d) setNotFound(true);
        else setEvent(d);
      } catch {
        setNotFound(true);
      }
    })();
  }, [id]);

  // ✅ Show your custom 404 page if event not found
  if (notFound) {
    return <Custom404 />;
  }

  if (!event) {
    return <main className="max-w-xl mx-auto p-6">Loading…</main>;
  }

  const e = event;
  const start = toDate(e.start);
  const end = toDate(e.end);

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setMsg("");

    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await createSignup({ eventId: e.id, name, email });
      setMsg("Thanks for signing up!");
      setName("");
      setEmail("");
      setErrors({});
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const googleUrl = googleCalUrl({
    title: e.title,
    details: e.description,
    location: e.location,
    start,
    end,
  });
  const icsUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${e.id}/ics`;

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{e.title}</h1>
      {e.description && <p>{e.description}</p>}
      <p>
        <strong>When:</strong> {start.toLocaleString()} – {end.toLocaleString()}
      </p>
      {e.location && (
        <p>
          <strong>Where:</strong> {e.location}
        </p>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-3 border p-4 rounded">
        <div>
          <label htmlFor="name" className="block text-sm">
            Name
          </label>
          <input
            id="name"
            className="border p-2 w-full"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            autoComplete="name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="border p-2 w-full"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            autoComplete="email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <button
          className="px-3 py-2 bg-black text-white rounded disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting…" : "Sign Up"}
        </button>
        {msg && !errors.name && !errors.email && (
          <p className="text-sm mt-2">{msg}</p>
        )}
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
