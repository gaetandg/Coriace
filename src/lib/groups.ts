import { ExerciseGroup } from '../types';

// Display order and labels of the exercise groups.
export const EXERCISE_GROUPS: { id: ExerciseGroup; label: string }[] = [
  { id: 'mollets', label: 'Mollets et chevilles' },
  { id: 'adducteurs', label: 'Adducteurs' },
  { id: 'fessiers', label: 'Fessiers et ischios' },
  { id: 'cuisses', label: 'Cuisses' },
  { id: 'gainage', label: 'Gainage' },
  { id: 'haut_du_corps', label: 'Haut du corps' },
  { id: 'cardio', label: 'Cardio' },
];
