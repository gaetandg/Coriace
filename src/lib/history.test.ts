import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addHistoryEntry, clearHistory, loadHistory, sessionsInLastDays } from './history';

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
  });
});

const entry = { name: 'Gainage', presetId: 'gainage', minutes: 15, rythme: 'equilibre' as const, exerciseCount: 4 };

describe('history', () => {
  it('starts empty', () => {
    expect(loadHistory()).toEqual([]);
  });

  it('records sessions, most recent first', () => {
    addHistoryEntry(entry, new Date(2026, 9, 5, 18));
    addHistoryEntry({ ...entry, name: 'Complète' }, new Date(2026, 9, 7, 7));
    expect(loadHistory().map(e => e.name)).toEqual(['Complète', 'Gainage']);
  });

  it('counts the sessions of the last days, as a sliding window', () => {
    addHistoryEntry(entry, new Date(2026, 8, 20, 18));
    addHistoryEntry(entry, new Date(2026, 9, 1, 18));
    addHistoryEntry(entry, new Date(2026, 9, 6, 7));
    const entries = loadHistory();
    expect(sessionsInLastDays(entries, 7, new Date(2026, 9, 7, 12))).toBe(2);
    expect(sessionsInLastDays(entries, 7, new Date(2026, 9, 8, 19))).toBe(1);
    expect(sessionsInLastDays(entries, 30, new Date(2026, 9, 7, 12))).toBe(3);
  });

  it('drops malformed entries and survives corrupted storage', () => {
    store.set('coriace:history:v1', JSON.stringify([{ id: 'x' }, { ...entry, id: '1', completedAt: '2026-10-07T10:00:00.000Z' }]));
    expect(loadHistory()).toHaveLength(1);
    store.set('coriace:history:v1', '{oops');
    expect(loadHistory()).toEqual([]);
  });

  it('keeps the exercises of a session, and drops entries with malformed ones', () => {
    addHistoryEntry({ ...entry, exercises: ['side_plank', 'dead_bug'] }, new Date(2026, 9, 7));
    expect(loadHistory()[0].exercises).toEqual(['side_plank', 'dead_bug']);
    store.set('coriace:history:v1', JSON.stringify([{ ...entry, id: '1', completedAt: '2026-10-07T10:00:00.000Z', exercises: [3] }]));
    expect(loadHistory()).toEqual([]);
  });

  it('can be cleared', () => {
    addHistoryEntry(entry);
    clearHistory();
    expect(loadHistory()).toEqual([]);
  });
});
