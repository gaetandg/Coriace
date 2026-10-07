import { EXERCISE_DATABASE } from './exercises';
import { Exercise, WorkoutConfig, WorkoutInterval } from './types';
import { buildIntervals } from './workoutGenerator';

// Ready-made sessions: always the same exercises in the same order, so progress is easy to follow.

export interface PresetSession {
  id: string;
  name: string;
  description: string;
  durationMinutes: number; // as announced; the tests check the real duration matches
  warmupMinutes: number;
  blocks: { exerciseIds: string[]; rounds: number }[];
  finisherIds: string[];
}

export const PRESET_SESSIONS: PresetSession[] = [
  {
    id: 'mollets-express',
    name: 'Mollets express',
    description: 'Mollets, tibias et rebond, à glisser avant ou après une sortie.',
    durationMinutes: 15,
    warmupMinutes: 2,
    blocks: [{ exerciseIds: ['calves_standing_slow', 'marche_talons_inversion', 'calf_raise_isometric_low', 'pogo_jumps'], rounds: 3 }],
    finisherIds: [],
  },
  {
    id: 'gainage',
    name: 'Gainage',
    description: 'Le tronc sous toutes ses faces : avant, côtés et bas du dos.',
    durationMinutes: 15,
    warmupMinutes: 2,
    blocks: [{ exerciseIds: ['plank_commando', 'dead_bug', 'side_plank', 'bird_dog'], rounds: 3 }],
    finisherIds: [],
  },
  {
    id: 'hanches-solides',
    name: 'Hanches solides',
    description: 'Fessiers, adducteurs et gainage latéral pour stabiliser le bassin.',
    durationMinutes: 20,
    warmupMinutes: 3,
    blocks: [{ exerciseIds: ['single_leg_bridge', 'side_lying_abduction', 'lateral_lunges', 'side_plank', 'squat_sumo'], rounds: 3 }],
    finisherIds: ['wall_sit'],
  },
  {
    id: 'sans-materiel',
    name: 'Sans matériel',
    description: 'Une séance complète à faire n\'importe où.',
    durationMinutes: 20,
    warmupMinutes: 3,
    blocks: [{ exerciseIds: ['squat_classic', 'calves_standing_slow', 'side_plank', 'alternating_lunges', 'single_leg_bridge'], rounds: 3 }],
    finisherIds: ['high_knees'],
  },
  {
    id: 'special-marathon',
    name: 'Spécial marathon',
    description: 'Les zones qui lâchent en fin de course : mollets, adducteurs, fessiers, gainage.',
    durationMinutes: 30,
    warmupMinutes: 5,
    blocks: [{
      exerciseIds: ['copenhagen_plank', 'calves_standing_slow', 'side_plank', 'single_leg_bridge', 'squat_sumo', 'marche_talons_inversion', 'dead_bug'],
      rounds: 3,
    }],
    finisherIds: ['high_knees', 'wall_sit', 'plank_commando'],
  },
  {
    id: 'complete',
    name: 'Complète',
    description: 'Deux circuits, tous les groupes. Pour une grosse séance de renfo.',
    durationMinutes: 45,
    warmupMinutes: 5,
    blocks: [
      { exerciseIds: ['copenhagen_plank', 'calves_seated', 'dead_bug', 'bulgarian_split_squat', 'side_lying_abduction', 'pushups'], rounds: 3 },
      { exerciseIds: ['shift_squat_goblet', 'calf_raise_isometric_low', 'side_plank', 'single_leg_rdl', 'lateral_lunges', 'woodchop'], rounds: 3 },
    ],
    finisherIds: ['high_knees', 'wall_sit'],
  },
];

const exerciseById = (id: string): Exercise => {
  const exercise = EXERCISE_DATABASE.find(ex => ex.id === id);
  if (!exercise) throw new Error(`Unknown exercise in preset session: ${id}`);
  return exercise;
};

export function presetExercises(preset: PresetSession): Exercise[] {
  const ids = [...preset.blocks.flatMap(block => block.exerciseIds), ...preset.finisherIds];
  return [...new Set(ids)].map(exerciseById);
}

// Equipment the session needs, in display order.
export function presetEquipment(preset: PresetSession): Exercise['equipmentRequired'] {
  const needed = new Set(presetExercises(preset).flatMap(ex => ex.equipmentRequired));
  return (['chaise', 'poids_8kg', 'corde_a_sauter'] as const).filter(eq => needed.has(eq));
}

export function buildPresetWorkout(preset: PresetSession, rythme: WorkoutConfig['rythme']): WorkoutInterval[] {
  return buildIntervals(
    {
      warmupMinutes: preset.warmupMinutes,
      blocks: preset.blocks.map(block => ({ exercises: block.exerciseIds.map(exerciseById), rounds: block.rounds })),
      finishers: preset.finisherIds.map(exerciseById),
    },
    rythme,
  );
}
