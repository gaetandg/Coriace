import { describe, expect, it } from 'vitest';
import { generateCustomWorkout, generateWorkout, sessionMinutes, sessionShape } from './workoutGenerator';
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
    for (const rythme of ['doux', 'equilibre', 'intense'] as const) {
      for (const durationMinutes of [15, 20, 30, 45, 60]) {
        it(`lasts ${durationMinutes} min within 30 s (${rythme}, ${numBlocks} block)`, () => {
          const seconds = totalSeconds(config({ numBlocks, rythme, durationMinutes }));
          expect(Math.abs(seconds - durationMinutes * 60)).toBeLessThanOrEqual(30);
        });
      }
    }
  }

  for (const durationMinutes of [15, 20, 30, 45, 60]) {
    it(`keeps ${durationMinutes} min without the warm-up, with more circuit`, () => {
      const warm = generateWorkout(config({ durationMinutes }));
      const skipped = generateWorkout(config({ durationMinutes, skipWarmup: true }));
      expect(skipped.filter(i => i.stage === 'warmup')).toEqual([]);
      expect(Math.abs(skipped.reduce((s, i) => s + i.duration, 0) - durationMinutes * 60)).toBeLessThanOrEqual(30);
      const circuit = (list: WorkoutInterval[]) => list.filter(i => i.stage === 'main' && i.type === 'work').length;
      expect(circuit(skipped)).toBeGreaterThan(circuit(warm));
    });
  }

  it('keeps circuits short: 8 exercises at most, 2 to 4 rounds', () => {
    for (const durationMinutes of [15, 20, 30, 45, 60]) {
      for (const skipWarmup of [false, true]) {
        const shape = sessionShape(durationMinutes, skipWarmup);
        for (const block of shape.blocks) {
          expect(block.length).toBeLessThanOrEqual(8);
          expect(block.rounds).toBeGreaterThanOrEqual(2);
          expect(block.rounds).toBeLessThanOrEqual(4);
        }
      }
    }
  });

  it('ends with a cardio finisher and a cool-down', () => {
    for (let draw = 0; draw < 20; draw++) {
      const intervals = generateWorkout(config({ durationMinutes: 45 }));
      const finishers = intervals.filter(i => i.stage === 'finisher' && i.type === 'work');
      for (const f of finishers) expect(f.exercise!.group === 'cardio' || f.exercise!.equipmentRequired.includes('corde_a_sauter')).toBe(true);
      expect(intervals[intervals.length - 1].stage).toBe('cooldown');
    }
  });

  it('warms up from gentle to lively without repeating a move', () => {
    for (const durationMinutes of [15, 30, 60]) {
      const ids = generateWorkout(config({ durationMinutes })).filter(i => i.stage === 'warmup' && i.type === 'work').map(i => i.exercise!.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids[0]).toBe('warmup_mobility');
    }
  });

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

  it('never puts two exercises of the same group in a row inside a circuit', () => {
    for (let draw = 0; draw < 50; draw++) {
      const groups = firstRound(generateWorkout(config())).map(i => i.exercise!.group);
      groups.slice(1).forEach((group, k) => expect(group).not.toBe(groups[k]));
    }
  });

  it('keeps at most two exercises of a group in a 30 min circuit', () => {
    for (let draw = 0; draw < 50; draw++) {
      const groups = firstRound(generateWorkout(config())).map(i => i.exercise!.group);
      for (const group of new Set(groups)) expect(groups.filter(g => g === group).length).toBeLessThanOrEqual(2);
    }
  });

  it('changes the order of the groups from one draw to the next', () => {
    const orders = new Set<string>();
    for (let draw = 0; draw < 20; draw++) {
      orders.add(firstRound(generateWorkout(config())).map(i => i.exercise!.group).join(','));
    }
    expect(orders.size).toBeGreaterThan(5);
  });

  // Key groups have few exercises (3 for glutes), so a group may have to repeat one.
  it('regenerates a mostly different circuit', () => {
    for (let draw = 0; draw < 20; draw++) {
      const first = generateWorkout(config({ durationMinutes: 30 }));
      const second = generateWorkout(config({ durationMinutes: 30 }), first);
      const before = new Set(first.filter(i => i.stage !== 'warmup' && i.exercise).map(i => i.exercise!.id));
      const repeated = firstRound(second).filter(i => before.has(i.exercise!.id));
      expect(repeated.length).toBeLessThanOrEqual(2);
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

describe('personalized sessions', () => {
  const picked = ['copenhagen_plank', 'calves_standing_slow', 'side_plank', 'single_leg_bridge', 'squat_sumo', 'dead_bug'];
  const custom = (overrides: Partial<WorkoutConfig> = {}) => config({ customExerciseIds: picked, customRounds: 3, ...overrides });

  it('puts every selected exercise in the circuit, for each round, and nothing else', () => {
    const work = generateCustomWorkout(custom()).filter(i => i.stage === 'main' && i.type === 'work');
    expect(work).toHaveLength(picked.length * 3);
    for (let round = 1; round <= 3; round++) {
      expect(work.filter(i => i.roundNumber === round).map(i => i.exercise!.id).sort()).toEqual([...picked].sort());
    }
  });

  it('has no finisher, a cool-down, and a warm-up unless it is skipped', () => {
    const intervals = generateCustomWorkout(custom());
    expect(intervals.some(i => i.stage === 'finisher')).toBe(false);
    expect(intervals.some(i => i.stage === 'cooldown')).toBe(true);
    expect(intervals.some(i => i.stage === 'warmup')).toBe(true);
    const skipped = generateCustomWorkout(custom({ skipWarmup: true }));
    expect(skipped.some(i => i.stage === 'warmup')).toBe(false);
    expect(sessionMinutes(skipped)).toBeLessThan(sessionMinutes(intervals));
  });

  it('gets longer with each round and leaves out exercises the equipment rules out', () => {
    expect(sessionMinutes(generateCustomWorkout(custom({ customRounds: 4 })))).toBeGreaterThan(sessionMinutes(generateCustomWorkout(custom())));
    const noChair = generateCustomWorkout(custom({ equipment: { none: true, chaise: false, poids_8kg: false, corde_a_sauter: false } }));
    expect(noChair.some(i => i.exercise?.id === 'copenhagen_plank')).toBe(false);
  });
});
