import { EXERCISE_DATABASE } from './exercises';
import { Exercise, WorkoutConfig, WorkoutInterval } from './types';
import { buildIntervals } from './workoutGenerator';
import { cooldownStretches, warmupMoves } from './sessionParts';

// Ready-made sessions: always the same exercises in the same order, so progress is easy to follow.

export type Objective = '10k' | 'semi' | 'marathon' | 'ultra';
export type Level = 'debutant' | 'intermediaire' | 'confirme';

export const OBJECTIVES: { id: Objective; label: string; hint: string }[] = [
  { id: '10k', label: '10 km', hint: 'Rebond et vivacité.' },
  { id: 'semi', label: 'Semi', hint: 'Rebond et endurance.' },
  { id: 'marathon', label: 'Marathon', hint: 'Tenir les derniers kilomètres.' },
  { id: 'ultra', label: '+50 km', hint: 'Encaisser les heures et le dénivelé.' },
];
export const LEVELS: { id: Level; label: string }[] = [
  { id: 'debutant', label: 'Débutant' },
  { id: 'intermediaire', label: 'Intermédiaire' },
  { id: 'confirme', label: 'Confirmé' },
];

export interface PresetSession {
  id: string;
  name: string;
  description: string;
  durationMinutes: number; // as announced; the tests check the real duration matches
  warmupMinutes: number;
  blocks: { exerciseIds: string[]; rounds: number }[];
  finisherIds: string[];
  cooldownMinutes: number;
  // Sessions for a race distance and a level; targeted sessions have neither.
  objective?: Objective;
  level?: Level;
}

// Shorthands for the sessions below.
const one = (exerciseIds: string[], rounds: number) => [{ exerciseIds, rounds }];
const two = (a: string[], b: string[]) => [{ exerciseIds: a, rounds: 3 }, { exerciseIds: b, rounds: 3 }];
const race = (objective: Objective, level: Level, rest: Omit<PresetSession, 'id' | 'name' | 'objective' | 'level' | 'warmupMinutes' | 'cooldownMinutes'> & Partial<PresetSession>): PresetSession => ({
  id: `${objective}-${level}`,
  name: `${OBJECTIVES.find(o => o.id === objective)!.label} · ${LEVELS.find(l => l.id === level)!.label}`,
  objective, level, warmupMinutes: 4, cooldownMinutes: 2, ...rest,
});

