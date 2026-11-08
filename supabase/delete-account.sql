-- Lets a signed-in person permanently delete their own Zoive account.
-- Paste into Supabase -> SQL Editor -> Run. Safe to run more than once.
-- Their watchlist, ratings and recent searches are deleted too ("on delete cascade").

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer          -- runs with permission to remove the login itself
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  delete from auth.users where id = auth.uid();  -- only ever the caller's own account
end;
$$;

-- Only signed-in users may call it (never anonymous visitors).
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
