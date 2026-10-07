import { Exercise } from '../types';
import { getBodyPart } from '../workoutGenerator';

export type BodyPart = ReturnType<typeof getBodyPart>;

export function bodyPartEmoji(part: BodyPart) {
  return part === 'bras' ? '💪' : part === 'abdos' ? '🧘' : '🦵';
}

// Intervals without an exercise (rest, transitions) default to legs.
export function exerciseBodyPart(exercise: Exercise | null): BodyPart {
  return exercise ? getBodyPart(exercise) : 'jambes';
}
