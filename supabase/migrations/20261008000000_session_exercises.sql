-- Exercises of each completed session: one exercise id per work interval, in order.
-- Run once in the Supabase SQL editor (or with `supabase db push`).

alter table public.session_history add column if not exists exercises text[];
