// src/lib/dates.ts

/** Safely format an ISO string. Falls back when missing/invalid. */
export function formatDateTime(
  iso?: string | null,
  fallback: string = "Date TBA"
) {
  if (!iso) return fallback;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });
}

/** Shorter variant for list views. Also safe. */
export function formatDateTimeShort(
  iso?: string | null,
  fallback: string = "Date TBA"
) {
  if (!iso) return fallback;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
