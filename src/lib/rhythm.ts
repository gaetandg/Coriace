import { WorkoutConfig } from '../types';

export type Rhythm = WorkoutConfig['rythme'];

// Seconds of work and rest in each minute of the circuit and finisher.
export const RHYTHMS: Record<Rhythm, { work: number; rest: number; label: string; hint: string }> = {
  doux: { work: 20, rest: 40, label: 'Doux', hint: '20 s d\'effort, 40 s de récup sur chaque exercice. Pour débuter ou reprendre.' },
  equilibre: { work: 30, rest: 30, label: 'Équilibré', hint: '30 s d\'effort, 30 s de récup sur chaque exercice. Le bon point de départ.' },
  intense: { work: 40, rest: 20, label: 'Intense', hint: '40 s d\'effort, 20 s de récup sur chaque exercice. Quand tu es à l\'aise.' },
};

export const isRhythm = (value: unknown): value is Rhythm => typeof value === 'string' && value in RHYTHMS;

// "20/40", "30/30", "40/20"
export const rhythmTiming = (rythme: Rhythm) => `${RHYTHMS[rythme].work}/${RHYTHMS[rythme].rest}`;
