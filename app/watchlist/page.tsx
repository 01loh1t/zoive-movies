import type { Metadata } from "next";
import { RequireAccount } from "@/components/RequireAccount";
import { getUser } from "@/lib/supabase/server";
import type { WatchItem } from "@/lib/types";
import { WatchlistView } from "./WatchlistView";

export const metadata: Metadata = { title: "Watchlist" };

export default async function WatchlistPage() {
  const { supabase, user } = await getUser();

  return (
    <div className="pt-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Your watchlist</h1>
      {!user || !supabase ? (
        <RequireAccount what="your watchlist" next="/watchlist" />
      ) : (
        <WatchlistView
          initial={
            ((
              await supabase
                .from("watchlist")
                .select("movie_id, title, poster_path, release_date, vote_average, watched, added_at")
                .order("added_at", { ascending: false })
            ).data ?? []) as WatchItem[]
          }
        />
      )}
    </div>
  );
}
