"use client";

import { useState } from "react";
import Link from "next/link";
import { BookmarkIcon } from "@/components/icons";
import { useToast } from "@/components/Toast";
import { useUser } from "@/components/UserProvider";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { MovieSnapshot } from "@/lib/types";

export function WatchlistButton({
  movie,
  voteAverage,
  initialSaved,
}: {
  movie: MovieSnapshot;
  voteAverage: number | null;
  initialSaved: boolean;
}) {
  const { user, authEnabled } = useUser();
  const toast = useToast();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  const base =
    "inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-bold uppercase tracking-[0.1em] transition-colors disabled:opacity-60";

  if (!user) {
    if (!authEnabled) return null;
    return (
      <Link href={`/login?next=/movie/${movie.movie_id}`} className={`${base} bg-surface-2 hover:bg-surface-3`}>
        <BookmarkIcon size={18} /> Sign in to save
      </Link>
    );
  }

  async function toggle() {
    const supabase = getSupabaseBrowser();
    if (!supabase || busy) return;
    setBusy(true);
    const next = !saved;
    setSaved(next); // optimistic
    const { error } = next
      ? await supabase.from("watchlist").upsert({ ...movie, vote_average: voteAverage })
      : await supabase.from("watchlist").delete().eq("movie_id", movie.movie_id);
    setBusy(false);
    if (error) {
      setSaved(!next);
      toast("Couldn't update your watchlist. Try again.", "error");
    } else {
      toast(next ? "Added to your watchlist" : "Removed from your watchlist");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      className={`${base} ${saved ? "bg-text text-bg hover:opacity-90" : "bg-surface-2 hover:bg-surface-3"}`}
    >
      <BookmarkIcon size={18} filled={saved} />
      {saved ? "On watchlist" : "Add to watchlist"}
    </button>
  );
}
