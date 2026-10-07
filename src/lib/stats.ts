import { HistoryEntry } from './history';
import { EXERCISE_DATABASE } from '../exercises';
import { EXERCISE_GROUPS } from './groups';
import { ExerciseGroup } from '../types';

const DAY = 24 * 60 * 60 * 1000;

// Monday 00:00 (local time) of the week containing `date`.
export function startOfWeek(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

export interface WeekStats {
  start: Date;
  count: number;
  minutes: number;
}

// The last `weeks` calendar weeks, oldest first; the last one is the current week.
export function weeklyStats(entries: HistoryEntry[], weeks: number, now = new Date()): WeekStats[] {
  const current = startOfWeek(now);
  const result: WeekStats[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(current);
    start.setDate(start.getDate() - 7 * i);
    result.push({ start, count: 0, minutes: 0 });
  }
  for (const entry of entries) {
    const time = new Date(entry.completedAt).getTime();
    if (time > now.getTime()) continue;
    const week = result.find((w, i) => time >= w.start.getTime() && (i === result.length - 1 || time < result[i + 1].start.getTime()));
    if (week) {
      week.count++;
      week.minutes += entry.minutes;
    }
  }
  return result;
}

// Weeks in a row with at least one session. An empty current week doesn't break the run yet.
export function weekStreak(entries: HistoryEntry[], now = new Date()): number {
  const active = new Set(
    entries
      .filter(e => new Date(e.completedAt).getTime() <= now.getTime())
      .map(e => startOfWeek(new Date(e.completedAt)).getTime()),
  );
  const week = startOfWeek(now);
  if (!active.has(week.getTime())) week.setDate(week.getDate() - 7);
  let streak = 0;
  while (active.has(week.getTime())) {
    streak++;
    week.setDate(week.getDate() - 7);
  }
  return streak;
}

// Minutes of the sessions completed in the last `days` days.
export function minutesInLastDays(entries: HistoryEntry[], days: number, now = new Date()): number {
  const since = now.getTime() - days * DAY;
  return entries
    .filter(e => {
      const time = new Date(e.completedAt).getTime();
      return time > since && time <= now.getTime();
    })
    .reduce((sum, e) => sum + e.minutes, 0);
}

// Most completed sessions by name, most frequent first.
export function topSessions(entries: HistoryEntry[], limit: number): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const e of entries) counts.set(e.name, (counts.get(e.name) ?? 0) + 1);
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'fr'))
    .slice(0, limit);
}

export interface GroupSets {
  group: ExerciseGroup;
  label: string;
  sets: number;
}

// Work intervals per exercise group over the last `days` days, in the usual group order.
// `untracked` counts the sessions of that period saved before exercises were recorded.
export function groupSets(entries: HistoryEntry[], days: number, now = new Date()): { groups: GroupSets[]; untracked: number } {
  const since = now.getTime() - days * DAY;
  const recent = entries.filter(e => {
    const time = new Date(e.completedAt).getTime();
    return time > since && time <= now.getTime();
  });
  const groupOf = new Map(EXERCISE_DATABASE.map(e => [e.id, e.group]));
  const sets = new Map<ExerciseGroup, number>();
  for (const id of recent.flatMap(e => e.exercises ?? [])) {
    const group = groupOf.get(id);
    if (group) sets.set(group, (sets.get(group) ?? 0) + 1);
  }
  return {
    groups: EXERCISE_GROUPS.map(g => ({ group: g.id, label: g.label, sets: sets.get(g.id) ?? 0 })),
    untracked: recent.filter(e => !e.exercises).length,
  };
}
