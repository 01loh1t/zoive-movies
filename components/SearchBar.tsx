"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SearchIcon, XIcon } from "@/components/icons";
import { useUser } from "@/components/UserProvider";
import { addRecent } from "@/lib/recent";

/**
 * Search box. Works without JavaScript (plain GET form to /search).
 * On the search page it updates results as you type (debounced).
 */
export function SearchBar({
  defaultValue = "",
  size = "compact",
  autoFocus = false,
}: {
  defaultValue?: string;
  size?: "compact" | "hero";
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const [value, setValue] = useState(defaultValue);
  const [prevDefault, setPrevDefault] = useState(defaultValue);
  const [lastPushed, setLastPushed] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const live = pathname === "/search";

  // The URL changed from outside (e.g. a recent-search chip): show that query.
  // Ignore URL updates we caused ourselves while typing, so no keystrokes are lost.
  if (defaultValue !== prevDefault) {
    setPrevDefault(defaultValue);
    if (defaultValue !== lastPushed) setValue(defaultValue);
  }

  // Autofocus only with a mouse/trackpad, so phones don't pop the keyboard up uninvited.
  useEffect(() => {
    if (autoFocus && window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
  }, [autoFocus]);

  // Live results while typing, only on /search.
  useEffect(() => {
    if (!live) return;
    const q = value.trim();
    if (q === defaultValue.trim()) return;
    const t = setTimeout(() => {
      setLastPushed(q);
      router.replace(q ? `/search?q=${encodeURIComponent(q)}` : "/search", { scroll: false });
    }, 350);
    return () => clearTimeout(t);
  }, [value, live, defaultValue, router]);

  const hero = size === "hero";

  return (
    <form
      role="search"
      action="/search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (!q) return inputRef.current?.focus();
        void addRecent(q, user?.id ?? null);
        setLastPushed(q);
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className="relative w-full"
    >
      <label htmlFor={hero ? "search-hero" : "search-compact"} className="sr-only">
        Search movies
      </label>
      <SearchIcon
        size={hero ? 22 : 18}
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${hero ? "left-5" : "left-4"}`}
      />
      <input
        ref={inputRef}
        id={hero ? "search-hero" : "search-compact"}
        name="q"
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={hero ? "Search for a movie, e.g. Inception…" : "Search movies…"}
        className={`w-full rounded-full bg-surface-2 text-text shadow-[inset_0_0_0_1px_var(--border)] placeholder:text-muted focus:bg-surface focus:shadow-[inset_0_0_0_2px_var(--accent-ink)] focus:outline-none [&::-webkit-search-cancel-button]:hidden ${
          hero ? "h-14 pl-14 pr-14 text-lg" : "h-11 pl-11 pr-11 text-[15px]"
        }`}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setValue("");
            inputRef.current?.focus();
          }}
          className={`absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface-3 hover:text-text ${
            hero ? "right-3" : "right-1.5"
          }`}
        >
          <XIcon size={18} />
        </button>
      )}
    </form>
  );
}
