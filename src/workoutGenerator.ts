import { EXERCISE_DATABASE } from './exercises';
import { WorkoutConfig, WorkoutInterval, Exercise, ExerciseGroup, WorkoutStage } from './types';

// Let's define the fixed warm-up exercises (using no equipment, to keep it universal)
const WARM_UP_EXERCISES: Omit<Exercise, 'id'>[] = [
  {
    name: 'Mobilisation articulaire',
    target: 'Chevilles, genoux, hanches',
    description: 'Fais des cercles avec les chevilles, les genoux puis les hanches. Termine en enroulant doucement le dos.',
    equipmentRequired: [],
    category: 'general',
    group: 'cardio',
    tips: 'Va doucement : le but est de te réchauffer, pas de te fatiguer.',
    instructionHighlight: 'Mouvements amples et lents.'
  },
  {
    name: 'Squats légers',
    target: 'Fessiers et quadriceps',
    description: 'Pieds largeur d\'épaules. Descends à mi-hauteur et remonte, sans forcer.',
    equipmentRequired: [],
    category: 'general',
    group: 'cuisses',
    tips: 'Sans poids. Garde un rythme fluide.',
    instructionHighlight: 'Dos droit, regard devant.'
  },
  {
    name: 'Mobilisation des adducteurs',
    target: 'Adducteurs',
    description: 'Pieds très écartés. Bascule le poids du corps d\'une jambe sur l\'autre en fente latérale légère.',
    equipmentRequired: [],
    category: 'specific_adductor',
    group: 'adducteurs',
    tips: 'Tu dois sentir un léger étirement à l\'intérieur de la cuisse tendue.',
    instructionHighlight: 'Talons au sol.'
  },
  {
    name: 'Planche',
    target: 'Abdominaux',
    description: 'En planche sur les avant-bras, ou sur les genoux. Rentre le ventre et respire normalement.',
    equipmentRequired: [],
    category: 'abdos',
    group: 'gainage',
    tips: 'Serre les abdos et les fessiers.',
    instructionHighlight: 'Dos plat, fesses alignées.'
  },
  {
    name: 'Jumping jacks légers',
    target: 'Cardio et mollets',
    description: 'Petits jumping jacks, réceptions souples sur l\'avant du pied.',
    equipmentRequired: [],
    category: 'general',
    group: 'cardio',
    tips: 'Augmente le rythme petit à petit.',
    instructionHighlight: 'Réceptions légères.'
  }
];

