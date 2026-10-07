import { describe, expect, it } from 'vitest';
import { EXERCISE_DATABASE } from '../exercises';
import { SCENES, sceneFrame } from './scenes';
import { skeleton } from './mannequin';
import { FLOOR } from './props';

describe('exercise animations', () => {
  it('exist for every exercise', () => {
    const missing = EXERCISE_DATABASE.filter(e => !SCENES[e.id]).map(e => e.id);
    expect(missing).toEqual([]);
  });

  it('draw valid frames all along the loop, without sinking into the floor', () => {
    for (const [id, scene] of Object.entries(SCENES)) {
      for (let i = 0; i < 40; i++) {
        const ms = (i / 40) * scene.motion.duration;
        const joints = skeleton(scene.motion.at(ms));
        for (const [name, [x, y]] of Object.entries(joints)) {
          expect(Number.isFinite(x) && Number.isFinite(y), `${id} ${name} at ${ms}`).toBe(true);
          expect(y, `${id} ${name} at ${ms}`).toBeLessThan(FLOOR + 2);
        }
        expect(sceneFrame(scene, ms, {})).not.toContain('NaN');
      }
    }
  });
});
