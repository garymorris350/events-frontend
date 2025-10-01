import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { createEvent, type CreateEventInput } from "@/lib/api";

type FormState = {
  title: string;
  description: string;
  location: string;
  start: string; // <input type="datetime-local">
  end: string;   // <input type="datetime-local">
  movieId?: string; // optional TMDb reference
};

export default function Admin() {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    location: "",
    start: "",
    end: "",
    movieId: "",
  });
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ start?: string; end?: string; movieId?: string }>({});

  function setField<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate(): boolean {
    const next: typeof errors = {};
    const startMs = form.start ? Date.parse(form.start) : NaN;
    const endMs = form.end ? Date.parse(form.end) : NaN;
    if (!Number.isNaN(startMs) && !Number.isNaN(endMs) && endMs <= startMs) {
      next.end = "End must be after start";
    }
    if (form.movieId && form.movieId.trim() && !/^\d+$/.test(form.movieId.trim())) {
      next.movieId = "Movie ID should be numeric (TMDb id)";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setLink("");

    if (!validate()) return;

    const payload: CreateEventInput & { movieId?: string } = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      start: new Date(form.start).toISOString(),
      end: new Date(form.end).toISOString(),
    };
    if (form.movieId?.trim()) payload.movieId = form.movieId.trim();

    try {
      setIsSubmitting(true);
      const res = await createEvent(payload, pass);
      setMsg("Event created!");
      setLink(`/events/${res.id}`);
      // reset form (keep pass so you can create another quickly)
      setForm({ title: "", description: "", location: "", start: "", end: "", movieId: "" });
      setErrors({});
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create";
      setMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setField(name as keyof FormState, value);
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin — Create Event</h1>

      <form onSubmit={onSubmit} className="space-y-3 border p-4 rounded" noValidate>
        <div>
          <label htmlFor="title" className="block text-sm">Title</label>
          <input
            id="title"
            name="title"
            className="border p-2 w-full"
            placeholder="Title"
            autoComplete="off"
            value={form.title}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm">Description</label>
          <textarea
            id="description"
            name="description"
            className="border p-2 w-full"
            placeholder="Description"
            value={form.description}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm">Location</label>
          <input
            id="location"
            name="location"
            className="border p-2 w-full"
            placeholder="Location"
            autoComplete="street-address"
            value={form.location}
            onChange={onChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="start" className="block text-sm">Start</label>
            <input
              id="start"
              name="start"
              className="border p-2 w-full"
              type="datetime-local"
              value={form.start}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label htmlFor="end" className="block text-sm">End</label>
            <input
              id="end"
              name="end"
              className="border p-2 w-full"
              type="datetime-local"
              value={form.end}
              onChange={onChange}
              aria-invalid={Boolean(errors.end) || undefined}
              required
            />
            {errors.end && <p className="text-red-500 text-sm mt-1">{errors.end}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="movieId" className="block text-sm">
            TMDb Movie ID <span className="text-gray-500">(optional)</span>
          </label>
          <input
            id="movieId"
            name="movieId"
            className="border p-2 w-full"
            placeholder="e.g. 27205 for Inception"
            value={form.movieId ?? ""}
            onChange={onChange}
            aria-invalid={Boolean(errors.movieId) || undefined}
          />
          {errors.movieId && <p className="text-red-500 text-sm mt-1">{errors.movieId}</p>}
        </div>

        <div>
          <label htmlFor="adminPass" className="block text-sm">Admin passcode</label>
          <input
            id="adminPass"
            className="border p-2 w-full"
            placeholder="Admin passcode"
            autoComplete="off"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>

        <button
          className="px-3 py-2 bg-black text-white rounded disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating…" : "Create"}
        </button>

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
