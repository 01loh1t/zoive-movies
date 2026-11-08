"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HistoryIcon, XIcon } from "@/components/icons";
import { useUser } from "@/components/UserProvider";
import { clearRecent, loadRecent, onRecentChange, removeRecent } from "@/lib/recent";

/** "Your recent searches" chips. Hidden until there is something to show. */
export function RecentSearches() {
  const { user } = useUser();
  const userId = user?.id ?? null;
  const [items, setItems] = useState<string[] | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () => loadRecent(userId).then((list) => alive && setItems(list));
    load();
    const off = onRecentChange(load);
    return () => {
      alive = false;
      off();
    };
  }, [userId]);

  if (!items || items.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading" className="mt-6">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h2 id="recent-heading" className="flex items-center gap-2 text-sm font-bold text-muted">
          <HistoryIcon size={16} />
          Your recent searches
        </h2>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear all your recent searches?")) void clearRecent(userId);
          }}
          className="rounded-full px-3 py-1.5 text-sm font-bold text-muted hover:bg-surface-2 hover:text-text"
        >
          Clear all
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map((q) => (
          <li key={q} className="flex items-center rounded-full bg-surface-2 text-sm">
            <Link
              href={`/search?q=${encodeURIComponent(q)}`}
              className="max-w-[16rem] truncate rounded-full py-2 pl-4 pr-1 font-semibold hover:text-accent-ink"
            >
              {q}
            </Link>
            <button
              type="button"
              aria-label={`Remove “${q}” from recent searches`}
              onClick={() => removeRecent(q, userId)}
              className="mr-1 grid size-8 place-items-center rounded-full text-muted hover:bg-surface-3 hover:text-text"
            >
              <XIcon size={14} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
