-- "Ton avis": what runners think of the app, sent from the site or the Android app, with or without
-- an account, and never linked to it. Anyone can send one; nobody can read them back through the
-- Data API: they are read from the dashboard (Table Editor).
-- Run once in the Supabase SQL editor (or with `supabase db push`).

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rating smallint check (rating between 1 and 5),
  message text check (char_length(message) between 1 and 2000),
  platform text not null check (platform in ('web', 'pwa', 'android')),
  sessions integer check (sessions >= 0),
  check (rating is not null or message is not null)
);

-- Older projects give the API roles every right on new tables by default: only sending is kept.
revoke all on public.feedback from anon, authenticated;
grant insert on public.feedback to anon, authenticated;
grant all on public.feedback to service_role;

alter table public.feedback enable row level security;

create policy "Send feedback" on public.feedback
  for insert to anon, authenticated with check (true);
