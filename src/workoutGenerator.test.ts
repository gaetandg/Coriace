import { describe, expect, it } from 'vitest';
import { generateWorkout } from './workoutGenerator';
import { EXERCISE_DATABASE } from './exercises';
import { ExerciseGroup, WorkoutConfig, WorkoutInterval } from './types';

const ALL_EQUIPMENT: WorkoutConfig['equipment'] = { none: false, chaise: true, poids_8kg: true, corde_a_sauter: true };

const config = (overrides: Partial<WorkoutConfig> = {}): WorkoutConfig => ({
  equipment: ALL_EQUIPMENT,
  rythme: 'equilibre',
  durationMinutes: 30,
  numBlocks: 1,
  selectedExerciseIds: EXERCISE_DATABASE.map(ex => ex.id),
  ...overrides,
});

const totalSeconds = (c: WorkoutConfig) => generateWorkout(c).reduce((sum, i) => sum + i.duration, 0);
const firstRound = (intervals: WorkoutInterval[], block = 1) =>
  intervals.filter(i => i.stage === 'main' && i.type === 'work' && i.roundNumber === 1 && (i.blockNumber || 1) === block);

describe('generateWorkout', () => {
  for (const numBlocks of [1, 2]) {
    for (const rythme of ['equilibre', 'intense'] as const) {
      for (const durationMinutes of [15, 20, 30, 45, 60]) {
        it(`lasts ${durationMinutes} min within 30 s (${rythme}, ${numBlocks} block)`, () => {
          const seconds = totalSeconds(config({ numBlocks, rythme, durationMinutes }));
          expect(Math.abs(seconds - durationMinutes * 60)).toBeLessThanOrEqual(30);
        });
      }
    }
  }

  it('gives every work interval an exercise', () => {
    for (const durationMinutes of [15, 30, 60]) {
      const intervals = generateWorkout(config({ durationMinutes }));
      expect(intervals.filter(i => i.type === 'work' && !i.exercise)).toEqual([]);
    }
  });

  it('alternates work and rest, ending on work', () => {
    const intervals = generateWorkout(config());
    intervals.forEach((interval, index) => expect(interval.type).toBe(index % 2 === 0 ? 'work' : 'rest'));
    expect(intervals[intervals.length - 1].type).toBe('work');
  });

  it('puts the runner-specific groups in every circuit when they are available', () => {
    const required: ExerciseGroup[] = ['mollets', 'adducteurs', 'fessiers', 'gainage'];
    for (let draw = 0; draw < 20; draw++) {
      const groups = firstRound(generateWorkout(config())).map(i => i.exercise!.group);
      for (const group of required) expect(groups).toContain(group);
    }
  });

  it('does not repeat an exercise inside a circuit when enough are selected', () => {
    for (let draw = 0; draw < 20; draw++) {
      const ids = firstRound(generateWorkout(config({ durationMinutes: 60 }))).map(i => i.exercise!.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('uses different exercises in block A and block B', () => {
    for (let draw = 0; draw < 20; draw++) {
      const intervals = generateWorkout(config({ numBlocks: 2, durationMinutes: 45 }));
      const a = firstRound(intervals, 1).map(i => i.exercise!.id);
      const b = firstRound(intervals, 2).map(i => i.exercise!.id);
      expect(a.filter(id => b.includes(id))).toEqual([]);
    }
  });

  it('only uses exercises allowed by the equipment', () => {
    const intervals = generateWorkout(config({ equipment: { none: true, chaise: false, poids_8kg: false, corde_a_sauter: false } }));
    const needingEquipment = intervals.filter(i => i.stage === 'main' && i.exercise && i.exercise.equipmentRequired.length > 0);
    expect(needingEquipment).toEqual([]);
  });

  it('still builds a full session with a single exercise selected', () => {
    const intervals = generateWorkout(config({ selectedExerciseIds: ['squat_classic'] }));
    expect(intervals.filter(i => i.type === 'work' && !i.exercise)).toEqual([]);
    expect(intervals.filter(i => i.stage === 'main').every(i => i.type === 'rest' || i.exercise!.id === 'squat_classic')).toBe(true);
  });
});
