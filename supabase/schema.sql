-- Zoive Movies database. Paste this whole file into Supabase -> SQL Editor -> Run.
-- Safe to run more than once.

-- ── Watchlist ───────────────────────────────────────────────
create table if not exists public.watchlist (
  user_id      uuid        not null default auth.uid() references auth.users on delete cascade,
  movie_id     integer     not null,
  title        text        not null,
  poster_path  text,
  release_date text,
  vote_average real,
  watched      boolean     not null default false,
  added_at     timestamptz not null default now(),
  primary key (user_id, movie_id)
);

-- ── Your star ratings ───────────────────────────────────────
create table if not exists public.ratings (
  user_id      uuid        not null default auth.uid() references auth.users on delete cascade,
  movie_id     integer     not null,
  title        text        not null,
  poster_path  text,
  release_date text,
  stars        smallint    not null check (stars between 1 and 5),
  rated_at     timestamptz not null default now(),
  primary key (user_id, movie_id)
);

-- ── Recent searches (only the latest 10 are kept) ───────────
create table if not exists public.recent_searches (
  user_id     uuid        not null default auth.uid() references auth.users on delete cascade,
  query       text        not null check (char_length(query) between 1 and 100),
  searched_at timestamptz not null default now(),
  primary key (user_id, query)
);

-- ── Row Level Security: each person can only see and change their own rows ──
alter table public.watchlist       enable row level security;
alter table public.ratings         enable row level security;
alter table public.recent_searches enable row level security;

drop policy if exists "own rows" on public.watchlist;
create policy "own rows" on public.watchlist for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "own rows" on public.ratings;
create policy "own rows" on public.ratings for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "own rows" on public.recent_searches;
create policy "own rows" on public.recent_searches for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Keep only each person's 10 most recent searches.
create or replace function public.trim_recent_searches()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.recent_searches r
  where r.user_id = new.user_id
    and r.query not in (
      select s.query from public.recent_searches s
      where s.user_id = new.user_id
      order by s.searched_at desc
      limit 10
    );
  return null;
end;
$$;

drop trigger if exists trim_recent_searches on public.recent_searches;
create trigger trim_recent_searches
  after insert or update on public.recent_searches
  for each row execute function public.trim_recent_searches();

create index if not exists watchlist_user_added on public.watchlist (user_id, added_at desc);
create index if not exists ratings_user_rated on public.ratings (user_id, rated_at desc);
