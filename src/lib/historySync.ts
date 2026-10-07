import type { SupabaseClient } from '@supabase/supabase-js';
import { HistoryEntry } from './history';

// Keeps the local history and the account's history in step.

interface HistoryRow {
  id: string;
  completed_at: string;
  name: string;
  preset_id: string | null;
  minutes: number;
  rythme: HistoryEntry['rythme'];
  exercise_count: number;
  exercises?: string[] | null;
}

const toRow = (entry: HistoryEntry): HistoryRow => ({
  id: entry.id,
  completed_at: entry.completedAt,
  name: entry.name,
  preset_id: entry.presetId ?? null,
  minutes: entry.minutes,
  rythme: entry.rythme,
  exercise_count: entry.exerciseCount,
  exercises: entry.exercises ?? null,
});

const fromRow = (row: HistoryRow): HistoryEntry => ({
  id: row.id,
  completedAt: new Date(row.completed_at).toISOString(),
  name: row.name,
  ...(row.preset_id ? { presetId: row.preset_id } : {}),
  minutes: row.minutes,
  rythme: row.rythme,
  exerciseCount: row.exercise_count,
  ...(row.exercises ? { exercises: row.exercises } : {}),
});

// PGRST204: a column is missing from the table. Until the `exercises` migration is run,
// sessions are still saved, without their exercises.
async function insertRows(client: SupabaseClient, rows: HistoryRow[]) {
  const { error } = await client.from('session_history').insert(rows);
  if (error?.code === 'PGRST204') {
    const { error: retryError } = await client.from('session_history').insert(rows.map(({ exercises: _, ...row }) => row));
    if (retryError) throw retryError;
  } else if (error) {
    throw error;
  }
}

// Union of both lists by id, most recent first.
export function mergeHistories(local: HistoryEntry[], remote: HistoryEntry[]): HistoryEntry[] {
  const byId = new Map<string, HistoryEntry>();
  for (const entry of [...remote, ...local]) byId.set(entry.id, entry);
  return [...byId.values()].sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt));
}

// Sends the sessions only known on this device, then returns the merged history.
export async function syncHistory(client: SupabaseClient, local: HistoryEntry[]): Promise<HistoryEntry[]> {
  const { data, error } = await client.from('session_history').select('*');
  if (error) throw error;
  const remote = (data as HistoryRow[]).map(fromRow);
  const remoteIds = new Set(remote.map(e => e.id));
  const missing = local.filter(e => !remoteIds.has(e.id));
  if (missing.length > 0) {
    await insertRows(client, missing.map(toRow));
  }
  return mergeHistories(local, remote);
}

export async function pushHistoryEntry(client: SupabaseClient, entry: HistoryEntry) {
  await insertRows(client, [toRow(entry)]);
}

export async function deleteRemoteHistory(client: SupabaseClient, userId: string) {
  const { error } = await client.from('session_history').delete().eq('user_id', userId);
  if (error) throw error;
}
