import { describe, expect, it } from 'vitest';
import { HistoryEntry } from './history';
import { minutesInLastDays, startOfWeek, topSessions, weekStreak, weeklyStats } from './stats';

let n = 0;
const at = (date: Date, name = 'Gainage', minutes = 15): HistoryEntry => ({
  id: String(n++), completedAt: date.toISOString(), name, minutes, rythme: 'equilibre', exerciseCount: 4,
});

// Wednesday 7 October 2026, 12:00.
const now = new Date(2026, 9, 7, 12);

describe('stats', () => {
  it('starts weeks on Monday', () => {
    expect(startOfWeek(now)).toEqual(new Date(2026, 9, 5));
    expect(startOfWeek(new Date(2026, 9, 4, 23))).toEqual(new Date(2026, 8, 28));
    expect(startOfWeek(new Date(2026, 9, 5, 0))).toEqual(new Date(2026, 9, 5));
  });

  it('counts sessions and minutes per week, oldest first', () => {
    const entries = [
      at(new Date(2026, 9, 6, 18), 'Gainage', 15),
      at(new Date(2026, 9, 5, 7), 'Complète', 45),
      at(new Date(2026, 9, 4, 20)),
      at(new Date(2026, 7, 1)), // too old
    ];
    const weeks = weeklyStats(entries, 3, now);
    expect(weeks.map(w => w.start)).toEqual([new Date(2026, 8, 21), new Date(2026, 8, 28), new Date(2026, 9, 5)]);
    expect(weeks.map(w => w.count)).toEqual([0, 1, 2]);
    expect(weeks[2].minutes).toBe(60);
  });

  it('counts weeks in a row, without breaking on an empty current week', () => {
    expect(weekStreak([], now)).toBe(0);
    const lastWeeks = [at(new Date(2026, 9, 1)), at(new Date(2026, 8, 22)), at(new Date(2026, 8, 8))];
    expect(weekStreak(lastWeeks, now)).toBe(2);
    expect(weekStreak([...lastWeeks, at(new Date(2026, 9, 6))], now)).toBe(3);
    expect(weekStreak([at(new Date(2026, 8, 22))], now)).toBe(0);
  });

  it('adds up the minutes of the last days', () => {
    const entries = [at(new Date(2026, 9, 6), 'Gainage', 15), at(new Date(2026, 8, 20), 'Complète', 45), at(new Date(2026, 7, 1), 'Complète', 45)];
    expect(minutesInLastDays(entries, 30, now)).toBe(60);
  });

  it('ranks the most completed sessions', () => {
    const entries = [at(now, 'Gainage'), at(now, 'Complète'), at(now, 'Gainage'), at(now, 'Mollets express')];
    expect(topSessions(entries, 2)).toEqual([{ name: 'Gainage', count: 2 }, { name: 'Complète', count: 1 }]);
  });
});
