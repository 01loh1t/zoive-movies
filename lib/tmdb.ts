import "server-only";

// All TMDB calls happen on the server, so the secret token never reaches the browser.

const API = "https://api.themoviedb.org/3";

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
};

export type Paged<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type Provider = { provider_id: number; provider_name: string; logo_path: string };

export type MovieDetails = Movie & {
  runtime: number | null;
  tagline: string | null;
  genres: { id: number; name: string }[];
  videos: { results: { key: string; site: string; type: string; official: boolean; name: string }[] };
  credits: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string }[];
  };
  recommendations: Paged<Movie>;
  similar: Paged<Movie>;
  "watch/providers": {
    results: Record<
      string,
      { link: string; flatrate?: Provider[]; rent?: Provider[]; buy?: Provider[]; free?: Provider[]; ads?: Provider[] }
    >;
  };
};

export class TmdbError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function tmdb<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  revalidate = 3600,
): Promise<T> {
  const token = process.env.TMDB_READ_TOKEN;
  if (!token) throw new TmdbError(500, "TMDB_READ_TOKEN is not set");

  const url = new URL(API + path);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }

  // Accept either the long "API Read Access Token" (sent as a Bearer header)
  // or the short 32-character "API Key" (sent as ?api_key=). Both stay server-side.
  const isShortKey = /^[0-9a-f]{32}$/i.test(token);
  if (isShortKey) url.searchParams.set("api_key", token);

  const res = await fetch(url, {
    headers: isShortKey
      ? { Accept: "application/json" }
      : { Authorization: `Bearer ${token}`, Accept: "application/json" },
    next: { revalidate },
  });
  if (!res.ok) throw new TmdbError(res.status, `TMDB ${res.status} on ${path}`);
  return res.json() as Promise<T>;
}

/** Full image URL for a TMDB path. Sizes: w92 w185 w342 w500 w780 w1280 original */
export function img(path: string | null | undefined, size = "w342") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

export const year = (m: { release_date?: string }) => m.release_date?.slice(0, 4) || "";

/** TMDB sometimes returns adult or poster-less junk in search; keep results clean. */
const clean = (list: Movie[]) => list.filter((m) => m.poster_path);

export async function getTrending(window: "day" | "week" = "week") {
  const data = await tmdb<Paged<Movie>>(`/trending/movie/${window}`);
  return clean(data.results);
}

export async function getTopRated() {
  const data = await tmdb<Paged<Movie>>("/movie/top_rated", {}, 86400);
  return clean(data.results);
}

export async function searchMovies(query: string, page = 1) {
  const data = await tmdb<Paged<Movie>>("/search/movie", { query, page, include_adult: "false" }, 600);
  return { ...data, results: clean(data.results) };
}

export type DiscoverParams = {
  genres?: string; // TMDB syntax: "35,18" = AND, "35|18" = OR
  yearFrom?: number;
  yearTo?: number;
  runtimeMax?: number;
  minRating?: number;
  sort?: string;
  page?: number;
};

export async function discoverMovies(p: DiscoverParams) {
  const data = await tmdb<Paged<Movie>>("/discover/movie", {
    with_genres: p.genres,
    "primary_release_date.gte": p.yearFrom ? `${p.yearFrom}-01-01` : undefined,
    "primary_release_date.lte": p.yearTo ? `${p.yearTo}-12-31` : undefined,
    "with_runtime.lte": p.runtimeMax,
    "vote_average.gte": p.minRating,
    "vote_count.gte": 150, // hide obscure titles with 3 votes
    sort_by: p.sort || "popularity.desc",
    include_adult: "false",
    page: p.page || 1,
  });
  return { ...data, results: clean(data.results), total_pages: Math.min(data.total_pages, 500) };
}

export async function getMovie(id: number) {
  return tmdb<MovieDetails>(`/movie/${id}`, {
    append_to_response: "videos,credits,recommendations,similar,watch/providers",
  });
}

export async function getRecommendations(id: number) {
  const data = await tmdb<Paged<Movie>>(`/movie/${id}/recommendations`, {}, 86400);
  return clean(data.results);
}

export function pickTrailer(m: MovieDetails) {
  const yt = m.videos.results.filter((v) => v.site === "YouTube");
  return (
    yt.find((v) => v.type === "Trailer" && v.official) ??
    yt.find((v) => v.type === "Trailer") ??
    yt.find((v) => v.type === "Teaser") ??
    null
  );
}
