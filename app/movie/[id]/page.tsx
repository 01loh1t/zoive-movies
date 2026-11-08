import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ClockIcon, StarIcon } from "@/components/icons";
import { MovieRow } from "@/components/MovieRow";
import { MissingTmdb, TmdbFailed } from "@/components/Notice";
import { StarRating } from "@/components/StarRating";
import { TrailerButton } from "@/components/TrailerButton";
import { WatchlistButton } from "@/components/WatchlistButton";
import { COUNTRIES, COUNTRY_COOKIE, DEFAULT_COUNTRY } from "@/lib/catalog";
import { hasTmdb } from "@/lib/env";
import { getUser } from "@/lib/supabase/server";
import { getMovie, img, pickTrailer, TmdbError, type Provider } from "@/lib/tmdb";
import type { MovieSnapshot } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

const load = cache(async (rawId: string) => {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return "missing" as const;
  try {
    return await getMovie(id);
  } catch (e) {
    if (e instanceof TmdbError && e.status === 404) return "missing" as const;
    return "failed" as const;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!hasTmdb) return { title: "Movie" };
  const m = await load((await params).id);
  if (typeof m === "string") return { title: "Movie" };
  const poster = img(m.poster_path, "w500");
  return {
    title: `${m.title}${m.release_date ? ` (${m.release_date.slice(0, 4)})` : ""}`,
    description: m.overview?.slice(0, 160),
    openGraph: poster ? { images: [poster] } : undefined,
  };
}

function runtime(min: number | null) {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export default async function MoviePage({ params }: Props) {
  if (!hasTmdb) return <MissingTmdb />;
  const { id } = await params;

  const [movie, { supabase, user }, cookieStore] = await Promise.all([load(id), getUser(), cookies()]);
  if (movie === "missing") notFound();
  if (movie === "failed") return <TmdbFailed />;

  const country = cookieStore.get(COUNTRY_COOKIE)?.value || DEFAULT_COUNTRY;
  const countryName = COUNTRIES.find((c) => c.code === country)?.name ?? country;
  const providers = movie["watch/providers"]?.results?.[country];

  let saved = false;
  let myStars: number | null = null;
  if (user && supabase) {
    const [w, r] = await Promise.all([
      supabase.from("watchlist").select("movie_id").eq("movie_id", movie.id).maybeSingle(),
      supabase.from("ratings").select("stars").eq("movie_id", movie.id).maybeSingle(),
    ]);
    saved = Boolean(w.data);
    myStars = r.data?.stars ?? null;
  }

  const snapshot: MovieSnapshot = {
    movie_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date || null,
  };
  const trailer = pickTrailer(movie);
  const director = movie.credits.crew.find((c) => c.job === "Director");
  const cast = movie.credits.cast.slice(0, 12);
  const more = movie.recommendations.results.length ? movie.recommendations.results : movie.similar.results;
  const backdrop = img(movie.backdrop_path, "w1280");
  const poster = img(movie.poster_path, "w500");
  const rt = runtime(movie.runtime);

  return (
    <article>
      {/* Backdrop */}
      <div className="relative -mx-4 h-56 overflow-hidden sm:-mx-6 sm:h-80 lg:h-[26rem]">
        {backdrop && <Image src={backdrop} alt="" fill priority sizes="100vw" className="object-cover object-top" />}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/10" />
      </div>

      <div className="relative -mt-28 grid gap-6 sm:-mt-40 md:grid-cols-[16rem_1fr] md:gap-10">
        <div className="mx-auto w-40 sm:w-52 md:w-full">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface-3 shadow-pop">
            {poster && (
              <Image src={poster} alt={`${movie.title} poster`} fill priority sizes="16rem" className="object-cover" />
            )}
          </div>
        </div>

        <div className="min-w-0 md:pt-24">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            {movie.title}
            {movie.release_date && (
              <span className="font-semibold text-muted"> ({movie.release_date.slice(0, 4)})</span>
            )}
          </h1>
          {movie.tagline && <p className="mt-1 text-lg italic text-muted">{movie.tagline}</p>}

          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {movie.vote_average > 0 && (
              <li className="flex items-center gap-1.5 font-bold">
                <StarIcon size={16} filled className="text-accent" />
                {movie.vote_average.toFixed(1)}
                <span className="font-normal text-muted">
                  / 10 · {movie.vote_count.toLocaleString("en-US")} votes
                </span>
              </li>
            )}
            {rt && (
              <li className="flex items-center gap-1.5 text-muted">
                <ClockIcon size={16} /> {rt}
              </li>
            )}
            {movie.genres.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/discover?genre=${g.id}`}
                  className="rounded-full bg-surface-2 px-3 py-1 font-semibold hover:bg-surface-3"
                >
                  {g.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            {trailer && <TrailerButton videoKey={trailer.key} title={movie.title} />}
            <WatchlistButton movie={snapshot} voteAverage={movie.vote_average || null} initialSaved={saved} />
          </div>

          <div className="mt-6">
            <StarRating movie={snapshot} initial={myStars} />
          </div>

          {movie.overview && (
            <section aria-labelledby="overview" className="mt-8 max-w-3xl">
              <h2 id="overview" className="text-lg font-bold">
                Overview
              </h2>
              <p className="mt-1 leading-relaxed text-muted">{movie.overview}</p>
              {director && (
                <p className="mt-3 text-sm">
                  <span className="text-muted">Directed by </span>
                  <span className="font-bold">{director.name}</span>
                </p>
              )}
            </section>
          )}

          <section aria-labelledby="where" className="mt-8">
            <h2 id="where" className="text-lg font-bold">
              Where to watch <span className="font-normal text-muted">in {countryName}</span>
            </h2>
            {providers && (providers.flatrate || providers.free || providers.ads || providers.rent || providers.buy) ? (
              <div className="mt-3 space-y-4">
                <ProviderList label="Stream" list={providers.flatrate} />
                <ProviderList label="Free" list={[...(providers.free ?? []), ...(providers.ads ?? [])]} />
                <ProviderList label="Rent" list={providers.rent} />
                <ProviderList label="Buy" list={providers.buy} />
                <a
                  href={providers.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-bold text-accent-ink underline"
                >
                  See all options on TMDB<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            ) : (
              <p className="mt-1 text-sm text-muted">
                No streaming info for {countryName} yet.{" "}
                <Link href="/settings" className="font-bold text-text underline">
                  Change country
                </Link>
              </p>
            )}
          </section>
        </div>
      </div>

      {cast.length > 0 && (
        <section aria-labelledby="cast" className="mt-12">
          <h2 id="cast" className="px-2 text-2xl font-bold tracking-tight">
            Cast
          </h2>
          <ul className="no-scrollbar relative -mx-4 mt-3 flex gap-4 overflow-x-auto px-6 pb-2 sm:-mx-6 sm:px-8">
            {cast.map((p) => (
              <li key={p.id} className="w-28 shrink-0 text-center">
                <div className="relative mx-auto size-24 overflow-hidden rounded-full bg-surface-3">
                  {p.profile_path && (
                    <Image src={img(p.profile_path, "w185")!} alt="" fill sizes="6rem" className="object-cover" />
                  )}
                </div>
                <p className="mt-2 text-sm font-bold leading-tight">{p.name}</p>
                <p className="line-clamp-2 text-xs text-muted">{p.character}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <MovieRow title="More like this" movies={more.filter((m) => m.poster_path).slice(0, 18)} />
    </article>
  );
}

function ProviderList({ label, list }: { label: string; list?: Provider[] }) {
  if (!list || list.length === 0) return null;
  const unique = list.filter((p, i) => list.findIndex((x) => x.provider_id === p.provider_id) === i);
  return (
    <div>
      <h3 className="mb-1.5 text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</h3>
      <ul className="flex flex-wrap gap-2">
        {unique.map((p) => (
          <li key={p.provider_id} title={p.provider_name}>
            <Image
              src={img(p.logo_path, "w92")!}
              alt={p.provider_name}
              width={44}
              height={44}
              className="rounded-lg shadow-card"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
