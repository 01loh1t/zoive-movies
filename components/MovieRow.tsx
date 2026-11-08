import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { MovieCard, type CardMovie } from "@/components/MovieCard";

/** A titled, horizontally scrolling row of posters. */
export function MovieRow({
  title,
  subtitle,
  movies,
  href,
  priority = false,
}: {
  title: string;
  subtitle?: string;
  movies: CardMovie[];
  href?: string;
  priority?: boolean;
}) {
  if (movies.length === 0) return null;
  const id = `row-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <section aria-labelledby={id} className="mt-10">
      <div className="mb-2 flex items-end justify-between gap-4 px-2">
        <div>
          <h2 id={id} className="text-2xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
        {href && (
          <Link
            href={href}
            className="flex shrink-0 items-center gap-0.5 rounded-full px-3 py-1.5 text-sm font-bold text-muted hover:bg-surface-2 hover:text-text"
          >
            Show all <ChevronRightIcon size={16} />
          </Link>
        )}
      </div>
      <ul className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-1 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6">
        {movies.map((m, i) => (
          <li key={m.id} className="w-[42%] shrink-0 snap-start sm:w-[28%] md:w-[20%] lg:w-[16%] xl:w-[12.5%]">
            <MovieCard movie={m} priority={priority && i < 4} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Responsive grid of posters (search, discover, watchlist). */
export function MovieGrid({ movies, label }: { movies: CardMovie[]; label?: string }) {
  return (
    <ul
      aria-label={label}
      className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      {movies.map((m, i) => (
        <li key={m.id}>
          <MovieCard movie={m} priority={i < 6} />
        </li>
      ))}
    </ul>
  );
}
