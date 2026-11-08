import type { Metadata } from "next";
import Link from "next/link";
import { StarIcon } from "@/components/icons";
import { MovieCard } from "@/components/MovieCard";
import { Notice } from "@/components/Notice";
import { RequireAccount } from "@/components/RequireAccount";
import { getUser } from "@/lib/supabase/server";
import type { RatingItem } from "@/lib/types";

export const metadata: Metadata = { title: "My ratings" };

type Props = { searchParams: Promise<{ stars?: string }> };

export default async function RatingsPage({ searchParams }: Props) {
  const { supabase, user } = await getUser();
  const sp = await searchParams;
  const filter = ["1", "2", "3", "4", "5"].includes(sp.stars ?? "") ? Number(sp.stars) : null;

  if (!user || !supabase) {
    return (
      <div className="pt-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">My ratings</h1>
        <RequireAccount what="your ratings" next="/ratings" />
      </div>
    );
  }

  const { data } = await supabase
    .from("ratings")
    .select("movie_id, title, poster_path, release_date, stars, rated_at")
    .order("rated_at", { ascending: false });
  const all = (data ?? []) as RatingItem[];
  const shown = filter ? all.filter((r) => r.stars === filter) : all;

  const chip = (active: boolean) =>
    `inline-flex h-10 items-center gap-1 rounded-full px-4 text-sm font-bold ${
      active ? "bg-text text-bg" : "bg-surface-2 hover:bg-surface-3"
    }`;

  return (
    <div className="pt-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">My ratings</h1>
      <p className="mt-1 text-muted">
        {all.length} movie{all.length === 1 ? "" : "s"} rated. Movies you rate 4★ or higher shape your suggestions.
      </p>

      {all.length === 0 ? (
        <Notice title="You haven't rated anything yet" action={{ href: "/", label: "Browse movies" }}>
          Open any movie and tap the stars under the buttons.
        </Notice>
      ) : (
        <>
          <nav aria-label="Filter by stars" className="mt-6">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link href="/ratings" aria-current={!filter ? "page" : undefined} className={chip(!filter)}>
                  All
                </Link>
              </li>
              {[5, 4, 3, 2, 1].map((n) => (
                <li key={n}>
                  <Link
                    href={`/ratings?stars=${n}`}
                    aria-current={filter === n ? "page" : undefined}
                    className={chip(filter === n)}
                  >
                    {n} <StarIcon size={14} filled />
                    <span className="sr-only"> star{n > 1 ? "s" : ""}</span>
                    <span className="ml-1 tabular-nums opacity-70">{all.filter((r) => r.stars === n).length}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {shown.length === 0 ? (
            <p className="my-12 text-center text-muted">No movies with that rating yet.</p>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {shown.map((r) => (
                <li key={r.movie_id}>
                  <MovieCard
                    movie={{ id: r.movie_id, title: r.title, poster_path: r.poster_path, release_date: r.release_date }}
                  />
                  <p className="-mt-1 flex items-center gap-0.5 px-2.5 pb-2 text-accent" aria-label={`You rated it ${r.stars} out of 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <StarIcon key={n} size={14} filled={n <= r.stars} className={n <= r.stars ? "" : "text-muted"} />
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
