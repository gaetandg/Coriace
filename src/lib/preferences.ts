import { EXERCISE_DATABASE } from '../exercises';
import { SoundSettings, WorkoutConfig } from '../types';

// Settings remembered between visits, in this browser only.

const STORAGE_KEY = 'coriace:preferences:v1';

// Ready-made sessions or a custom one, as last chosen on the home screen.
export type SessionMode = 'preset' | 'custom';

export interface Preferences {
  config: WorkoutConfig;
  sound: SoundSettings;
  mode: SessionMode;
}

// Unchecked exercises are stored rather than checked ones, so exercises added in a later
// version start checked.
interface StoredPreferences {
  equipment?: Partial<WorkoutConfig['equipment']>;
  rythme?: WorkoutConfig['rythme'];
  durationMinutes?: number;
  excludedExerciseIds?: string[];
  sound?: Partial<SoundSettings>;
  mode?: SessionMode;
}

export const DEFAULT_PREFERENCES: Preferences = {
  config: {
    equipment: { none: false, chaise: true, poids_8kg: true, corde_a_sauter: false },
    rythme: 'equilibre',
    durationMinutes: 30,
    selectedExerciseIds: EXERCISE_DATABASE.map(ex => ex.id),
  },
  sound: { beeps: true, voice: true },
  mode: 'custom',
};

const DURATIONS = [15, 20, 30, 45, 60];
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

// Anything missing, malformed or from an unknown version falls back to the defaults.
export function loadPreferences(): Preferences {
  let stored: StoredPreferences;
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return DEFAULT_PREFERENCES;
  }
  if (!stored || typeof stored !== 'object') return DEFAULT_PREFERENCES;

  const defaults = DEFAULT_PREFERENCES;
  const equipment = { ...defaults.config.equipment };
  for (const key of Object.keys(equipment) as (keyof typeof equipment)[]) {
    if (isBoolean(stored.equipment?.[key])) equipment[key] = stored.equipment[key]!;
  }
  const excluded = Array.isArray(stored.excludedExerciseIds) ? stored.excludedExerciseIds : [];

  return {
    config: {
      equipment,
      rythme: stored.rythme === 'intense' || stored.rythme === 'equilibre' ? stored.rythme : defaults.config.rythme,
      durationMinutes: DURATIONS.includes(stored.durationMinutes as number) ? stored.durationMinutes : defaults.config.durationMinutes,
      selectedExerciseIds: EXERCISE_DATABASE.map(ex => ex.id).filter(id => !excluded.includes(id)),
    },
    sound: {
      beeps: isBoolean(stored.sound?.beeps) ? stored.sound.beeps : defaults.sound.beeps,
      voice: isBoolean(stored.sound?.voice) ? stored.sound.voice : defaults.sound.voice,
    },
    mode: stored.mode === 'custom' || stored.mode === 'preset' ? stored.mode : defaults.mode,
  };
}

export function savePreferences({ config, sound, mode }: Preferences) {
  const selected = config.selectedExerciseIds ?? EXERCISE_DATABASE.map(ex => ex.id);
  const stored: StoredPreferences = {
    equipment: config.equipment,
    rythme: config.rythme,
    durationMinutes: config.durationMinutes,
    excludedExerciseIds: EXERCISE_DATABASE.map(ex => ex.id).filter(id => !selected.includes(id)),
    sound,
    mode,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Private browsing or storage full: preferences just aren't kept.
  }
}