export const PRESET_SESSIONS: PresetSession[] = [
  // --- 10 km: bounce and quickness ---
  race('10k', 'debutant', {
    description: 'Rebond, mollets et gainage, sans matériel.', durationMinutes: 20,
    blocks: one(['pogo_jumps', 'squat_classic', 'calves_standing_slow', 'single_leg_bridge', 'side_plank', 'dead_bug'], 2),
    finisherIds: ['high_knees', 'jumping_jacks'],
  }),
  race('10k', 'intermediaire', {
    description: 'Poussée sur une jambe, rebond et gainage.', durationMinutes: 30,
    blocks: one(['pogo_jumps', 'step_up', 'calves_standing_slow', 'alternating_lunges', 'side_plank', 'single_leg_rdl', 'plank_commando'], 3),
    finisherIds: ['high_knees', 'jumping_jacks'],
  }),
  race('10k', 'confirme', {
    description: 'Puissance et réactivité : sauts, travail sur une jambe.', durationMinutes: 45, finisherIds: ['high_knees'],
    blocks: two(
      ['squat_jumps', 'bulgarian_split_squat', 'pogo_jumps', 'single_leg_rdl', 'plank_commando', 'calves_standing_slow'],
      ['lateral_hops', 'step_up', 'calf_raise_isometric_low', 'single_leg_bridge', 'side_plank', 'pushups'],
    ),
  }),
  // --- Half marathon: bounce and endurance ---
  race('semi', 'debutant', {
    description: 'Les bases : mollets, hanches et gainage, sans matériel.', durationMinutes: 20,
    blocks: one(['squat_classic', 'calves_standing_slow', 'single_leg_bridge', 'side_plank', 'lateral_lunges', 'dead_bug'], 2),
    finisherIds: ['jumping_jacks', 'high_knees'],
  }),
  race('semi', 'intermediaire', {
    description: 'Mollets, hanches, rebond et gainage.', durationMinutes: 30,
    blocks: one(['step_up', 'calves_standing_slow', 'side_lying_abduction', 'pogo_jumps', 'alternating_lunges', 'side_plank', 'bird_dog'], 3),
    finisherIds: ['high_knees', 'jumping_jacks'],
  }),
  race('semi', 'confirme', {
    description: 'Deux blocs complets, avec charge et sauts.', durationMinutes: 45, finisherIds: ['high_knees'],
    blocks: two(
      ['bulgarian_split_squat', 'pogo_jumps', 'single_leg_rdl', 'calves_seated', 'side_plank', 'dead_bug'],
      ['step_up', 'lateral_hops', 'copenhagen_plank', 'shift_squat_goblet', 'calf_raise_isometric_low', 'plank_commando'],
    ),
  }),
  // --- Marathon: hold on in the last kilometres ---
  race('marathon', 'debutant', {
    description: 'Mollets, hanches et gainage, sans matériel.', durationMinutes: 20,
    blocks: one(['calves_standing_slow', 'squat_sumo', 'single_leg_bridge', 'side_plank', 'calf_raise_isometric_low', 'dead_bug'], 2),
    finisherIds: ['high_knees', 'jumping_jacks'],
  }),
  {
    ...race('marathon', 'intermediaire', {
      description: 'Les zones qui lâchent en fin de course : mollets, adducteurs, fessiers, gainage.', durationMinutes: 30,
      blocks: one(['copenhagen_plank', 'calves_standing_slow', 'side_plank', 'single_leg_bridge', 'squat_sumo', 'marche_talons_inversion', 'dead_bug'], 3),
      finisherIds: ['high_knees', 'jumping_jacks'],
    }),
    id: 'special-marathon', // formerly "Spécial marathon": the id stays, for the history
  },
  {
    ...race('marathon', 'confirme', {
      description: 'Deux circuits, tous les groupes, avec charge.', durationMinutes: 45, finisherIds: ['high_knees'],
      blocks: two(
        ['copenhagen_plank', 'calves_seated', 'dead_bug', 'bulgarian_split_squat', 'side_lying_abduction', 'pushups'],
        ['shift_squat_goblet', 'calf_raise_isometric_low', 'side_plank', 'single_leg_rdl', 'lateral_lunges', 'woodchop'],
      ),
    }),
    id: 'complete', // formerly "Complète"
  },
  // --- Over 50 km: hours on the feet and elevation ---
  race('ultra', 'debutant', {
    description: 'Descentes, chevilles et gainage. Une marche d\'escalier suffit.', durationMinutes: 20,
    blocks: one(['step_down', 'single_leg_balance', 'squat_classic', 'calves_standing_slow', 'side_plank', 'bird_dog'], 2),
    finisherIds: ['wall_sit', 'high_knees'],
  }),
  race('ultra', 'intermediaire', {
    description: 'Descentes, montées et chevilles pour le dénivelé.', durationMinutes: 30,
    blocks: one(['step_down', 'step_up', 'single_leg_balance', 'tempo_squat', 'calves_standing_slow', 'reverse_lunges', 'side_plank'], 3),
    finisherIds: ['lateral_hops', 'wall_sit'],
  }),
  race('ultra', 'confirme', {
    description: 'Deux blocs pour encaisser les longues descentes et les heures.', durationMinutes: 45, finisherIds: ['wall_sit'],
    blocks: two(
      ['step_down', 'bulgarian_split_squat', 'lateral_hops', 'single_leg_rdl', 'calves_seated', 'side_plank'],
      ['tempo_squat', 'step_up', 'single_leg_balance', 'reverse_lunges', 'copenhagen_plank', 'plank_commando'],
    ),
  }),

  // --- Targeted sessions ---
  {
    id: 'mollets-express', name: 'Mollets express', description: 'Mollets, tibias et rebond, à glisser avant ou après une sortie.',
    durationMinutes: 15, warmupMinutes: 2, finisherIds: [], cooldownMinutes: 0,
    blocks: one(['calves_standing_slow', 'marche_talons_inversion', 'calf_raise_isometric_low', 'pogo_jumps'], 3),
  },
  {
    id: 'gainage', name: 'Gainage', description: 'Le tronc sous toutes ses faces : avant, côtés et bas du dos.',
    durationMinutes: 15, warmupMinutes: 2, finisherIds: [], cooldownMinutes: 0,
    blocks: one(['plank_commando', 'dead_bug', 'side_plank', 'bird_dog'], 3),
  },
  {
    id: 'hanches-solides', name: 'Hanches solides', description: 'Fessiers, adducteurs et gainage latéral pour stabiliser le bassin.',
    durationMinutes: 20, warmupMinutes: 2, finisherIds: ['high_knees'], cooldownMinutes: 1,
    blocks: one(['single_leg_bridge', 'side_lying_abduction', 'lateral_lunges', 'side_plank', 'squat_sumo'], 3),
  },
  {
    id: 'genoux-solides', name: 'Genoux solides', description: 'Prévention du genou du coureur : cuisses en descente et moyen fessier.',
    durationMinutes: 20, warmupMinutes: 2, finisherIds: [], cooldownMinutes: 2,
    blocks: one(['step_down', 'side_lying_abduction', 'tempo_squat', 'single_leg_bridge', 'side_plank'], 3),
  },
  {
    id: 'pieds-chevilles', name: 'Pieds et chevilles', description: 'Équilibre et réactivité contre les entorses et les terrains irréguliers.',
    durationMinutes: 15, warmupMinutes: 2, finisherIds: [], cooldownMinutes: 0,
    blocks: one(['single_leg_balance', 'marche_talons_inversion', 'calves_standing_slow', 'lateral_hops'], 3),
  },
  {
    id: 'tendons', name: 'Tendon d\'Achille', description: 'Mollets en descente lente et positions tenues, puis un peu de rebond.',
    durationMinutes: 15, warmupMinutes: 1, finisherIds: [], cooldownMinutes: 1,
    blocks: one(['calves_standing_slow', 'calf_raise_isometric_low', 'marche_talons_inversion', 'pogo_jumps'], 3),
  },
  {
    id: 'cotes', name: 'Côtes', description: 'Poussée et puissance pour les montées.',
    durationMinutes: 20, warmupMinutes: 2, finisherIds: [], cooldownMinutes: 2,
    blocks: one(['step_up', 'squat_jumps', 'alternating_lunges', 'calves_standing_slow', 'high_knees'], 3),
  },
  {
    id: 'descentes', name: 'Descentes', description: 'Les cuisses qui freinent : travail excentrique pour les descentes de trail.',
    durationMinutes: 20, warmupMinutes: 2, finisherIds: [], cooldownMinutes: 2,
    blocks: one(['step_down', 'tempo_squat', 'reverse_lunges', 'calves_standing_slow', 'wall_sit'], 3),
  },
  {
    id: 'dos-posture', name: 'Dos et posture', description: 'Pour un dos qui tient sur les sorties longues.',
    durationMinutes: 15, warmupMinutes: 2, finisherIds: [], cooldownMinutes: 0,
    blocks: one(['bird_dog', 'dead_bug', 'side_plank', 'pushups'], 3),
  },
  {
    id: 'activation', name: 'Activation avant sortie', description: '10 minutes juste avant de courir, pour réveiller les appuis sans se fatiguer.',
    durationMinutes: 10, warmupMinutes: 2, finisherIds: [], cooldownMinutes: 0,
    blocks: one(['single_leg_bridge', 'side_lying_abduction', 'pogo_jumps', 'high_knees'], 2),
  },
];

