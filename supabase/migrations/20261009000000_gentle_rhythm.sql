-- Accept the gentle rhythm (20 s of work, 40 s of rest) in the history.
-- Run once in the Supabase SQL editor (or with `supabase db push`).

alter table public.session_history drop constraint if exists session_history_rythme_check;
alter table public.session_history add constraint session_history_rythme_check check (rythme in ('doux', 'equilibre', 'intense'));
