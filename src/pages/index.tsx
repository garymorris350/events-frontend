import { useEffect, useState } from "react";
import { listEvents } from "@/lib/api";

type Event = { id: string; title: string; date: string; location: string };

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
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Failed to load events");
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
          <div className="space-y-4">
            <div className="h-24 rounded-lg bg-white shadow-sm p-6">
              <div className="h-5 w-1/3 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-24 rounded-lg bg-white shadow-sm p-6">
              <div className="h-5 w-1/4 bg-gray-200 rounded mb-3 animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
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
                  {event.date} — {event.location}
                </p>
                <a
                  href={`/events/${event.id}`}
                  className="inline-block text-blue-600 font-medium hover:underline"
                >
                  View details →
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No events found.</p>
        )}

        <div className="mt-10 text-center">
          <a
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            Admin: Create Event
          </a>
        </div>
      </div>
    </div>
  );
}
