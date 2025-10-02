// src/pages/admin.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {
  createEvent,
  type CreateEventInput,
  searchMovies,
  type TmdbSearchHit,
} from "@/lib/api";
import { formatDateTimeShort } from "@/lib/dates";

type FormState = {
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  movieId?: string;
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
  const [msg, setMsg] = useState<string>("");

  // TMDb search state
  const [movieQuery, setMovieQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchHit[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  function onChange<K extends keyof FormState>(key: K) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg("");

    const payload: CreateEventInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      start: form.start,
      end: form.end,
      movieId: form.movieId?.trim() || undefined,
    };

    try {
      await createEvent(payload, pass);
      setMsg("Event created");
      setForm({
        title: "",
        description: "",
        location: "",
        start: "",
        end: "",
        movieId: "",
      });
      setPass("");
      setMovieQuery("");
      setResults([]);
    } catch (err: any) {
      setMsg(err?.message || "Failed to create event");
    }
  }

  // TMDb search
  async function onSearchMovies() {
    if (!movieQuery.trim()) return;
    setLoadingMovies(true);
    try {
      const { results } = await searchMovies(movieQuery.trim());
      setResults(results);
    } catch (err) {
      console.error("Movie search failed", err);
      setResults([]);
    } finally {
      setLoadingMovies(false);
    }
  }

  function selectMovie(m: TmdbSearchHit) {
    setForm((f) => ({ ...f, movieId: String(m.id) }));
    setMovieQuery(m.title);
    setResults([]);
  }

  // Preview helpers
  function toIsoFromLocal(dt: string) {
    if (!dt) return "";
    const d = new Date(dt);
    return isNaN(d.getTime()) ? "" : d.toISOString();
  }
  const previewStart = formatDateTimeShort(toIsoFromLocal(form.start));
  const previewEnd = formatDateTimeShort(toIsoFromLocal(form.end));

  // Simple frontend validation
  const valid =
    form.title.trim().length > 0 &&
    form.description.trim().length >= 10 &&
    form.location.trim().length >= 2 &&
    form.start &&
    form.end &&
    pass.trim().length > 0;

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="mb-4">
        <Link href="/" className="text-sm text-gray-500 hover:underline">
          ← Back to events
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Create Event</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Title</label>
          <input
            className="border p-2 w-full"
            value={form.title}
            onChange={onChange("title")}
          />
        </div>

        <div>
          <label className="block text-sm">Description</label>
          <textarea
            className="border p-2 w-full"
            rows={4}
            value={form.description}
            onChange={onChange("description")}
          />
          <p className="text-xs text-gray-500">Min 10 characters</p>
        </div>

        <div>
          <label className="block text-sm">Location</label>
          <input
            className="border p-2 w-full"
            value={form.location}
            onChange={onChange("location")}
          />
          <p className="text-xs text-gray-500">Min 2 characters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Start</label>
            <input
              type="datetime-local"
              className="border p-2 w-full"
              value={form.start}
              onChange={onChange("start")}
            />
            <p className="text-xs text-gray-500 mt-1">
              Preview: {previewStart}
            </p>
          </div>

          <div>
            <label className="block text-sm">End</label>
            <input
              type="datetime-local"
              className="border p-2 w-full"
              value={form.end}
              onChange={onChange("end")}
            />
            <p className="text-xs text-gray-500 mt-1">Preview: {previewEnd}</p>
          </div>
        </div>

        {/* TMDb Search */}
        <div>
          <label className="block text-sm">Search Movie (TMDb)</label>
          <div className="flex gap-2">
            <input
              className="border p-2 flex-grow"
              value={movieQuery}
              onChange={(e) => setMovieQuery(e.target.value)}
              placeholder="Search TMDb..."
            />
            <button
              type="button"
              onClick={onSearchMovies}
              className="px-3 py-2 bg-gray-700 text-white rounded"
            >
              {loadingMovies ? "..." : "Search"}
            </button>
          </div>
          {results.length > 0 && (
            <ul className="border mt-2 max-h-40 overflow-y-auto">
              {results.map((m) => (
                <li
                  key={m.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectMovie(m)}
                >
                  {m.title} ({m.releaseDate || "n/a"})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Manual fallback */}
        <div>
          <label className="block text-sm">TMDb Movie ID (optional)</label>
          <input
            className="border p-2 w-full"
            value={form.movieId}
            onChange={onChange("movieId")}
            placeholder="e.g., 27205 for Inception"
          />
        </div>

        <div>
          <label className="block text-sm">Admin Passcode</label>
          <input
            type="password"
            className="border p-2 w-full"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <p className="text-xs text-gray-500">Required</p>
        </div>

        <button
          type="submit"
          disabled={!valid}
          className={`px-3 py-2 rounded text-white ${
            valid
              ? "bg-black hover:bg-gray-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Create Event
        </button>

        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>
    </main>
  );
}
