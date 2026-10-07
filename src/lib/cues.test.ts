import { describe, expect, it } from 'vitest';
import { intervalStartCue, speakable, tickCue } from './cues';
import { EXERCISE_DATABASE } from '../exercises';
import { WorkoutInterval } from '../types';

const exercise = (id: string) => EXERCISE_DATABASE.find(ex => ex.id === id)!;

const work = (id: string, duration = 30): WorkoutInterval => {
  const ex = exercise(id);
  return { intervalIndex: 0, blockIndex: 0, stage: 'main', type: 'work', title: ex.name, description: ex.description, target: ex.target, duration, exercise: ex };
};

const rest = (duration = 30, extra: Partial<WorkoutInterval> = {}): WorkoutInterval => ({
  intervalIndex: 1, blockIndex: 0, stage: 'main', type: 'rest', title: 'Récupération', description: '', target: 'Récupération', duration, exercise: null, ...extra,
});

describe('speakable', () => {
  it('spells out units', () => {
    expect(speakable('1 s pour monter, 4 s pour descendre.')).toBe('1 seconde pour monter, 4 secondes pour descendre.');
    expect(speakable('Les deux genoux à 90°.')).toBe('Les deux genoux à 90 degrés.');
    expect(speakable('Poids de 8 kg, 30 cm')).toBe('Poids de 8 kilos, 30 centimètres');
  });
});

describe('intervalStartCue', () => {
  it('says go when work starts', () => {
    expect(intervalStartCue([work('squat_classic')], 0).say).toBe("C'est parti.");
  });

  it('announces the next exercise and its key cue during rest', () => {
    const cue = intervalStartCue([work('squat_classic'), rest(30), work('wall_sit')], 1);
    expect(cue.say).toBe('Ensuite : Chaise contre un mur. Cuisses parallèles au sol.');
  });

  it('keeps short breaks to the name', () => {
    const cue = intervalStartCue([work('squat_classic'), rest(10), work('wall_sit')], 1);
    expect(cue.say).toBe('Ensuite : Chaise contre un mur.');
  });

  it('announces the end of a round', () => {
    const cue = intervalStartCue([work('squat_classic'), rest(60, { isRoundTransition: true, roundTransitionFrom: 1, roundTransitionTo: 2 }), work('wall_sit')], 1);
    expect(cue.say).toMatch(/^Fin du tour 1\. Trente secondes de récupération en plus\. Ensuite : Chaise contre un mur\./);
  });

  it('announces a change of stage', () => {
    const warmupRest = rest(10, { stage: 'warmup' });
    const cue = intervalStartCue([work('squat_classic'), warmupRest, work('wall_sit')], 1);
    expect(cue.say).toBe('Place au circuit. Ensuite : Chaise contre un mur.');
  });
});

describe('tickCue', () => {
  it('counts down by voice before an exercise, with beeps as fallback', () => {
    expect(tickCue(rest(), 3)).toEqual({ say: 'Trois', fallbackBeep: expect.any(Object) });
    expect(tickCue(rest(), 1)?.say).toBe('Un');
  });

  it('beeps before the end of an exercise', () => {
    const cue = tickCue(work('squat_classic'), 2);
    expect(cue?.beep).toBeDefined();
    expect(cue?.say).toBeUndefined();
  });

  it('warns ten seconds before the end', () => {
    expect(tickCue(work('squat_classic', 30), 10)?.say).toBe('Encore dix secondes.');
    expect(tickCue(work('squat_classic', 20), 10)).toBeNull();
  });

  it('asks to change sides halfway through one-side exercises', () => {
    expect(tickCue(work('side_plank', 30), 15)?.say).toBe('Change de côté.');
    expect(tickCue(work('squat_classic', 30), 15)).toBeNull();
  });
});
