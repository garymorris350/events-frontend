import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createSignup, getEvent } from "@/lib/api";
import { googleCalUrl } from "@/lib/calendar";

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [data, setData] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        // If your backend doesn't yet have GET /events/:id, add it.
        const d = await getEvent(id);
        setData(d);
      } catch {
        setMsg("Event not found");
      }
    })();
  }, [id]);

  if (!data) return <main className="max-w-xl mx-auto p-6">{msg || "Loading…"}</main>;

  const start = data.start?._seconds ? new Date(data.start._seconds * 1000) : new Date(data.start);
  const end = data.end?._seconds ? new Date(data.end._seconds * 1000) : new Date(data.end);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    try {
      await createSignup({ eventId: data.id, name, email });
      setMsg("Thanks for signing up!");
    } catch (err: any) {
      setMsg(err.message || "Signup failed");
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p>{data.description}</p>
      <p><strong>When:</strong> {start.toLocaleString()} – {end.toLocaleString()}</p>
      <p><strong>Where:</strong> {data.location}</p>

      <a
        className="inline-block px-3 py-2 border rounded"
        target="_blank" rel="noreferrer"
        href={googleCalUrl({
          title: data.title,
          details: data.description,
          location: data.location,
          start, end,
        })}
      >
        Add to Google Calendar
      </a>

      <form onSubmit={onSubmit} className="space-y-3 border p-4 rounded">
        <div>
          <label className="block text-sm">Name</label>
          <input className="border p-2 w-full" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input type="email" className="border p-2 w-full" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <button className="px-3 py-2 bg-black text-white rounded">Sign Up</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </main>
  );
}
