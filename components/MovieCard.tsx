import Image from "next/image";
import Link from "next/link";
import { FilmIcon, StarIcon } from "@/components/icons";

export type CardMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string | null;
  vote_average?: number | null;
};

/** Poster card. The whole card is one link; rating + year sit under the poster. */
export function MovieCard({ movie, priority = false }: { movie: CardMovie; priority?: boolean }) {
  const yr = movie.release_date?.slice(0, 4);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative block rounded-lg p-2 transition-colors hover:bg-surface-2 focus-visible:bg-surface-2"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-surface-3 shadow-card">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            alt=""
            fill
            sizes="(min-width: 1280px) 12rem, (min-width: 768px) 20vw, 40vw"
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid size-full place-items-center text-muted">
            <FilmIcon size={32} />
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug">{movie.title}</h3>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
          {rating && (
            <>
              <StarIcon size={13} filled className="text-accent-ink" />
              <span>
                <span className="sr-only">Rated </span>
                {rating}
              </span>
            </>
          )}
          {rating && yr && <span aria-hidden="true">·</span>}
          {yr && <span>{yr}</span>}
        </p>
      </div>
    </Link>
  );
}
