import { useState } from "react";
import { createEvent } from "@/lib/api";

export default function Admin() {
  const [form, setForm] = useState<any>({
    title: "", description: "", location: "",
    start: "", end: ""
  });
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [link, setLink] = useState("");

  function set<K extends string>(k: K, v: any) { setForm((f:any) => ({ ...f, [k]: v })); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(""); setLink("");
    try {
      const res = await createEvent(form, pass);
      setMsg("Event created!");
      setLink(`/events/${res.id}`);
    } catch (err: any) {
      setMsg(err.message || "Failed to create");
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin — Create Event</h1>
      <form onSubmit={onSubmit} className="space-y-3 border p-4 rounded">
        <input className="border p-2 w-full" placeholder="Title" value={form.title} onChange={e=>set("title", e.target.value)} required />
        <textarea className="border p-2 w-full" placeholder="Description" value={form.description} onChange={e=>set("description", e.target.value)} required />
        <input className="border p-2 w-full" placeholder="Location" value={form.location} onChange={e=>set("location", e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <input className="border p-2 w-full" type="datetime-local" value={form.start} onChange={e=>set("start", e.target.value)} required />
          <input className="border p-2 w-full" type="datetime-local" value={form.end} onChange={e=>set("end", e.target.value)} required />
        </div>
        <input className="border p-2 w-full" placeholder="Admin passcode" value={pass} onChange={e=>setPass(e.target.value)} required />
        <button className="px-3 py-2 bg-black text-white rounded">Create</button>
        {msg && <p className="text-sm">{msg}</p>}
        {link && <p className="text-sm">Event link: <a className="underline text-blue-600" href={link}>{link}</a></p>}
      </form>
    </main>
  );
}
