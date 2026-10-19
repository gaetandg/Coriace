import { describe, expect, it } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { mergeHistories, pushHistoryEntry, syncHistory } from './historySync';
import { HistoryEntry } from './history';

const entry = (id: string, day: number): HistoryEntry => ({
  id, completedAt: new Date(2026, 9, day, 12).toISOString(), name: 'Gainage', minutes: 15, rythme: 'equilibre', exerciseCount: 4,
});

describe('mergeHistories', () => {
  it('keeps every session once, most recent first', () => {
    const merged = mergeHistories([entry('a', 1), entry('c', 3)], [entry('b', 2), entry('c', 3)]);
    expect(merged.map(e => e.id)).toEqual(['c', 'b', 'a']);
  });

  it('works when one side is empty', () => {
    expect(mergeHistories([], [entry('b', 2)]).map(e => e.id)).toEqual(['b']);
    expect(mergeHistories([entry('a', 1)], []).map(e => e.id)).toEqual(['a']);
  });
});

// Minimal stand-in for the Supabase client: records inserts, fails the first one with `firstError`.
function fakeClient(firstError: { code: string } | null) {
  const inserts: Record<string, unknown>[][] = [];
  const client = {
    from: () => ({
      insert: async (rows: Record<string, unknown>[]) => {
        inserts.push(rows);
        return { error: inserts.length === 1 ? firstError : null };
      },
    }),
  } as unknown as SupabaseClient;
  return { client, inserts };
}

describe('pushHistoryEntry', () => {
  const withExercises = { ...entry('a', 1), exercises: ['side_plank'] };

  it('sends the exercises', async () => {
    const { client, inserts } = fakeClient(null);
    await pushHistoryEntry(client, withExercises);
    expect(inserts).toHaveLength(1);
    expect(inserts[0][0].exercises).toEqual(['side_plank']);
  });

  it('still saves the session when the exercises column does not exist yet', async () => {
    const { client, inserts } = fakeClient({ code: 'PGRST204' });
    await pushHistoryEntry(client, withExercises);
    expect(inserts).toHaveLength(2);
    expect(inserts[1][0]).not.toHaveProperty('exercises');
  });

  it('reports other errors', async () => {
    const { client } = fakeClient({ code: '42501' });
    await expect(pushHistoryEntry(client, withExercises)).rejects.toMatchObject({ code: '42501' });
  });
});

describe('syncHistory', () => {
  // The account holds two sessions; sending this device's session fails.
  const failingClient = {
    from: () => ({
      select: async () => ({
        data: [
          { id: 'r1', completed_at: '2026-10-01T10:00:00Z', name: 'Gainage', preset_id: 'gainage', minutes: 15, rythme: 'doux', exercise_count: 4 },
          { id: 'r2', completed_at: '2026-10-05T10:00:00Z', name: 'Côtes', preset_id: null, minutes: 20, rythme: 'intense', exercise_count: 5 },
        ],
        error: null,
      }),
      insert: async () => ({ error: { code: '42501' } }),
    }),
  } as unknown as SupabaseClient;

  it('shows the account\'s sessions even when this device\'s cannot be sent', async () => {
    const merged = await syncHistory(failingClient, [entry('local', 18)]);
    expect(merged.map(e => e.id)).toEqual(['local', 'r2', 'r1']);
  });
});
