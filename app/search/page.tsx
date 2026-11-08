import type { Metadata } from "next";
import { MovieGrid, MovieRow } from "@/components/MovieRow";
import { MissingTmdb, Notice, TmdbFailed } from "@/components/Notice";
import { Pagination } from "@/components/Pagination";
import { RecentSearches } from "@/components/RecentSearches";
import { RecordSearch } from "@/components/RecordSearch";
import { SearchBar } from "@/components/SearchBar";
import { hasTmdb } from "@/lib/env";
import { getTrending, searchMovies } from "@/lib/tmdb";

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `“${q}”: search` : "Search" };
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 100);
  const page = Math.min(Math.max(Number(sp.page) || 1, 1), 500);

  return (
    <div className="pt-8">
      <h1 className="sr-only">{q ? `Search results for “${q}”` : "Search movies"}</h1>
      <div className="mx-auto max-w-2xl">
        <SearchBar size="hero" defaultValue={q} autoFocus={!q} />
        {!q && <RecentSearches />}
      </div>

      {!hasTmdb ? <MissingTmdb /> : q ? <Results q={q} page={page} /> : <Popular />}
    </div>
  );
}

async function Results({ q, page }: { q: string; page: number }) {
  const data = await searchMovies(q, page).catch(() => null);
  if (!data) return <TmdbFailed />;

  if (data.results.length === 0) {
    return (
      <Notice title={`No movies found for “${q}”`}>
        Check the spelling, try fewer words, or browse by mood on the Discover page.
      </Notice>
    );
  }

  return (
    <section aria-labelledby="results-heading" className="mt-8">
      <h2 id="results-heading" aria-live="polite" className="mb-3 px-2 text-sm font-bold text-muted">
        {data.total_results.toLocaleString("en-US")} result{data.total_results === 1 ? "" : "s"} for “{q}”
      </h2>
      <RecordSearch query={q}>
        <MovieGrid movies={data.results} label={`Results for ${q}`} />
      </RecordSearch>
      <Pagination page={page} totalPages={Math.min(data.total_pages, 500)} basePath="/search" params={{ q }} />
    </section>
  );
}

async function Popular() {
  const trending = await getTrending("day").catch(() => null);
  if (!trending) return <TmdbFailed />;
  return <MovieRow title="Popular today" movies={trending} />;
}
