import { WorkoutConfig } from '../types';

export type Rhythm = WorkoutConfig['rythme'];

// Seconds of work and rest in each minute of the circuit and finisher.
export const RHYTHMS: Record<Rhythm, { work: number; rest: number; label: string }> = {
  doux: { work: 20, rest: 40, label: 'Doux' },
  equilibre: { work: 30, rest: 30, label: 'Équilibré' },
  intense: { work: 40, rest: 20, label: 'Intense' },
};

export const isRhythm = (value: unknown): value is Rhythm => typeof value === 'string' && value in RHYTHMS;

// "20/40", "30/30", "40/20"
export const rhythmTiming = (rythme: Rhythm) => `${RHYTHMS[rythme].work}/${RHYTHMS[rythme].rest}`;
