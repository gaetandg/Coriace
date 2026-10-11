// Formulas of the race sessions: three complete ones (A is the session as first written), then
// three that lean towards calves, core or cardio. Each formula keeps the shape of formula A
// (same blocks, rounds and finisher length, so the same duration) and the equipment of its level.

export type FormulaId = 'a' | 'b' | 'c' | 'mollets' | 'gainage' | 'cardio';

export const FORMULAS: { id: FormulaId; label: string; hint: string }[] = [
  { id: 'a', label: 'Complète A', hint: 'Tous les groupes, à parts égales.' },
  { id: 'b', label: 'Complète B', hint: 'Tous les groupes, à parts égales.' },
  { id: 'c', label: 'Complète C', hint: 'Tous les groupes, à parts égales.' },
  { id: 'mollets', label: 'Mollets', hint: 'Plus de mollets et de chevilles, pour les fins de course.' },
  { id: 'gainage', label: 'Gainage', hint: 'Tronc et hanches : la posture qui tient quand la fatigue arrive.' },
  { id: 'cardio', label: 'Cardio', hint: 'Plus de sauts, le cœur monte. À garder loin d\'une sortie difficile.' },
];

export const isFormulaId = (value: unknown): value is FormulaId => FORMULAS.some(f => f.id === value);

// The exercises of each block (rounds come from formula A), then the finisher.
export interface Variant {
  blocks: string[][];
  finisherIds: string[];
}
export type Variants = Record<Exclude<FormulaId, 'a'>, Variant>;

const v = (blocks: string[][], finisherIds: string[]): Variant => ({ blocks, finisherIds });

