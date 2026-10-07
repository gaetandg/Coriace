import { describe, expect, it } from 'vitest';
import { EXERCISE_DATABASE } from './exercises';

describe('exercise list', () => {
  it('has unique ids', () => {
    const ids = EXERCISE_DATABASE.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives an easier and a harder option for every exercise', () => {
    for (const exercise of EXERCISE_DATABASE) {
      expect(exercise.easier, exercise.id).toBeTruthy();
      expect(exercise.harder, exercise.id).toBeTruthy();
    }
  });

  it('warns before every jump', () => {
    const jumps = EXERCISE_DATABASE.filter(e => /saut|corde/i.test(e.name) && e.id !== 'jumping_jacks');
    expect(jumps.length).toBeGreaterThanOrEqual(4);
    for (const exercise of jumps) expect(exercise.caution, exercise.id).toBeTruthy();
  });

  it('offers three jump rope exercises', () => {
    expect(EXERCISE_DATABASE.filter(e => e.equipmentRequired.includes('corde_a_sauter'))).toHaveLength(3);
  });
});
