import { describe, expect, it } from 'vitest';
import { PRESET_SESSIONS, buildPresetWorkout, presetEquipment } from './sessions';

describe('preset sessions', () => {
  for (const preset of PRESET_SESSIONS) {
    for (const rythme of ['equilibre', 'intense'] as const) {
      it(`${preset.name} lasts its announced ${preset.durationMinutes} min within 30 s (${rythme})`, () => {
        const seconds = buildPresetWorkout(preset, rythme).reduce((sum, i) => sum + i.duration, 0);
        expect(Math.abs(seconds - preset.durationMinutes * 60)).toBeLessThanOrEqual(30);
      });
    }

    it(`${preset.name} runs its exercises in a fixed order`, () => {
      const order = () => buildPresetWorkout(preset, 'equilibre').filter(i => i.type === 'work').map(i => i.exercise!.id);
      expect(order()).toEqual(order());
    });

    it(`${preset.name} does not repeat an exercise inside a circuit`, () => {
      for (const block of preset.blocks) {
        expect(new Set(block.exerciseIds).size).toBe(block.exerciseIds.length);
      }
    });
  }

  it('has unique ids', () => {
    expect(new Set(PRESET_SESSIONS.map(p => p.id)).size).toBe(PRESET_SESSIONS.length);
  });

  it('lists the equipment each session needs', () => {
    expect(presetEquipment(PRESET_SESSIONS.find(p => p.id === 'sans-materiel')!)).toEqual([]);
    expect(presetEquipment(PRESET_SESSIONS.find(p => p.id === 'complete')!)).toEqual(['chaise', 'poids_8kg']);
  });
});