/**
 * Shuffles an array randomly.
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateWorkout(config: WorkoutConfig): WorkoutInterval[] {
  const { equipment, rythme } = config;
  const T = config.durationMinutes || 30; // Chosen total duration in minutes

  // 1. Filter database based on selected exercise IDs (if list is provided) and equipment.
  const isSelectedAndAvailable = (ex: Exercise) => {
    // If selectedExerciseIds is present, check if exercise is selected by user
    if (config.selectedExerciseIds && !config.selectedExerciseIds.includes(ex.id)) {
      return false;
    }
    // Check if equipment is available
    return ex.equipmentRequired.every(eq => {
      if (eq === 'chaise') return equipment.chaise;
      if (eq === 'poids_8kg') return equipment.poids_8kg;
      if (eq === 'corde_a_sauter') return equipment.corde_a_sauter;
      return true;
    });
  };

  let availableWorkoutExercises = EXERCISE_DATABASE.filter(isSelectedAndAvailable);

  // Fallback: If no exercise matches, don't let it crash! Reset to eligible ones
  if (availableWorkoutExercises.length === 0) {
    const isAvailableOnly = (ex: Exercise) => {
      return ex.equipmentRequired.every(eq => {
        if (eq === 'chaise') return equipment.chaise;
        if (eq === 'poids_8kg') return equipment.poids_8kg;
        if (eq === 'corde_a_sauter') return equipment.corde_a_sauter;
        return true;
      });
    };
    availableWorkoutExercises = EXERCISE_DATABASE.filter(isAvailableOnly);
  }

  // Fallback: If still empty, use all exercises or a basic safe subset
  if (availableWorkoutExercises.length === 0) {
    availableWorkoutExercises = EXERCISE_DATABASE;
  }

  // One shuffled pool per group, so each draw gives a new order
  const pools = new Map<ExerciseGroup, Exercise[]>();
  for (const ex of shuffle(availableWorkoutExercises)) {
    pools.set(ex.group, [...(pools.get(ex.group) ?? []), ex]);
  }

  // Dynamic distribution of blocks (minutes)
  let warmupMinutes = 5;
  let finisherMinutes = 3;
  if (T < 20) {
    warmupMinutes = 3;
    finisherMinutes = 2;
  } else if (T < 26) {
    warmupMinutes = 4;
    finisherMinutes = 2;
  } else if (T < 35) {
    warmupMinutes = 5;
    finisherMinutes = 3;
  } else if (T < 45) {
    warmupMinutes = 6;
    finisherMinutes = 4;
  } else {
    warmupMinutes = 7;
    finisherMinutes = 5;
  }
  let mainMinutes = T - warmupMinutes - finisherMinutes;
  const numBlocksOpt = config.numBlocks || 1;

  let block1Minutes = 0;
  let block2Minutes = 0;
  let circuitLength = 0;
  let numRounds = 0;
  let circuitLength1 = 0;
  let numRounds1 = 0;
  let circuitLength2 = 0;
  let numRounds2 = 0;

  if (numBlocksOpt === 2) {
    const half = Math.floor(mainMinutes / 2);
    let foundExact = false;
    for (let b1 = Math.max(8, half - 3); b1 <= half + 3; b1++) {
      const b2 = mainMinutes - b1;
      const config1 = findBestCircuitConfig(b1);
      const config2 = findBestCircuitConfig(b2);
      
      const exact1 = config1.circuitLength * config1.numRounds === b1;
      const exact2 = config2.circuitLength * config2.numRounds === b2;
      
      if (exact1 && exact2) {
        block1Minutes = b1;
        block2Minutes = b2;
        circuitLength1 = config1.circuitLength;
        numRounds1 = config1.numRounds;
        circuitLength2 = config2.circuitLength;
        numRounds2 = config2.numRounds;
        foundExact = true;
        break;
      }
    }
    
    if (!foundExact) {
      block1Minutes = half;
      block2Minutes = mainMinutes - half;
      const config1 = findBestCircuitConfig(block1Minutes);
      const config2 = findBestCircuitConfig(block2Minutes);
      circuitLength1 = config1.circuitLength;
      numRounds1 = config1.numRounds;
      circuitLength2 = config2.circuitLength;
      numRounds2 = config2.numRounds;
      block1Minutes = circuitLength1 * numRounds1;
      block2Minutes = circuitLength2 * numRounds2;
      mainMinutes = block1Minutes + block2Minutes;
    }
  } else {
    const configSingle = findBestCircuitConfig(mainMinutes);
    circuitLength = configSingle.circuitLength;
    numRounds = configSingle.numRounds;
    mainMinutes = circuitLength * numRounds;
  }

  // Each change of round or block adds 30 s of rest: take that time off the warm-up and
  // finisher so the session lasts the duration that was asked for.
  const transitions = numBlocksOpt === 2 ? (numRounds1 - 1) + (numRounds2 - 1) + 1 : numRounds - 1;
  const transitionMinutes = Math.floor((transitions * 30) / 60);

  // Recalculate warmup and finisher to fit exactly with the remainder
  const leftoverMinutes = Math.max(2, T - mainMinutes - transitionMinutes);
  warmupMinutes = Math.max(2, Math.ceil(leftoverMinutes * 0.6));
  finisherMinutes = leftoverMinutes - warmupMinutes;
  if (finisherMinutes < 1) {
    warmupMinutes--;
    finisherMinutes = leftoverMinutes - warmupMinutes;
  }

  // We want to construct circuit exercises with NO duplicates if possible
  const usedIds = new Set<string>();
  const circuitExercises: Exercise[] = [];
  const circuit1Exercises: Exercise[] = [];
  const circuit2Exercises: Exercise[] = [];

  if (numBlocksOpt === 2) {
    const c1 = createCircuitExercises(circuitLength1, pools, usedIds, availableWorkoutExercises);
    circuit1Exercises.push(...c1);
    const c2 = createCircuitExercises(circuitLength2, pools, usedIds, availableWorkoutExercises);
    circuit2Exercises.push(...c2);
  } else {
    const c = createCircuitExercises(circuitLength, pools, usedIds, availableWorkoutExercises);
    circuitExercises.push(...c);
  }

  // 2. Select finisher exercises from available/selected database
  const finisherExercises: Exercise[] = [];

  const cardioFinisher = availableWorkoutExercises.find(ex => ex.id === 'jumping_jacks') || 
                         availableWorkoutExercises.find(ex => ex.category === 'general') || 
                         availableWorkoutExercises[0];
  
  let abdosFinisher = availableWorkoutExercises.find(ex => ex.id === 'plank_commando') || 
                      availableWorkoutExercises.find(ex => ex.category === 'abdos') || 
                      availableWorkoutExercises[1 % availableWorkoutExercises.length];

  let finalBurnerFinisher = availableWorkoutExercises.find(ex => ex.id === 'wall_sit') || 
                            availableWorkoutExercises.find(ex => ex.category === 'general') || 
                            availableWorkoutExercises[2 % availableWorkoutExercises.length];

  finisherExercises.push(cardioFinisher, abdosFinisher, finalBurnerFinisher);

  const selectedFinishers: Exercise[] = [];
  for (let f = 0; f < finisherMinutes; f++) {
    selectedFinishers.push(finisherExercises[f % finisherExercises.length]);
  }

  const blocks: CircuitBlock[] = numBlocksOpt === 2
    ? [
        { exercises: circuit1Exercises, rounds: numRounds1 },
        { exercises: circuit2Exercises, rounds: numRounds2 },
      ]
    : [{ exercises: circuitExercises, rounds: numRounds }];

  return buildIntervals({ warmupMinutes, blocks, finishers: selectedFinishers }, rythme);
}

export interface CircuitBlock {
  exercises: Exercise[];
  rounds: number;
}

// What a session is made of, minute by minute: warm-up, one or two circuits repeated, finisher.
export interface SessionPlan {
  warmupMinutes: number;
  blocks: CircuitBlock[];
  finishers: Exercise[];
}

interface MinuteSlot {
  stage: WorkoutStage;
  exercise: Exercise;
  roundNumber?: number;
  blockNumber?: number;
  isRoundTransition?: boolean;
  isBlockTransition?: boolean;
}

const warmupExercise = (index: number): Exercise => ({
  id: `warmup_${index}`,
  equipmentRequired: [],
  ...WARM_UP_EXERCISES[index % WARM_UP_EXERCISES.length],
});

// Turns a plan into the timed work and rest intervals the player runs through.
export function buildIntervals(plan: SessionPlan, rythme: WorkoutConfig['rythme']): WorkoutInterval[] {
  const slots: MinuteSlot[] = [];
  for (let i = 0; i < plan.warmupMinutes; i++) {
    slots.push({ stage: 'warmup', exercise: warmupExercise(i) });
  }
  plan.blocks.forEach((block, blockIdx) => {
    for (let round = 1; round <= block.rounds; round++) {
      block.exercises.forEach((exercise, position) => {
        const endsRound = position === block.exercises.length - 1;
        slots.push({
          stage: 'main',
          exercise,
          roundNumber: round,
          blockNumber: blockIdx + 1,
          isRoundTransition: endsRound && round < block.rounds,
          isBlockTransition: endsRound && round === block.rounds && blockIdx < plan.blocks.length - 1,
        });
      });
    }
  });
  plan.finishers.forEach(exercise => slots.push({ stage: 'finisher', exercise }));

  const workTime = rythme === 'equilibre' ? 30 : 40;
  const restTime = rythme === 'equilibre' ? 30 : 20;
  const intervals: WorkoutInterval[] = [];

  slots.forEach((slot, blockIdx) => {
    const { stage, exercise, roundNumber, blockNumber } = slot;
    const isRoundTransition = !!slot.isRoundTransition;
    const isBlockTransition = !!slot.isBlockTransition;
    const roundTransitionFrom = isRoundTransition ? roundNumber : undefined;
    const roundTransitionTo = isRoundTransition && roundNumber ? roundNumber + 1 : undefined;

    // Warm-up minutes are 50 s of easy work and 10 s to switch.
    const currentWorkTime = stage === 'warmup' ? 50 : workTime;
    let currentRestTime = stage === 'warmup' ? 10 : restTime;
    // Add extra 30s recovery between rounds or blocks
    if (isRoundTransition || isBlockTransition) {
      currentRestTime += 30;
    }

    intervals.push({
      intervalIndex: intervals.length,
      blockIndex: blockIdx,
      stage,
      type: 'work',
      title: stage === 'warmup' ? `Échauffement : ${exercise.name}` : exercise.name,
      description: exercise.description,
      target: exercise.target,
      duration: currentWorkTime,
      exercise,
      roundNumber,
      blockNumber
    });

    // No rest after the very last exercise of the session
    if (blockIdx === slots.length - 1) return;

    let restTitle = 'Récupération';
    let restDescription = 'Respire et bois une gorgée si besoin.';
    if (stage === 'warmup') {
      restDescription = 'Relâche les jambes et les épaules.';
    } else if (stage === 'finisher') {
      restDescription = 'Reprends ton souffle.';
    }
    if (isRoundTransition) {
      restTitle = `Fin du tour ${roundTransitionFrom}`;
      restDescription = `30 secondes de récupération en plus avant le tour ${roundTransitionTo}.`;
    } else if (isBlockTransition) {
      restTitle = 'Fin du bloc A';
      restDescription = '30 secondes de récupération en plus avant le bloc B.';
    }

    intervals.push({
      intervalIndex: intervals.length,
      blockIndex: blockIdx,
      stage,
      type: 'rest',
      title: restTitle,
      description: restDescription,
      target: isRoundTransition ? 'Changement de tour (+30 s)' : isBlockTransition ? 'Changement de bloc (+30 s)' : 'Récupération',
      duration: currentRestTime,
      exercise: null,
      roundNumber,
      blockNumber,
      isRoundTransition,
      roundTransitionFrom,
      roundTransitionTo,
      isBlockTransition
    });
  });

  return intervals;
}

/**
 * Finds the best configuration (circuit length & round count) to cleanly hit training times.
 */
