const BASE = "https://api.themoviedb.org/3";
const KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!KEY) {
  console.warn("NEXT_PUBLIC_TMDB_API_KEY not set — TMDb functions will fail");
}

export async function getMovie(id: string) {
  const r = await fetch(`${BASE}/movie/${encodeURIComponent(id)}?api_key=${KEY}&language=en-US`);
  if (!r.ok) {
    throw new Error(`TMDb: getMovie failed (${r.status})`);
  }
  return (await r.json()) as any; // you can replace `any` with a proper type later
}

export async function searchMovies(q: string) {
  if (!q.trim()) return { results: [] };
  const r = await fetch(
    `${BASE}/search/movie?api_key=${KEY}&query=${encodeURIComponent(q)}&language=en-US&page=1`
  );
  if (!r.ok) {
    throw new Error(`TMDb: search failed (${r.status})`);
  }
  return (await r.json()) as any;
}

export function poster(path?: string, size: "w185" | "w342" | "w500" = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}
