-- Lets a signed-in runner delete their own account from the app, as Google Play requires.
-- The history goes with it (on delete cascade), and so do the traces of their sign-ins.
-- Run once in the Supabase SQL editor (or with `supabase db push`).

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not signed in';
  end if;
  delete from auth.audit_log_entries where payload->>'actor_id' = uid::text;
  delete from auth.users where id = uid;
end;
$$;

-- Only signed-in runners, each for their own account (auth.uid() above).
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