function findBestCircuitConfig(M: number): { circuitLength: number; numRounds: number } {
  // Prefer rounds of 2, 3, 4, 5
  // Prefer circuitLength of 4, 5, 6, 7
  for (const r of [3, 4, 2, 5]) {
    const possibleLength = Math.round(M / r);
    if (possibleLength >= 4 && possibleLength <= 7) {
      if (r * possibleLength === M) {
        return { circuitLength: possibleLength, numRounds: r };
      }
    }
  }
  for (const r of [3, 2, 4]) {
    const possibleLength = Math.round(M / r);
    if (possibleLength >= 3) {
      return { circuitLength: possibleLength, numRounds: r };
    }
  }
  return { circuitLength: Math.max(3, Math.floor(M / 2)), numRounds: 2 };
}

/**
 * Distributes exercises across legs, arms, and abs targets.
 */
// Order in which groups are drawn into a circuit: the runner-specific groups come first and
// come back more often, and body areas alternate from one exercise to the next.
const CIRCUIT_GROUP_SEQUENCE: ExerciseGroup[] = [
  'mollets', 'gainage', 'adducteurs', 'fessiers', 'cuisses',
  'mollets', 'gainage', 'adducteurs', 'haut_du_corps', 'fessiers', 'cardio',
];

function createCircuitExercises(
  circuitLength: number,
  pools: Map<ExerciseGroup, Exercise[]>,
  usedIds: Set<string>,
  fallbackPool: Exercise[]
): Exercise[] {
  const result: Exercise[] = [];
  let cursor = 0;
  while (result.length < circuitLength) {
    // Walk the sequence to the next group that still has an unused exercise.
    let chosen: Exercise | undefined;
    for (let step = 0; step < CIRCUIT_GROUP_SEQUENCE.length && !chosen; step++) {
      const group = CIRCUIT_GROUP_SEQUENCE[(cursor + step) % CIRCUIT_GROUP_SEQUENCE.length];
      chosen = pools.get(group)?.find(ex => !usedIds.has(ex.id));
      if (chosen) cursor = (cursor + step + 1) % CIRCUIT_GROUP_SEQUENCE.length;
    }
    // Every selected exercise is used: repeat, preferring ones not yet in this circuit.
    if (!chosen) {
      const notInCircuit = fallbackPool.filter(ex => !result.includes(ex));
      const pool = notInCircuit.length > 0 ? notInCircuit : fallbackPool;
      chosen = pool[result.length % pool.length];
    }
    result.push(chosen);
    usedIds.add(chosen.id);
  }
  return result;
}
