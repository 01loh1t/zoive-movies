"use client";

import { useMemo, useState } from "react";
import { CheckIcon, XIcon } from "@/components/icons";
import { MovieCard } from "@/components/MovieCard";
import { Notice } from "@/components/Notice";
import { useToast } from "@/components/Toast";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { WatchItem } from "@/lib/types";

type Tab = "to-watch" | "watched";
type Sort = "added" | "title" | "rating" | "year";

export function WatchlistView({ initial }: { initial: WatchItem[] }) {
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const [tab, setTab] = useState<Tab>("to-watch");
  const [sort, setSort] = useState<Sort>("added");

  const counts = {
    "to-watch": items.filter((i) => !i.watched).length,
    watched: items.filter((i) => i.watched).length,
  };

  const shown = useMemo(() => {
    const list = items.filter((i) => (tab === "watched" ? i.watched : !i.watched));
    const by: Record<Sort, (a: WatchItem, b: WatchItem) => number> = {
      added: (a, b) => b.added_at.localeCompare(a.added_at),
      title: (a, b) => a.title.localeCompare(b.title),
      rating: (a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0),
      year: (a, b) => (b.release_date ?? "").localeCompare(a.release_date ?? ""),
    };
    return [...list].sort(by[sort]);
  }, [items, tab, sort]);

  async function update(movieId: number, change: "watched" | "unwatched" | "remove") {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const before = items;
    setItems((list) =>
      change === "remove"
        ? list.filter((i) => i.movie_id !== movieId)
        : list.map((i) => (i.movie_id === movieId ? { ...i, watched: change === "watched" } : i)),
    );
    const { error } =
      change === "remove"
        ? await supabase.from("watchlist").delete().eq("movie_id", movieId)
        : await supabase.from("watchlist").update({ watched: change === "watched" }).eq("movie_id", movieId);
    if (error) {
      setItems(before);
      toast("Couldn't update your watchlist. Try again.", "error");
    } else if (change === "remove") {
      const removed = before.find((i) => i.movie_id === movieId);
      toast("Removed from watchlist", "ok", removed ? { label: "Undo", onClick: () => restore(removed) } : undefined);
    } else {
      toast(change === "watched" ? "Marked as watched" : "Moved back to To watch");
    }
  }

  async function restore(item: WatchItem) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setItems((list) => (list.some((i) => i.movie_id === item.movie_id) ? list : [...list, item]));
    const { error } = await supabase.from("watchlist").upsert(item);
    if (error) {
      setItems((list) => list.filter((i) => i.movie_id !== item.movie_id));
      toast("Couldn't restore that movie. Try again.", "error");
    }
  }

  if (items.length === 0) {
    return (
      <Notice title="Your watchlist is empty" action={{ href: "/discover", label: "Find movies" }}>
        Tap <span className="font-bold text-text">Add to watchlist</span> on any movie to save it here.
      </Notice>
    );
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Watchlist sections" className="flex gap-1 rounded-full bg-surface-2 p-1">
          {(["to-watch", "watched"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`h-10 rounded-full px-5 text-sm font-bold ${tab === t ? "bg-text text-bg" : "text-muted hover:text-text"}`}
            >
              {t === "to-watch" ? "To watch" : "Watched"} <span className="tabular-nums opacity-70">{counts[t]}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="wl-sort" className="text-sm font-bold text-muted">
            Sort
          </label>
          <select
            id="wl-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-10 rounded-full bg-surface-2 px-4 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--border)]"
          >
            <option value="added">Recently added</option>
            <option value="title">Title A–Z</option>
            <option value="rating">TMDB rating</option>
            <option value="year">Newest release</option>
          </select>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="my-12 text-center text-muted">
          {tab === "watched" ? "Nothing marked as watched yet." : "You've watched everything on your list. 🎉"}
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {shown.map((m) => (
            <li key={m.movie_id} className="flex flex-col">
              <MovieCard
                movie={{
                  id: m.movie_id,
                  title: m.title,
                  poster_path: m.poster_path,
                  release_date: m.release_date,
                  vote_average: m.vote_average,
                }}
              />
              <div className="mt-auto flex gap-1 px-2 pb-2">
                <button
                  type="button"
                  onClick={() => update(m.movie_id, m.watched ? "unwatched" : "watched")}
                  className="flex h-9 flex-1 items-center justify-center gap-1 rounded-full bg-surface-2 text-xs font-bold hover:bg-surface-3"
                >
                  <CheckIcon size={14} /> {m.watched ? "Unwatch" : "Watched"}
                  <span className="sr-only"> {m.title}</span>
                </button>
                <button
                  type="button"
                  onClick={() => update(m.movie_id, "remove")}
                  aria-label={`Remove ${m.title} from watchlist`}
                  className="grid size-9 place-items-center rounded-full bg-surface-2 text-muted hover:bg-surface-3 hover:text-text"
                >
                  <XIcon size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
