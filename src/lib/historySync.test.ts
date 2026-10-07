import { describe, expect, it } from 'vitest';
import { mergeHistories } from './historySync';
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
