-- History of completed sessions, one row per session, readable and writable only by its owner.
-- Run once in the Supabase SQL editor (or with `supabase db push`).

create table if not exists public.session_history (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null,
  completed_at timestamptz not null,
  name text not null,
  preset_id text,
  minutes integer not null,
  rythme text not null check (rythme in ('equilibre', 'intense')),
  exercise_count integer not null,
  primary key (user_id, id)
);

alter table public.session_history enable row level security;

create policy "Read own history" on public.session_history
  for select using (auth.uid() = user_id);

create policy "Add to own history" on public.session_history
  for insert with check (auth.uid() = user_id);

create policy "Delete own history" on public.session_history
  for delete using (auth.uid() = user_id);
