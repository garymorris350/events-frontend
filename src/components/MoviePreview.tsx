import { useEffect, useState } from "react";
import { getMovieBasics, type MovieBasics } from "@/lib/api";

type Props = { movieId?: string };

export default function MoviePreview({ movieId }: Props) {
  const [movie, setMovie] = useState<MovieBasics | null>(null);

  useEffect(() => {
    if (!movieId) return;
    getMovieBasics(movieId).then(setMovie).catch(() => setMovie(null));
  }, [movieId]);

  if (!movieId || !movie) return null;

  return (
    <aside className="ml-4 shrink-0 rounded-lg border bg-white p-3 shadow md:w-[220px]">
      <h4 className="mb-2 text-sm font-semibold text-gray-700">Film</h4>
      <div className="flex items-start gap-3">
        {movie.posterUrl ? (
          // using <img> to avoid next/image domain config hassle
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-24 w-16 rounded object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-24 w-16 items-center justify-center rounded bg-gray-100 text-xs text-gray-500">
            No image
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{movie.title}</div>
          {movie.releaseDate && (
            <div className="text-xs text-gray-500">{movie.releaseDate}</div>
          )}
        </div>
      </div>
    </aside>
  );
}
