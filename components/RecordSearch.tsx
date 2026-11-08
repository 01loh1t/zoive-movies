"use client";

import { useUser } from "@/components/UserProvider";
import { addRecent } from "@/lib/recent";

/** Saves the query to recent searches when you open one of its results. */
export function RecordSearch({ query, children }: { query: string; children: React.ReactNode }) {
  const { user } = useUser();
  return (
    <div
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest("a")) void addRecent(query, user?.id ?? null);
      }}
    >
      {children}
    </div>
  );
}
