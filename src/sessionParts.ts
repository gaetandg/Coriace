import { Exercise } from './types';

// Warm-up moves and cool-down stretches. They are not in the exercise list (never in a circuit).

const move = (m: Omit<Exercise, 'equipmentRequired' | 'category' | 'group'>): Exercise => ({ equipmentRequired: [], category: 'general', group: 'cardio', ...m });

// In session order, from gentle to lively. `priority` decides which ones a short warm-up keeps.
const WARMUP: { priority: number; exercise: Exercise }[] = [
  { priority: 1, exercise: move({
    id: 'warmup_mobility', name: 'Mobilité chevilles et hanches', target: 'Chevilles et hanches',
    description: 'Mains sur les hanches, fais de grands cercles avec le bassin, dans un sens puis dans l\'autre. Finis par quelques cercles de chaque cheville, pointe du pied au sol.',
    tips: 'Va doucement : le but est de réveiller les articulations.', instructionHighlight: 'Grands cercles, sans forcer.',
  }) },
  { priority: 6, exercise: move({
    id: 'warmup_leg_swings', name: 'Balancements de jambe', target: 'Hanches et ischios',
    description: 'Une main au mur, balance une jambe d\'avant en arrière, de plus en plus haut, sans forcer. Change de jambe à mi-temps.',
    tips: 'Le buste reste droit, c\'est la hanche qui bouge.', instructionHighlight: 'Amplitude progressive.',
  }) },
  { priority: 2, exercise: move({
    id: 'warmup_squat', name: 'Squats légers', target: 'Fessiers et quadriceps',
    description: 'Pieds largeur d\'épaules. Descends à mi-hauteur et remonte, sans forcer.',
    tips: 'Garde un rythme fluide.', instructionHighlight: 'À mi-hauteur, sans forcer.',
  }) },
  { priority: 4, exercise: move({
    id: 'warmup_lateral', name: 'Fentes latérales lentes', target: 'Adducteurs',
    description: 'Pieds très écartés. Bascule le poids du corps d\'une jambe sur l\'autre en fente latérale légère.',
    tips: 'Tu dois sentir un léger étirement à l\'intérieur de la cuisse tendue.', instructionHighlight: 'Lentement, d\'un côté à l\'autre.',
  }) },
  { priority: 7, exercise: move({
    id: 'warmup_lunge', name: 'Fentes avant lentes', target: 'Quadriceps et hanches',
    description: 'Un grand pas en avant, descends à mi-hauteur, reviens. Alterne les jambes.',
    tips: 'Buste droit, genou avant au-dessus du pied.', instructionHighlight: 'À mi-hauteur, buste droit.',
  }) },
  { priority: 3, exercise: move({
    id: 'warmup_calves', name: 'Pointes de pieds et sautillements', target: 'Mollets et tendon d\'Achille',
    description: 'Monte et descends sur la pointe des pieds une dizaine de fois, puis enchaîne de petits sautillements souples sur place.',
    tips: 'Prépare les mollets et le tendon d\'Achille avant les sauts et la corde.', instructionHighlight: 'Petits rebonds souples.',
  }) },
  { priority: 5, exercise: move({
    id: 'warmup_knees', name: 'Montées de genoux légères', target: 'Cardio',
    description: 'Cours sur place en montant les genoux, sans chercher la vitesse.',
    tips: 'Le cœur monte doucement : tu es prêt pour le circuit.', instructionHighlight: 'Souple, sans forcer.',
  }) },
];

// The `minutes` most useful moves, kept in their order.
export function warmupMoves(minutes: number): Exercise[] {
  const kept = new Set([...WARMUP].sort((a, b) => a.priority - b.priority).slice(0, minutes).map(w => w.exercise.id));
  return WARMUP.filter(w => kept.has(w.exercise.id)).map(w => w.exercise);
}
export const MAX_WARMUP_MINUTES = WARMUP.length;

const COOLDOWN: Exercise[] = [
  move({
    id: 'cooldown_calves', name: 'Étirement des mollets', target: 'Mollets',
    description: 'Mains contre le mur, une jambe tendue loin derrière, talon au sol. Penche-toi vers le mur jusqu\'à sentir l\'étirement. Change de jambe à mi-temps.',
    tips: 'Respire lentement, sans à-coups.', instructionHighlight: 'Talon au sol, respire.',
  }),
  move({
    id: 'cooldown_hip_flexors', name: 'Étirement des fléchisseurs de hanche', target: 'Avant de la hanche',
    description: 'En fente, genou arrière posé au sol. Avance doucement le bassin, buste droit. Change de jambe à mi-temps.',
    tips: 'Serre légèrement le fessier de la jambe arrière pour mieux sentir l\'étirement.', instructionHighlight: 'Bassin en avant, buste droit.',
  }),
  move({
    id: 'cooldown_adductors', name: 'Étirement des adducteurs', target: 'Adducteurs',
    description: 'Pieds très écartés, plie une jambe et descends sur le côté, l\'autre jambe tendue. Tiens la position et change de côté à mi-temps.',
    tips: 'Le pied de la jambe tendue reste à plat.', instructionHighlight: 'Jambe tendue, respire.',
  }),
];

// The first `minutes` stretches: calves first, they work the most in running.
export const cooldownStretches = (minutes: number): Exercise[] => COOLDOWN.slice(0, minutes);
