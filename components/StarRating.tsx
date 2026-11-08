"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { StarIcon } from "@/components/icons";
import { useToast } from "@/components/Toast";
import { useUser } from "@/components/UserProvider";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { MovieSnapshot } from "@/lib/types";

const WORDS = ["", "Didn't like it", "It was OK", "Liked it", "Really liked it", "Loved it"];

/** Your 1–5 star rating. Built from real radio buttons, so arrow keys and screen readers work. */
export function StarRating({ movie, initial }: { movie: MovieSnapshot; initial: number | null }) {
  const { user, authEnabled } = useUser();
  const toast = useToast();
  const name = useId();
  const [stars, setStars] = useState<number | null>(initial);
  const [hover, setHover] = useState<number | null>(null);

  if (!user) {
    if (!authEnabled) return null;
    return (
      <p className="text-sm text-muted">
        <Link href={`/login?next=/movie/${movie.movie_id}`} className="font-bold text-text underline">
          Sign in
        </Link>{" "}
        to rate this movie and get better suggestions.
      </p>
    );
  }

  async function save(value: number | null) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const prev = stars;
    setStars(value);
    const { error } = value
      ? await supabase.from("ratings").upsert({ ...movie, stars: value, rated_at: new Date().toISOString() })
      : await supabase.from("ratings").delete().eq("movie_id", movie.movie_id);
    if (error) {
      setStars(prev);
      toast("Couldn't save your rating. Try again.", "error");
    } else {
      toast(value ? `Rated ${value} star${value > 1 ? "s" : ""}` : "Rating removed");
    }
  }

  const shown = hover ?? stars ?? 0;

  return (
    <fieldset>
      <legend className="mb-1 text-sm font-bold">Your rating</legend>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="flex" onMouseLeave={() => setHover(null)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="relative cursor-pointer p-1" onMouseEnter={() => setHover(n)}>
              <input
                type="radio"
                name={name}
                value={n}
                checked={stars === n}
                onChange={() => save(n)}
                className="peer sr-only"
              />
              <span className="sr-only">
                {n} star{n > 1 ? "s" : ""}: {WORDS[n]}
              </span>
              <StarIcon
                size={30}
                filled={n <= shown}
                className={`rounded transition-transform peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-ink hover:scale-110 ${
                  n <= shown ? "text-accent" : "text-muted"
                }`}
              />
            </label>
          ))}
        </div>
        <span className="min-w-[8rem] text-sm text-muted" aria-hidden="true">
          {shown ? WORDS[shown] : "Not rated yet"}
        </span>
        {stars && (
          <button
            type="button"
            onClick={() => save(null)}
            className="rounded-full px-3 py-1.5 text-sm font-bold text-muted hover:bg-surface-2 hover:text-text"
          >
            Clear rating
          </button>
        )}
      </div>
    </fieldset>
  );
}
