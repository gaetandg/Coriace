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
  const totalBlocks = warmupMinutes + mainMinutes + finisherMinutes;

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

  // Time metrics
  const workTime = rythme === 'equilibre' ? 30 : 40;
  const restTime = rythme === 'equilibre' ? 30 : 20;

  const intervals: WorkoutInterval[] = [];
  let intervalCounter = 0;

  // Let's compile the intervals.
  for (let blockIdx = 0; blockIdx < totalBlocks; blockIdx++) {
    let stage: WorkoutStage;
    let exercise: Exercise;
    let roundNumber: number | undefined;
    let blockNumber: number | undefined;

    if (blockIdx < warmupMinutes) {
      // Warmup
      stage = 'warmup';
      const wEx = WARM_UP_EXERCISES[blockIdx % WARM_UP_EXERCISES.length];
      // Adapt as Exercise object
      exercise = {
        id: `warmup_${blockIdx}`,
        name: wEx.name,
        target: wEx.target,
        description: wEx.description,
        equipmentRequired: [],
        category: wEx.category,
        group: wEx.group,
        tips: wEx.tips,
        instructionHighlight: wEx.instructionHighlight
      };
    } else if (blockIdx < warmupMinutes + mainMinutes) {
      // Main Circuit
      stage = 'main';
      const stepInMain = blockIdx - warmupMinutes;
      if (numBlocksOpt === 2) {
        if (stepInMain < block1Minutes) {
          blockNumber = 1;
          const stepInRound1 = stepInMain % circuitLength1;
          roundNumber = Math.floor(stepInMain / circuitLength1) + 1;
          exercise = circuit1Exercises[stepInRound1];
        } else {
          blockNumber = 2;
          const stepInBlock2 = stepInMain - block1Minutes;
          const stepInRound2 = stepInBlock2 % circuitLength2;
          roundNumber = Math.floor(stepInBlock2 / circuitLength2) + 1;
          exercise = circuit2Exercises[stepInRound2];
        }
      } else {
        blockNumber = 1;
        const stepInRound = stepInMain % circuitLength;
        roundNumber = Math.floor(stepInMain / circuitLength) + 1;
        exercise = circuitExercises[stepInRound];
      }
    } else {
      // Finisher
      stage = 'finisher';
      const stepIdx = blockIdx - (warmupMinutes + mainMinutes);
      exercise = selectedFinishers[stepIdx % selectedFinishers.length];
    }

    // Check for round or block transitions
    let isRoundTransition = false;
    let roundTransitionFrom: number | undefined;
    let roundTransitionTo: number | undefined;
    let isBlockTransition = false;

    if (stage === 'main') {
      const stepInMain = blockIdx - warmupMinutes;
      if (numBlocksOpt === 2) {
        if (stepInMain < block1Minutes) {
          const stepInRound1 = stepInMain % circuitLength1;
          const currentRound = Math.floor(stepInMain / circuitLength1) + 1;
          if (stepInRound1 === circuitLength1 - 1) {
            if (currentRound < numRounds1) {
              isRoundTransition = true;
              roundTransitionFrom = currentRound;
              roundTransitionTo = currentRound + 1;
            } else {
              isBlockTransition = true;
            }
          }
        } else {
          const stepInBlock2 = stepInMain - block1Minutes;
          const stepInRound2 = stepInBlock2 % circuitLength2;
          const currentRound = Math.floor(stepInBlock2 / circuitLength2) + 1;
          if (stepInRound2 === circuitLength2 - 1) {
            if (currentRound < numRounds2) {
              isRoundTransition = true;
              roundTransitionFrom = currentRound;
              roundTransitionTo = currentRound + 1;
            }
          }
        }
      } else {
        const stepInRound = stepInMain % circuitLength;
        const currentRound = Math.floor(stepInMain / circuitLength) + 1;
        if (stepInRound === circuitLength - 1) {
          if (currentRound < numRounds) {
            isRoundTransition = true;
            roundTransitionFrom = currentRound;
            roundTransitionTo = currentRound + 1;
          }
        }
      }
    }

    // Work Interval
    let currentWorkTime = workTime;
    let currentRestTime = restTime;
    if (stage === 'warmup') {
      currentWorkTime = 50;
      currentRestTime = 10;
    }

    // Add extra 30s recovery between rounds or blocks
    if (isRoundTransition || isBlockTransition) {
      currentRestTime += 30;
    }

    const workTitle = stage === 'warmup' ? `Échauffement : ${exercise.name}` : exercise.name;
    intervals.push({
      intervalIndex: intervalCounter++,
      blockIndex: blockIdx,
      stage,
      type: 'work',
      title: workTitle,
      description: exercise.description,
      target: exercise.target,
      duration: currentWorkTime,
      exercise,
      roundNumber,
      blockNumber
    });

    // Rest Interval - Only add if NOT the very last block of the session
    if (blockIdx < totalBlocks - 1) {
      let restTitle = 'Récupération';
      let restDescription = 'Respire et bois une gorgée si besoin.';
      if (stage === 'warmup') {
        restDescription = 'Relâche les jambes et les épaules.';
      } else if (stage === 'finisher') {
        restDescription = 'Reprends ton souffle.';
      }

      if (isRoundTransition && roundTransitionFrom && roundTransitionTo) {
        restTitle = `Fin du tour ${roundTransitionFrom}`;
        restDescription = `30 secondes de récupération en plus avant le tour ${roundTransitionTo}.`;
      } else if (isBlockTransition) {
        restTitle = 'Fin du bloc A';
        restDescription = '30 secondes de récupération en plus avant le bloc B.';
      }

      intervals.push({
        intervalIndex: intervalCounter++,
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
    }
  }

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
