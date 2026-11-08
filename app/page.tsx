import Link from "next/link";
import { MovieRow } from "@/components/MovieRow";
import { MissingTmdb, TmdbFailed } from "@/components/Notice";
import { RecentSearches } from "@/components/RecentSearches";
import { SearchBar } from "@/components/SearchBar";
import { MOODS } from "@/lib/catalog";
import { hasTmdb } from "@/lib/env";
import { getSuggestions } from "@/lib/suggestions";
import { getUser } from "@/lib/supabase/server";
import { getTopRated, getTrending } from "@/lib/tmdb";

export default async function HomePage() {
  const { supabase, user } = await getUser();

  const [trending, topRated, suggestions] = hasTmdb
    ? await Promise.all([
        getTrending("week").catch(() => null),
        getTopRated().catch(() => null),
        user && supabase ? getSuggestions(supabase).catch(() => null) : Promise.resolve(null),
      ])
    : [null, null, null];

  return (
    <>
      <section aria-labelledby="hero-heading" className="pt-10 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 id="hero-heading" className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Find your next <span className="text-accent-ink">favorite movie</span>
          </h1>
          <p className="mt-3 text-pretty text-lg text-muted">
            Search any film, see what&apos;s trending, watch the trailer and find where to stream it.
          </p>
          <div className="mt-7">
            <SearchBar size="hero" />
          </div>
          <div className="text-left">
            <RecentSearches />
          </div>
        </div>

        <nav aria-label="Browse by mood" className="mx-auto mt-8 max-w-3xl">
          <ul className="flex flex-wrap justify-center gap-2">
            {MOODS.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/discover?mood=${m.id}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-surface-2 px-4 text-sm font-bold hover:bg-surface-3"
                >
                  <span aria-hidden="true">{m.emoji}</span>
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {!hasTmdb ? (
        <MissingTmdb />
      ) : !trending && !topRated ? (
        <TmdbFailed />
      ) : (
        <>
          {suggestions && suggestions.movies.length > 0 && (
            <MovieRow
              title="Suggested for you"
              subtitle={`Because you liked ${suggestions.basedOn.join(" and ")}`}
              movies={suggestions.movies}
            />
          )}
          <MovieRow title="Trending this week" movies={trending ?? []} priority href="/discover" />
          <MovieRow
            title={user ? "Top rated of all time" : "Start with the classics"}
            subtitle={user ? undefined : "Sign in and rate a few movies to get personal suggestions"}
            movies={topRated ?? []}
            href="/discover?sort=vote_average.desc"
          />
        </>
      )}
    </>
  );
}
