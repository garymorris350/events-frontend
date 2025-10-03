// src/pages/index.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { listEvents, type Event, deleteEvent } from "@/lib/api";
import { formatDateTimeShort } from "@/lib/dates";
import MoviePreview from "@/components/MoviePreview";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listEvents();
        if (!cancelled) setEvents(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load events";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id: string, title: string) {
    // 1) Confirm intent
    const ok = window.confirm(`Delete event "${title}"? This cannot be undone.`);
    if (!ok) return;

    // 2) Prompt for admin passcode
    const adminPass = window.prompt("Enter admin passcode to delete:");
    if (!adminPass || !adminPass.trim()) return;

    try {
      setDeletingId(id);
      await deleteEvent(id, adminPass);
      // 3) Optimistically remove from UI
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Delete failed";
      alert(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Head>
        <title>Upcoming Events | FilmHub</title>
        <meta
          name="description"
          content="Browse and sign up for upcoming FilmHub community events."
        />
      </Head>

      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1
            className="text-4xl font-bold text-purple-700 mb-8 text-center"
            aria-label="Upcoming Events"
          >
            Upcoming Events
          </h1>

          {loading ? (
            <p className="text-center" role="status">
              Loading…
            </p>
          ) : error ? (
            <p className="text-center text-red-700">Error: {error}</p>
          ) : events.length > 0 ? (
            <ul className="space-y-6" aria-label="Event list">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    {/* Left: Event info */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h2>
                      <p className="text-gray-700 mb-3">
                        {event.start
                          ? formatDateTimeShort(event.start)
                          : "Date TBA"}{" "}
                        — {event.location || "TBA"}
                      </p>

                      <div className="flex items-center gap-4">
                        <Link
                          href={`/events/${event.id}`}
                          className="inline-block text-blue-700 font-medium hover:underline"
                          aria-label={`View details for ${event.title}`}
                        >
                          View details →
                        </Link>

                        {/* Admin delete button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(event.id, event.title)}
                          disabled={deletingId === event.id}
                          className={`inline-flex items-center rounded px-3 py-1.5 text-sm font-medium transition
                            ${deletingId === event.id
                              ? "bg-red-300 text-white cursor-not-allowed"
                              : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          aria-label={`Delete event ${event.title}`}
                        >
                          {deletingId === event.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>

                    {/* Right: Movie preview or placeholder */}
                    {event.movieId ? (
                      <MoviePreview movieId={event.movieId} />
                    ) : (
                      <aside className="ml-4 shrink-0 rounded-lg border bg-gray-50 p-3 shadow-inner md:w-[220px] flex items-center justify-center text-sm text-gray-500">
                        No film allocated
                      </aside>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600">No events found.</p>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/admin"
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
              aria-label="Go to admin page to create an event"
            >
              Admin: Create Event
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
