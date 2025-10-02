import { useEffect, useState } from "react";
import Link from "next/link";
import { listEvents, type Event } from "@/lib/api";
import { formatDateTimeShort } from "@/lib/dates";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">
          Upcoming Events
        </h1>

        {loading ? (
          <p className="text-center">Loading…</p>
        ) : error ? (
          <p className="text-center text-red-600">Error: {error}</p>
        ) : events.length > 0 ? (
          <ul className="space-y-6">
            {events.map((event) => (
              <li
                key={event.id}
                className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h2>
                <p className="text-gray-600 mb-3">
                  {event.start
                    ? formatDateTimeShort(event.start)
                    : "Date TBA"}{" "}
                  — {event.location || "TBA"}
                </p>
                <Link
                  href={`/events/${event.id}`}
                  className="inline-block text-blue-600 font-medium hover:underline"
                >
                  View details →
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No events found.</p>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            Admin: Create Event
          </Link>
        </div>
      </div>
    </div>
  );
}
