import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getRecommendations, type Movie } from "@/lib/tmdb";

/**
 * "Because you liked…" suggestions.
 * Seeds = your 4–5★ ratings + newest watchlist picks. We fetch TMDB recommendations
 * for up to 5 seeds, drop anything you've already saved or rated, and rank movies
 * that several seeds agree on first.
 */
export async function getSuggestions(supabase: SupabaseClient) {
  const [{ data: ratings }, { data: watchlist }] = await Promise.all([
    supabase.from("ratings").select("movie_id, title, stars").order("rated_at", { ascending: false }).limit(50),
    supabase.from("watchlist").select("movie_id, title").order("added_at", { ascending: false }).limit(50),
  ]);

  const liked = (ratings ?? []).filter((r) => r.stars >= 4);
  const seeds = [...liked, ...(watchlist ?? [])]
    .filter((s, i, all) => all.findIndex((x) => x.movie_id === s.movie_id) === i)
    .slice(0, 5);
  if (seeds.length === 0) return null;

  const known = new Set([...(ratings ?? []), ...(watchlist ?? [])].map((r) => r.movie_id));
  const lists = await Promise.all(seeds.map((s) => getRecommendations(s.movie_id).catch(() => [] as Movie[])));

  const score = new Map<number, { movie: Movie; hits: number; order: number }>();
  lists.forEach((list) =>
    list.forEach((movie, rank) => {
      if (known.has(movie.id)) return;
      const entry = score.get(movie.id);
      if (entry) entry.hits += 1;
      else score.set(movie.id, { movie, hits: 1, order: rank });
    }),
  );

  const movies = [...score.values()]
    .sort((a, b) => b.hits - a.hits || a.order - b.order || b.movie.vote_average - a.movie.vote_average)
    .slice(0, 20)
    .map((e) => e.movie);

  return { basedOn: seeds.slice(0, 2).map((s) => s.title), movies };
}