// Keyed by session id. Beginners: no equipment and few jumps; intermediate: a chair at most.
export const VARIANTS: Record<string, Variants> = {
  // --- 10 km ---
  '10k-debutant': {
    b: v([['jumping_jacks', 'reverse_lunges', 'calf_raise_isometric_low', 'side_lying_abduction', 'bird_dog', 'squat_sumo']], ['high_knees', 'pogo_jumps']),
    c: v([['high_knees', 'tempo_squat', 'marche_talons_inversion', 'single_leg_bridge', 'plank_commando', 'lateral_lunges']], ['jumping_jacks', 'pogo_jumps']),
    mollets: v([['calves_standing_slow', 'squat_classic', 'single_leg_balance', 'single_leg_bridge', 'calf_raise_isometric_low', 'side_plank']], ['pogo_jumps', 'high_knees']),
    gainage: v([['side_plank', 'squat_classic', 'dead_bug', 'single_leg_bridge', 'bird_dog', 'calves_standing_slow']], ['high_knees', 'jumping_jacks']),
    cardio: v([['pogo_jumps', 'squat_classic', 'jumping_jacks', 'calves_standing_slow', 'high_knees', 'side_plank']], ['jumping_jacks', 'high_knees']),
  },
  '10k-intermediaire': {
    b: v([['jumping_jacks', 'bulgarian_split_squat', 'calf_raise_isometric_low', 'single_leg_bridge', 'dead_bug', 'lateral_lunges', 'pogo_jumps']], ['high_knees', 'squat_jumps']),
    c: v([['pogo_jumps', 'reverse_lunges', 'marche_talons_inversion', 'hamstring_bridge_chair', 'bird_dog', 'squat_sumo', 'lateral_hops']], ['jumping_jacks', 'high_knees']),
    mollets: v([['calves_standing_slow', 'step_up', 'single_leg_balance', 'single_leg_rdl', 'calf_raise_isometric_low', 'side_plank', 'pogo_jumps']], ['lateral_hops', 'high_knees']),
    gainage: v([['plank_commando', 'step_up', 'side_plank', 'single_leg_bridge', 'dead_bug', 'calves_standing_slow', 'bird_dog']], ['high_knees', 'jumping_jacks']),
    cardio: v([['pogo_jumps', 'step_up', 'jumping_jacks', 'calves_standing_slow', 'squat_jumps', 'side_plank', 'high_knees']], ['lateral_hops', 'jumping_jacks']),
  },
  '10k-confirme': {
    b: v([
      ['pogo_jumps', 'reverse_lunges', 'calves_seated', 'hamstring_bridge_chair', 'dead_bug', 'shift_squat_goblet'],
      ['jumping_jacks', 'step_up', 'marche_talons_inversion', 'single_leg_rdl', 'bird_dog', 'lateral_lunges'],
    ], ['high_knees']),
    c: v([
      ['lateral_hops', 'tempo_squat', 'squat_jumps', 'side_lying_abduction', 'side_plank', 'copenhagen_plank'],
      ['high_knees', 'bulgarian_split_squat', 'single_leg_balance', 'single_leg_bridge', 'woodchop', 'pushups'],
    ], ['jumping_jacks']),
    mollets: v([
      ['calves_standing_slow', 'bulgarian_split_squat', 'pogo_jumps', 'single_leg_rdl', 'calves_seated', 'side_plank'],
      ['lateral_hops', 'step_up', 'single_leg_balance', 'single_leg_bridge', 'calf_raise_isometric_low', 'dead_bug'],
    ], ['high_knees']),
    gainage: v([
      ['plank_commando', 'bulgarian_split_squat', 'side_plank', 'single_leg_rdl', 'dead_bug', 'calves_standing_slow'],
      ['bird_dog', 'step_up', 'woodchop', 'single_leg_bridge', 'pushups', 'calf_raise_isometric_low'],
    ], ['high_knees']),
    cardio: v([
      ['squat_jumps', 'bulgarian_split_squat', 'pogo_jumps', 'single_leg_rdl', 'jumping_jacks', 'calves_standing_slow'],
      ['lateral_hops', 'alternating_lunges', 'high_knees', 'single_leg_bridge', 'squat_jumps', 'side_plank'],
    ], ['jumping_jacks']),
  },
  // --- Half marathon ---
  'semi-debutant': {
    b: v([['reverse_lunges', 'calf_raise_isometric_low', 'side_lying_abduction', 'bird_dog', 'squat_sumo', 'plank_commando']], ['high_knees', 'jumping_jacks']),
    c: v([['tempo_squat', 'marche_talons_inversion', 'single_leg_bridge', 'dead_bug', 'lateral_lunges', 'calves_standing_slow']], ['jumping_jacks', 'pogo_jumps']),
    mollets: v([['calves_standing_slow', 'squat_classic', 'single_leg_balance', 'single_leg_bridge', 'calf_raise_isometric_low', 'side_plank']], ['pogo_jumps', 'high_knees']),
    gainage: v([['plank_commando', 'squat_sumo', 'side_plank', 'single_leg_bridge', 'dead_bug', 'calves_standing_slow']], ['jumping_jacks', 'high_knees']),
    cardio: v([['jumping_jacks', 'squat_classic', 'pogo_jumps', 'calves_standing_slow', 'high_knees', 'side_plank']], ['jumping_jacks', 'high_knees']),
  },
  'semi-intermediaire': {
    b: v([['reverse_lunges', 'calf_raise_isometric_low', 'single_leg_bridge', 'jumping_jacks', 'bulgarian_split_squat', 'dead_bug', 'lateral_lunges']], ['high_knees', 'pogo_jumps']),
    c: v([['tempo_squat', 'marche_talons_inversion', 'hamstring_bridge_chair', 'pogo_jumps', 'squat_sumo', 'plank_commando', 'single_leg_balance']], ['jumping_jacks', 'high_knees']),
    mollets: v([['calves_standing_slow', 'step_up', 'single_leg_balance', 'side_lying_abduction', 'calf_raise_isometric_low', 'side_plank', 'pogo_jumps']], ['lateral_hops', 'high_knees']),
    gainage: v([['side_plank', 'step_up', 'dead_bug', 'side_lying_abduction', 'plank_commando', 'calves_standing_slow', 'bird_dog']], ['high_knees', 'jumping_jacks']),
    cardio: v([['pogo_jumps', 'step_up', 'jumping_jacks', 'calves_standing_slow', 'high_knees', 'alternating_lunges', 'side_plank']], ['squat_jumps', 'lateral_hops']),
  },
  'semi-confirme': {
    b: v([
      ['reverse_lunges', 'jumping_jacks', 'hamstring_bridge_chair', 'calves_standing_slow', 'bird_dog', 'squat_sumo'],
      ['step_down', 'pogo_jumps', 'single_leg_rdl', 'calves_seated', 'side_plank', 'lateral_lunges'],
    ], ['high_knees']),
    c: v([
      ['tempo_squat', 'lateral_hops', 'side_lying_abduction', 'marche_talons_inversion', 'plank_commando', 'copenhagen_plank'],
      ['bulgarian_split_squat', 'squat_jumps', 'single_leg_bridge', 'calf_raise_isometric_low', 'woodchop', 'shift_squat_goblet'],
    ], ['jumping_jacks']),
    mollets: v([
      ['calves_standing_slow', 'bulgarian_split_squat', 'pogo_jumps', 'single_leg_rdl', 'calves_seated', 'side_plank'],
      ['lateral_hops', 'step_up', 'single_leg_balance', 'copenhagen_plank', 'calf_raise_isometric_low', 'dead_bug'],
    ], ['high_knees']),
    gainage: v([
      ['side_plank', 'bulgarian_split_squat', 'dead_bug', 'single_leg_rdl', 'plank_commando', 'calves_seated'],
      ['bird_dog', 'step_up', 'woodchop', 'copenhagen_plank', 'calf_raise_isometric_low', 'pushups'],
    ], ['high_knees']),
    cardio: v([
      ['pogo_jumps', 'bulgarian_split_squat', 'jumping_jacks', 'single_leg_rdl', 'squat_jumps', 'calves_standing_slow'],
      ['lateral_hops', 'step_up', 'high_knees', 'shift_squat_goblet', 'alternating_lunges', 'side_plank'],
    ], ['jumping_jacks']),
  },
  // --- Marathon ---
  'marathon-debutant': {
    b: v([['marche_talons_inversion', 'lateral_lunges', 'side_lying_abduction', 'bird_dog', 'calves_standing_slow', 'plank_commando']], ['jumping_jacks', 'high_knees']),
    c: v([['calf_raise_isometric_low', 'squat_classic', 'single_leg_bridge', 'dead_bug', 'squat_sumo', 'single_leg_balance']], ['high_knees', 'jumping_jacks']),
    mollets: v([['calves_standing_slow', 'squat_sumo', 'single_leg_balance', 'single_leg_bridge', 'calf_raise_isometric_low', 'side_plank']], ['pogo_jumps', 'high_knees']),
    gainage: v([['side_plank', 'squat_sumo', 'dead_bug', 'single_leg_bridge', 'bird_dog', 'calves_standing_slow']], ['high_knees', 'jumping_jacks']),
    cardio: v([['jumping_jacks', 'squat_sumo', 'high_knees', 'calves_standing_slow', 'pogo_jumps', 'side_plank']], ['jumping_jacks', 'high_knees']),
  },
  'special-marathon': {
    b: v([['lateral_lunges', 'calf_raise_isometric_low', 'plank_commando', 'hamstring_bridge_chair', 'squat_sumo', 'single_leg_balance', 'bird_dog']], ['jumping_jacks', 'high_knees']),
    c: v([['squat_sumo', 'calves_standing_slow', 'dead_bug', 'side_lying_abduction', 'step_up', 'marche_talons_inversion', 'side_plank']], ['high_knees', 'pogo_jumps']),
    mollets: v([['calves_standing_slow', 'copenhagen_plank', 'single_leg_balance', 'single_leg_bridge', 'calf_raise_isometric_low', 'side_plank', 'marche_talons_inversion']], ['pogo_jumps', 'high_knees']),
    gainage: v([['side_plank', 'copenhagen_plank', 'dead_bug', 'single_leg_bridge', 'plank_commando', 'calves_standing_slow', 'bird_dog']], ['high_knees', 'jumping_jacks']),
    cardio: v([['pogo_jumps', 'copenhagen_plank', 'jumping_jacks', 'single_leg_bridge', 'high_knees', 'calves_standing_slow', 'side_plank']], ['squat_jumps', 'lateral_hops']),
  },
  complete: {
    b: v([
      ['squat_sumo', 'calves_standing_slow', 'plank_commando', 'step_up', 'single_leg_bridge', 'bird_dog'],
      ['copenhagen_plank', 'marche_talons_inversion', 'side_plank', 'reverse_lunges', 'hamstring_bridge_chair', 'pushups'],
    ], ['jumping_jacks']),
    c: v([
      ['shift_squat_goblet', 'single_leg_balance', 'dead_bug', 'tempo_squat', 'side_lying_abduction', 'woodchop'],
      ['lateral_lunges', 'calves_seated', 'side_plank', 'bulgarian_split_squat', 'single_leg_rdl', 'plank_commando'],
    ], ['high_knees']),
    mollets: v([
      ['calves_standing_slow', 'copenhagen_plank', 'single_leg_balance', 'bulgarian_split_squat', 'calves_seated', 'side_plank'],
      ['pogo_jumps', 'single_leg_rdl', 'marche_talons_inversion', 'tempo_squat', 'calf_raise_isometric_low', 'dead_bug'],
    ], ['lateral_hops']),
    gainage: v([
      ['side_plank', 'single_leg_bridge', 'dead_bug', 'copenhagen_plank', 'plank_commando', 'calves_standing_slow'],
      ['bird_dog', 'side_lying_abduction', 'woodchop', 'squat_sumo', 'calf_raise_isometric_low', 'hamstring_bridge_chair'],
    ], ['high_knees']),
    cardio: v([
      ['pogo_jumps', 'bulgarian_split_squat', 'jumping_jacks', 'copenhagen_plank', 'squat_jumps', 'side_plank'],
      ['lateral_hops', 'single_leg_rdl', 'step_up', 'shift_squat_goblet', 'alternating_lunges', 'dead_bug'],
    ], ['high_knees']),
  },
  // --- Over 50 km ---
  'ultra-debutant': {
    b: v([['tempo_squat', 'marche_talons_inversion', 'single_leg_bridge', 'reverse_lunges', 'calves_standing_slow', 'dead_bug']], ['wall_sit', 'jumping_jacks']),
    c: v([['step_down', 'calf_raise_isometric_low', 'side_lying_abduction', 'squat_sumo', 'single_leg_balance', 'plank_commando']], ['high_knees', 'wall_sit']),
    mollets: v([['single_leg_balance', 'step_down', 'calves_standing_slow', 'single_leg_bridge', 'marche_talons_inversion', 'side_plank']], ['wall_sit', 'high_knees']),
    gainage: v([['side_plank', 'step_down', 'bird_dog', 'single_leg_bridge', 'dead_bug', 'calves_standing_slow']], ['wall_sit', 'high_knees']),
    cardio: v([['jumping_jacks', 'step_down', 'high_knees', 'calves_standing_slow', 'pogo_jumps', 'side_plank']], ['wall_sit', 'jumping_jacks']),
  },
  'ultra-intermediaire': {
    b: v([['tempo_squat', 'marche_talons_inversion', 'single_leg_bridge', 'step_down', 'calf_raise_isometric_low', 'dead_bug', 'lateral_lunges']], ['wall_sit', 'high_knees']),
    c: v([['reverse_lunges', 'single_leg_balance', 'hamstring_bridge_chair', 'step_up', 'calves_standing_slow', 'plank_commando', 'squat_sumo']], ['lateral_hops', 'wall_sit']),
    mollets: v([['single_leg_balance', 'step_down', 'calves_standing_slow', 'single_leg_rdl', 'marche_talons_inversion', 'side_plank', 'calf_raise_isometric_low']], ['lateral_hops', 'wall_sit']),
    gainage: v([['side_plank', 'step_down', 'bird_dog', 'single_leg_bridge', 'dead_bug', 'calves_standing_slow', 'plank_commando']], ['wall_sit', 'high_knees']),
    cardio: v([['pogo_jumps', 'step_down', 'jumping_jacks', 'single_leg_balance', 'high_knees', 'tempo_squat', 'side_plank']], ['lateral_hops', 'squat_jumps']),
  },
  'ultra-confirme': {
    b: v([
      ['tempo_squat', 'marche_talons_inversion', 'hamstring_bridge_chair', 'step_down', 'calves_standing_slow', 'dead_bug'],
      ['reverse_lunges', 'single_leg_balance', 'single_leg_rdl', 'bulgarian_split_squat', 'calf_raise_isometric_low', 'bird_dog'],
    ], ['wall_sit']),
    c: v([
      ['step_down', 'calf_raise_isometric_low', 'side_lying_abduction', 'shift_squat_goblet', 'lateral_hops', 'woodchop'],
      ['step_up', 'calves_seated', 'single_leg_bridge', 'tempo_squat', 'lateral_lunges', 'side_plank'],
    ], ['wall_sit']),
    mollets: v([
      ['single_leg_balance', 'step_down', 'calves_seated', 'single_leg_rdl', 'lateral_hops', 'side_plank'],
      ['calves_standing_slow', 'tempo_squat', 'marche_talons_inversion', 'reverse_lunges', 'calf_raise_isometric_low', 'dead_bug'],
    ], ['wall_sit']),
    gainage: v([
      ['side_plank', 'step_down', 'dead_bug', 'single_leg_rdl', 'plank_commando', 'calves_seated'],
      ['bird_dog', 'tempo_squat', 'woodchop', 'copenhagen_plank', 'single_leg_balance', 'hamstring_bridge_chair'],
    ], ['wall_sit']),
    cardio: v([
      ['pogo_jumps', 'step_down', 'lateral_hops', 'single_leg_rdl', 'squat_jumps', 'calves_standing_slow'],
      ['high_knees', 'step_up', 'jumping_jacks', 'reverse_lunges', 'single_leg_balance', 'side_plank'],
    ], ['wall_sit']),
  },
};
