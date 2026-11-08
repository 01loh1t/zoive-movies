"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DECADES, GENRES, MOODS, RUNTIMES, SORTS } from "@/lib/catalog";

export type FilterState = {
  mood?: string;
  genres: string[];
  decade?: string;
  runtime?: string;
  rating?: string;
  sort?: string;
};

const pill =
  "relative inline-flex h-10 cursor-pointer select-none items-center gap-1.5 rounded-full bg-surface-2 px-4 text-sm font-bold transition-colors hover:bg-surface-3 peer-checked:bg-text peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-ink";
const select =
  "h-11 w-full rounded-full bg-surface-2 px-4 text-sm font-semibold text-text shadow-[inset_0_0_0_1px_var(--border)]";

/**
 * Discover filters. A normal GET form (works without JavaScript);
 * with JavaScript, results update as soon as you change something.
 */
export function Filters({ state }: { state: FilterState }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  function apply(changed?: HTMLInputElement) {
    const form = formRef.current;
    if (!form) return;
    // Mood and genres don't mix well, so picking one clears the other.
    if (changed?.name === "mood") form.querySelectorAll<HTMLInputElement>('input[name="genre"]').forEach((i) => (i.checked = false));
    if (changed?.name === "genre") form.querySelectorAll<HTMLInputElement>('input[name="mood"]').forEach((i) => (i.checked = false));

    const sp = new URLSearchParams();
    for (const [k, v] of new FormData(form)) if (typeof v === "string" && v) sp.append(k, v);
    const qs = sp.toString();
    router.push(qs ? `/discover?${qs}` : "/discover", { scroll: false });
  }

  const extraCount =
    state.genres.length +
    [state.decade, state.runtime, state.rating, state.sort && state.sort !== "popularity.desc"].filter(Boolean).length;
  const hasAny = Boolean(state.mood) || extraCount > 0;
  // On phones, genres + dropdowns fold away until you ask for them.
  const [more, setMore] = useState(extraCount > 0);

  return (
    <form
      ref={formRef}
      action="/discover"
      onChange={(e) => {
        const target = e.target as EventTarget;
        apply(target instanceof HTMLInputElement ? target : undefined);
      }}
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
      className="space-y-5"
    >
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-muted">Mood</legend>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <label key={m.id}>
              <input type="radio" name="mood" value={m.id} defaultChecked={state.mood === m.id} className="peer sr-only" />
              <span className={pill}>
                <span aria-hidden="true">{m.emoji}</span>
                {m.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        aria-expanded={more}
        aria-controls="more-filters"
        onClick={() => setMore((m) => !m)}
        className="inline-flex h-10 items-center rounded-full bg-surface-2 px-4 text-sm font-bold hover:bg-surface-3 md:hidden"
      >
        {more ? "Fewer filters" : `More filters${extraCount ? ` (${extraCount})` : ""}`}
      </button>

      <div id="more-filters" className={`space-y-5 md:block ${more ? "block" : "hidden"}`}>
      <fieldset>
        <legend className="mb-2 text-sm font-bold text-muted">Genres (any of)</legend>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <label key={g.id}>
              <input
                type="checkbox"
                name="genre"
                value={g.id}
                defaultChecked={state.genres.includes(String(g.id))}
                className="peer sr-only"
              />
              <span className={pill}>{g.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="f-decade" className="mb-1.5 block text-sm font-bold text-muted">
            Released
          </label>
          <select id="f-decade" name="decade" defaultValue={state.decade ?? ""} className={select}>
            <option value="">Any time</option>
            {DECADES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-runtime" className="mb-1.5 block text-sm font-bold text-muted">
            Length
          </label>
          <select id="f-runtime" name="runtime" defaultValue={state.runtime ?? ""} className={select}>
            <option value="">Any length</option>
            {RUNTIMES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-rating" className="mb-1.5 block text-sm font-bold text-muted">
            TMDB rating
          </label>
          <select id="f-rating" name="rating" defaultValue={state.rating ?? ""} className={select}>
            <option value="">Any rating</option>
            <option value="6">6+ (good)</option>
            <option value="7">7+ (great)</option>
            <option value="8">8+ (excellent)</option>
          </select>
        </div>
        <div>
          <label htmlFor="f-sort" className="mb-1.5 block text-sm font-bold text-muted">
            Sort by
          </label>
          <select id="f-sort" name="sort" defaultValue={state.sort ?? "popularity.desc"} className={select}>
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      </div>

      <div className="flex items-center gap-3">
        <noscript>
          <button type="submit" className="h-11 rounded-full bg-accent px-6 text-sm font-bold text-on-accent">
            Apply filters
          </button>
        </noscript>
        {hasAny && (
          <Link
            href="/discover"
            scroll={false}
            className="inline-flex h-10 items-center rounded-full px-4 text-sm font-bold text-muted hover:bg-surface-2 hover:text-text"
          >
            Reset all filters
          </Link>
        )}
      </div>
    </form>
  );
}
