import { WorkoutInterval } from '../types';

// What the app says and beeps during a session. Pure functions so the timing rules stay testable.

export interface Beep {
  frequency: number;
  duration: number;
}

export interface Cue {
  say?: string;
  beep?: Beep;
  // Played instead of `say` when the voice is off or unavailable.
  fallbackBeep?: Beep;
}

const SHORT: Beep = { frequency: 880, duration: 0.15 };
const START: Beep = { frequency: 1320, duration: 0.5 };
const END: Beep = { frequency: 990, duration: 0.5 };
const SIDE: Beep = { frequency: 1100, duration: 0.25 };
const DONE: Beep = { frequency: 1500, duration: 0.8 };

const COUNTDOWN = ['Un', 'Deux', 'Trois'];

const exerciseName = (interval: WorkoutInterval) => interval.title.replace('Échauffement : ', '');

// Written units read badly aloud: "2 s" becomes "2 secondes", "90°" becomes "90 degrés".
export function speakable(text: string) {
  return text
    .replace(/(\d+) s\b/g, (_, n) => `${n} ${n === '1' ? 'seconde' : 'secondes'}`)
    .replace(/(\d+) ?°/g, '$1 degrés')
    .replace(/(\d+) kg\b/g, '$1 kilos')
    .replace(/(\d+) cm\b/g, '$1 centimètres');
}

// Exercises done one side then the other say so in their description.
const changesSides = (interval: WorkoutInterval) => !!interval.exercise && /à mi-temps/.test(interval.exercise.description);

const nextWork = (intervals: WorkoutInterval[], index: number) =>
  intervals.slice(index + 1).find(interval => interval.type === 'work');

export function sessionStartCue(intervals: WorkoutInterval[]): Cue {
  const first = intervals[0];
  return { beep: START, say: first ? `Échauffement. ${exerciseName(first)}. C'est parti.` : "C'est parti." };
}

export function sessionEndCue(): Cue {
  return { beep: DONE, say: 'Séance terminée. Bien joué.' };
}

// Played when an interval begins: "go" for work, the next exercise for rest.
export function intervalStartCue(intervals: WorkoutInterval[], index: number): Cue {
  const interval = intervals[index];
  if (interval.type === 'work') {
    return { beep: START, say: "C'est parti." };
  }

  const parts: string[] = [];
  if (interval.isRoundTransition && interval.roundTransitionFrom) {
    parts.push(`Fin du tour ${interval.roundTransitionFrom}. Trente secondes de récupération en plus.`);
  } else if (interval.isBlockTransition) {
    parts.push('Fin du bloc A. Trente secondes de récupération en plus.');
  }

  const next = nextWork(intervals, index);
  if (next) {
    if (next.stage !== interval.stage) {
      parts.push(next.stage === 'main' ? 'Place au circuit.' : 'Place au finisher.');
    }
    parts.push(`Ensuite : ${speakable(exerciseName(next))}.`);
    // Short warm-up breaks only leave time for the name.
    if (interval.duration >= 20 && next.exercise) {
      parts.push(speakable(next.exercise.instructionHighlight));
    }
  }

  return { beep: END, say: parts.join(' ') };
}

// Played as the countdown passes `secondsRemaining` (1 or more) during an interval.
export function tickCue(interval: WorkoutInterval, secondsRemaining: number): Cue | null {
  if (secondsRemaining >= 1 && secondsRemaining <= 3) {
    // Before an exercise starts the voice counts down; before it ends, short beeps.
    return interval.type === 'rest'
      ? { say: COUNTDOWN[secondsRemaining - 1], fallbackBeep: SHORT }
      : { beep: SHORT };
  }
  if (interval.type !== 'work') return null;
  if (changesSides(interval) && secondsRemaining === Math.floor(interval.duration / 2)) {
    return { say: 'Change de côté.', fallbackBeep: SIDE };
  }
  if (interval.duration >= 30 && secondsRemaining === 10) {
    return { say: 'Encore dix secondes.' };
  }
  return null;
}