export const RACE_SESSIONS = PRESET_SESSIONS.filter(p => p.objective);
export const TARGETED_SESSIONS = PRESET_SESSIONS.filter(p => !p.objective);

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

export const presetUsesWeight = (preset: PresetSession) => presetEquipment(preset).includes('poids_8kg');

// Without a weight, each loaded exercise gives way to the first of these the session doesn't already have.
const WITHOUT_WEIGHT: Record<string, string[]> = {
  shift_squat_goblet: ['tempo_squat', 'squat_classic'],
  calves_seated: ['calves_standing_slow', 'calf_raise_isometric_low'],
  woodchop: ['bird_dog', 'dead_bug'],
};

export function presetWithoutWeight(preset: PresetSession): PresetSession {
  const used = new Set(presetExercises(preset).map(ex => ex.id));
  const swap = (id: string) => {
    const alternatives = WITHOUT_WEIGHT[id];
    if (!alternatives) return id;
    const replacement = alternatives.find(alt => !used.has(alt));
    if (!replacement) throw new Error(`No weight-free replacement left for ${id} in ${preset.id}`);
    used.add(replacement);
    return replacement;
  };
  return {
    ...preset,
    blocks: preset.blocks.map(block => ({ ...block, exerciseIds: block.exerciseIds.map(swap) })),
    finisherIds: preset.finisherIds.map(swap),
  };
}

export function buildPresetWorkout(preset: PresetSession, rythme: WorkoutConfig['rythme'], hasWeight = true): WorkoutInterval[] {
  if (!hasWeight) preset = presetWithoutWeight(preset);
  return buildIntervals(
    {
      warmup: warmupMoves(preset.warmupMinutes),
      blocks: preset.blocks.map(block => ({ exercises: block.exerciseIds.map(exerciseById), rounds: block.rounds })),
      finishers: preset.finisherIds.map(exerciseById),
      cooldown: cooldownStretches(preset.cooldownMinutes),
    },
    rythme,
  );
}
