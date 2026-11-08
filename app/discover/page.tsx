import type { Metadata } from "next";
import { Suspense } from "react";
import { Filters, type FilterState } from "@/components/Filters";
import { MovieGrid } from "@/components/MovieRow";
import { MissingTmdb, Notice, TmdbFailed } from "@/components/Notice";
import { Pagination } from "@/components/Pagination";
import { GridSkeleton } from "@/components/Skeletons";
import { DECADES, GENRES, MOODS, RUNTIMES, SORTS } from "@/lib/catalog";
import { hasTmdb } from "@/lib/env";
import { discoverMovies } from "@/lib/tmdb";

export const metadata: Metadata = { title: "Discover" };

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const many = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);

/** Read and validate filters from the URL (ignore anything unexpected). */
function parse(sp: SP): FilterState & { page: number } {
  const mood = MOODS.find((m) => m.id === one(sp.mood))?.id;
  const genres = many(sp.genre).filter((g) => GENRES.some((x) => String(x.id) === g));
  const decade = DECADES.find((d) => d.id === one(sp.decade))?.id;
  const runtime = RUNTIMES.find((r) => r.id === one(sp.runtime))?.id;
  const rating = ["6", "7", "8"].includes(one(sp.rating) ?? "") ? one(sp.rating) : undefined;
  const sort = SORTS.find((s) => s.id === one(sp.sort))?.id;
  const page = Math.min(Math.max(Number(one(sp.page)) || 1, 1), 500);
  return { mood, genres: mood ? [] : genres, decade, runtime, rating, sort, page };
}

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<SP> }) {
  const f = parse(await searchParams);
  const mood = MOODS.find((m) => m.id === f.mood);

  return (
    <div className="pt-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        {mood ? (
          <>
            <span aria-hidden="true">{mood.emoji} </span>
            {mood.label} movies
          </>
        ) : (
          "Discover movies"
        )}
      </h1>
      <p className="mt-1 text-muted">Pick a mood or mix filters to find something to watch tonight.</p>

      <div className="mt-6 rounded-xl bg-surface p-4 shadow-card sm:p-6">
        <Filters state={f} />
      </div>

      <div className="mt-8">
        {!hasTmdb ? (
          <MissingTmdb />
        ) : (
          <Suspense key={JSON.stringify(f)} fallback={<GridSkeleton />}>
            <Results f={f} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

async function Results({ f }: { f: ReturnType<typeof parse> }) {
  const mood = MOODS.find((m) => m.id === f.mood);
  const decade = DECADES.find((d) => d.id === f.decade);
  const runtime = RUNTIMES.find((r) => r.id === f.runtime);

  const data = await discoverMovies({
    genres: mood ? mood.genres : f.genres.join("|") || undefined,
    yearFrom: decade?.from,
    yearTo: decade?.to,
    runtimeMax: runtime?.max,
    minRating: f.rating ? Number(f.rating) : undefined,
    sort: f.sort,
    page: f.page,
  }).catch(() => null);

  if (!data) return <TmdbFailed />;
  if (data.results.length === 0) {
    return <Notice title="Nothing matches all of those filters">Try removing one or two filters.</Notice>;
  }

  const params = {
    mood: f.mood,
    genre: f.genres,
    decade: f.decade,
    runtime: f.runtime,
    rating: f.rating,
    sort: f.sort,
  };

  return (
    <section aria-labelledby="discover-results">
      <h2 id="discover-results" className="mb-3 px-2 text-sm font-bold text-muted" aria-live="polite">
        {data.total_results.toLocaleString("en-US")} movies
      </h2>
      <MovieGrid movies={data.results} label="Discover results" />
      <Pagination page={f.page} totalPages={data.total_pages} basePath="/discover" params={params} />
    </section>
  );
}
