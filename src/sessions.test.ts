import { describe, expect, it } from 'vitest';
import { LEVELS, OBJECTIVES, PRESET_SESSIONS, RACE_SESSIONS, TARGETED_SESSIONS, buildPresetWorkout, presetEquipment, presetUsesWeight, presetWithoutWeight } from './sessions';
import { EXERCISE_DATABASE } from './exercises';
import { FORMULAS } from './sessionFormulas';

const seconds = (plan: { duration: number }[]) => plan.reduce((sum, i) => sum + i.duration, 0);
const groupOf = (id: string) => EXERCISE_DATABASE.find(ex => ex.id === id)!.group;
// What each level may need: nothing for beginners, a chair for intermediates.
const ALLOWED = { debutant: [], intermediaire: ['chaise'], confirme: ['chaise', 'poids_8kg'] } as const;
const HARD_JUMPS = ['squat_jumps', 'lateral_hops'];

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

  for (const preset of RACE_SESSIONS) {
    // The Complète A of the same distance and level: every formula keeps its shape.
    const base = RACE_SESSIONS.find(p => p.objective === preset.objective && p.level === preset.level)!;
    it(`${preset.name}: same shape and length as ${base.name}`, () => {
      expect(preset.blocks.map(b => [b.rounds, b.exerciseIds.length])).toEqual(base.blocks.map(b => [b.rounds, b.exerciseIds.length]));
      expect(preset.finisherIds).toHaveLength(base.finisherIds.length);
      expect(seconds(buildPresetWorkout(preset, 'equilibre'))).toBe(seconds(buildPresetWorkout(base, 'equilibre')));
    });

    it(`${preset.name}: equipment of its level, calves in every block`, () => {
      const allowed: readonly string[] = ALLOWED[preset.level!];
      expect(presetEquipment(preset).filter(eq => !allowed.includes(eq))).toEqual([]);
      if (preset.level === 'debutant') expect(preset.blocks.flatMap(b => b.exerciseIds).filter(ex => HARD_JUMPS.includes(ex))).toEqual([]);
      for (const block of preset.blocks) expect(block.exerciseIds.some(ex => groupOf(ex) === 'mollets' || ex === 'pogo_jumps')).toBe(true);
    });

    if (presetUsesWeight(preset)) {
      it(`${preset.name}: can be done without a weight, same length`, () => {
        const light = presetWithoutWeight(preset);
        expect(presetEquipment(light)).not.toContain('poids_8kg');
        for (const block of light.blocks) expect(new Set(block.exerciseIds).size).toBe(block.exerciseIds.length);
        const plan = buildPresetWorkout(preset, 'equilibre', false);
        expect(plan.filter(i => i.exercise?.equipmentRequired.includes('poids_8kg'))).toEqual([]);
        expect(seconds(plan)).toBe(seconds(buildPresetWorkout(preset, 'equilibre')));
      });
    }
  }

  it('offers five sessions per level of each race distance, in the order of the formulas', () => {
    for (const objective of OBJECTIVES) {
      for (const level of LEVELS) {
        const sessions = RACE_SESSIONS.filter(p => p.objective === objective.id && p.level === level.id);
        expect(sessions.map(p => p.formula), `${objective.id} ${level.id}`).toEqual(FORMULAS.map(f => f.label));
      }
    }
    expect(TARGETED_SESSIONS.every(p => p.formula === undefined)).toBe(true);
  });

  it('keeps sessions without a weight unchanged', () => {
    const preset = PRESET_SESSIONS.find(p => p.id === 'marathon-debutant')!;
    expect(presetWithoutWeight(preset)).toEqual(preset);
  });

  it('has unique ids', () => {
    expect(new Set(PRESET_SESSIONS.map(p => p.id)).size).toBe(PRESET_SESSIONS.length);
  });

  it('lists the equipment each session needs', () => {
    expect(presetEquipment(PRESET_SESSIONS.find(p => p.id === 'marathon-debutant')!)).toEqual([]);
    expect(presetEquipment(PRESET_SESSIONS.find(p => p.id === 'complete')!)).toEqual(['chaise', 'poids_8kg']);
  });

  it('keeps the ids of the former sessions, so the history still matches', () => {
    expect(PRESET_SESSIONS.find(p => p.id === 'special-marathon')?.level).toBe('intermediaire');
    expect(PRESET_SESSIONS.find(p => p.id === 'complete')?.formula).toBe('Complète A');
    expect(PRESET_SESSIONS.find(p => p.id === '10k-debutant')?.formula).toBe('Complète A');
  });
});
