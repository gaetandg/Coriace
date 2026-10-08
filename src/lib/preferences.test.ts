import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PREFERENCES, loadPreferences, savePreferences } from './preferences';
import { EXERCISE_DATABASE } from '../exercises';

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
  });
});

describe('preferences', () => {
  it('uses the defaults when nothing is saved', () => {
    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES);
  });

  it('round-trips the saved settings', () => {
    const prefs = {
      config: {
        equipment: { none: true, chaise: false, poids_8kg: false, corde_a_sauter: false },
        rythme: 'intense' as const,
        durationMinutes: 45,
        skipWarmup: true,
        selectedExerciseIds: EXERCISE_DATABASE.map(ex => ex.id).filter(id => id !== 'pushups'),
        customExerciseIds: ['side_plank'],
        customRounds: 2,
      },
      sound: { beeps: false, voice: true },
      mode: 'custom' as const,
    };
    savePreferences(prefs);
    expect(loadPreferences()).toEqual(prefs);
  });

  it('checks exercises that did not exist when the settings were saved', () => {
    store.set('coriace:preferences:v1', JSON.stringify({ excludedExerciseIds: ['pushups'] }));
    const selected = loadPreferences().config.selectedExerciseIds!;
    expect(selected).not.toContain('pushups');
    expect(selected).toHaveLength(EXERCISE_DATABASE.length - 1);
  });

  it('ignores corrupted or invalid values', () => {
    store.set('coriace:preferences:v1', '{not json');
    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES);
    store.set('coriace:preferences:v1', JSON.stringify({ durationMinutes: 999, rythme: 'fast', sound: { voice: 'yes' }, mode: 'other' }));
    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES);
  });

  it('keeps working when storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
    });
    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES);
    expect(() => savePreferences(DEFAULT_PREFERENCES)).not.toThrow();
  });
});

describe('session modes', () => {
  it('turns the old custom mode into random sessions, which it was', () => {
    store.set('coriace:preferences:v1', JSON.stringify({ mode: 'custom' }));
    expect(loadPreferences().mode).toBe('random');
    store.set('coriace:preferences:v1', JSON.stringify({ mode: 'preset' }));
    expect(loadPreferences().mode).toBe('preset');
  });

  it('starts personalized sessions with nothing selected, and remembers the choice', () => {
    expect(loadPreferences().config.customExerciseIds).toEqual([]);
    const prefs = loadPreferences();
    savePreferences({ ...prefs, mode: 'custom', config: { ...prefs.config, customExerciseIds: ['dead_bug', 'side_plank'], customRounds: 4 } });
    const loaded = loadPreferences();
    expect(loaded.mode).toBe('custom');
    expect(loaded.config.customExerciseIds).toEqual(['side_plank', 'dead_bug']);
    expect(loaded.config.customRounds).toBe(4);
  });
});
