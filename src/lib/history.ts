import { WorkoutConfig } from '../types';

// Completed sessions, kept in this browser only.

const STORAGE_KEY = 'coriace:history:v1';
const MAX_ENTRIES = 500;

export interface HistoryEntry {
  id: string;
  completedAt: string; // ISO date
  name: string;
  presetId?: string;
  minutes: number;
  rythme: WorkoutConfig['rythme'];
  exerciseCount: number;
}

const isEntry = (value: unknown): value is HistoryEntry => {
  const e = value as HistoryEntry;
  return !!e && typeof e === 'object'
    && typeof e.id === 'string'
    && typeof e.completedAt === 'string' && !Number.isNaN(Date.parse(e.completedAt))
    && typeof e.name === 'string'
    && typeof e.minutes === 'number'
    && (e.rythme === 'equilibre' || e.rythme === 'intense')
    && typeof e.exerciseCount === 'number';
};

// Most recent first; malformed entries are dropped.
export function loadHistory(): HistoryEntry[] {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter(isEntry) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // Private browsing or storage full: the session just isn't recorded.
  }
}

export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'completedAt'>, now = new Date()): HistoryEntry[] {
  const full: HistoryEntry = { ...entry, id: `${now.getTime()}`, completedAt: now.toISOString() };
  const entries = [full, ...loadHistory()];
  saveHistory(entries);
  return entries;
}

export function clearHistory() {
  saveHistory([]);
}

// Sessions completed in the last `days` days, counting back from now.
export function sessionsInLastDays(entries: HistoryEntry[], days: number, now = new Date()): number {
  const since = now.getTime() - days * 24 * 60 * 60 * 1000;
  return entries.filter(e => {
    const time = Date.parse(e.completedAt);
    return time > since && time <= now.getTime();
  }).length;
}
