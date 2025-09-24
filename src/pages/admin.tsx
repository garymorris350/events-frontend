import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { createEvent, type CreateEventInput } from "@/lib/api";

type FormState = {
  title: string;
  description: string;
  location: string;
  start: string; // from <input type="datetime-local">
  end: string;   // from <input type="datetime-local">
};

export default function Admin() {
  const [form, setForm] = useState<FormState>({
    title: "", description: "", location: "", start: "", end: ""
  });
  const [pass, setPass] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [link, setLink] = useState<string>("");

  function setField<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(""); setLink("");

    const payload: CreateEventInput = {
      title: form.title,
      description: form.description,
      location: form.location,
      start: new Date(form.start).toISOString(),
      end: new Date(form.end).toISOString(),
    };

    try {
      const res = await createEvent(payload, pass);
      setMsg("Event created!");
      setLink(`/events/${res.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create";
      setMsg(message);
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setField(name as keyof FormState, value);
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin — Create Event</h1>

      <form onSubmit={onSubmit} className="space-y-3 border p-4 rounded">
        <input
          name="title"
          className="border p-2 w-full"
          placeholder="Title"
          value={form.title}
          onChange={onChange}
          required
        />
        <textarea
          name="description"
          className="border p-2 w-full"
          placeholder="Description"
          value={form.description}
          onChange={onChange}
          required
        />
        <input
          name="location"
          className="border p-2 w-full"
          placeholder="Location"
          value={form.location}
          onChange={onChange}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="start"
            className="border p-2 w-full"
            type="datetime-local"
            value={form.start}
            onChange={onChange}
            required
          />
          <input
            name="end"
            className="border p-2 w-full"
            type="datetime-local"
            value={form.end}
            onChange={onChange}
            required
          />
        </div>

        <input
          className="border p-2 w-full"
          placeholder="Admin passcode"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />

        <button className="px-3 py-2 bg-black text-white rounded">Create</button>

        {msg && <p className="text-sm mt-2">{msg}</p>}
        {link && (
          <p className="text-sm">
            Event link:{" "}
            <Link className="underline text-blue-600" href={link}>
              {link}
            </Link>
          </p>
        )}
      </form>
    </main>
  );
}
