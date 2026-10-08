import { EXERCISE_DATABASE } from './exercises';
import { WorkoutConfig, WorkoutInterval, Exercise, ExerciseGroup, WorkoutStage } from './types';
import { RHYTHMS } from './lib/rhythm';
import { MAX_WARMUP_MINUTES, cooldownStretches, warmupMoves } from './sessionParts';

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// `previous` is the session being replaced: its exercises are avoided while others remain,
// so "Régénérer" gives a visibly different session.
export function generateWorkout(config: WorkoutConfig, previous: WorkoutInterval[] = []): WorkoutInterval[] {
  const avoidIds = new Set(previous.filter(i => i.stage !== 'warmup' && i.exercise).map(i => i.exercise!.id));
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

  const shape = sessionShape(config.durationMinutes || 30, !!config.skipWarmup);

  // Circuits: each one has its own exercises.
  const usedIds = new Set<string>();
  const blocks: CircuitBlock[] = shape.blocks.map(({ length, rounds }) => ({
    exercises: createCircuitExercises(length, pools, usedIds, avoidIds, availableWorkoutExercises),
    rounds,
  }));

  // Finisher: cardio and jumps (jump rope included), drawn among the exercises not used in the circuits.
  const lively = shuffle(availableWorkoutExercises.filter(ex => ex.group === 'cardio' || ex.equipmentRequired.includes('corde_a_sauter')));
  const finishers: Exercise[] = [];
  for (let f = 0; f < shape.finisherMinutes; f++) {
    const unused = (list: Exercise[]) => list.filter(ex => !usedIds.has(ex.id));
    const exercise =
      unused(lively).find(ex => !avoidIds.has(ex.id)) ??
      unused(lively)[0] ??
      unused(availableWorkoutExercises)[0] ??
      lively[f % Math.max(1, lively.length)] ??
      availableWorkoutExercises[f % availableWorkoutExercises.length];
    finishers.push(exercise);
    usedIds.add(exercise.id);
  }

  return buildIntervals({
    warmup: warmupMoves(shape.warmupMinutes),
    blocks,
    finishers,
    cooldown: cooldownStretches(shape.cooldownMinutes),
  }, rythme);
}

// Exercises usable with the equipment at hand.
export const fitsEquipment = (ex: Exercise, equipment: WorkoutConfig['equipment']) =>
  ex.equipmentRequired.every(eq => equipment[eq]);

// Personalized session: every selected exercise, ordered so that a group never comes twice in a
// row, repeated `customRounds` times. The warm-up and cool-down follow the circuit's length; no
// finisher, the runner chose exactly what they do.
export function customPlan(config: WorkoutConfig): SessionPlan {
  const ids = config.customExerciseIds ?? [];
  const exercises = EXERCISE_DATABASE.filter(ex => ids.includes(ex.id) && fitsEquipment(ex, config.equipment));
  const rounds = config.customRounds ?? 3;
  const circuit = exercises.length * rounds;
  const warmup = config.skipWarmup ? 0 : circuit < 12 ? 3 : circuit < 20 ? 4 : circuit < 32 ? 5 : MAX_WARMUP_MINUTES;
  const cooldown = circuit < 12 ? 1 : circuit < 30 ? 2 : 3;
  return {
    warmup: warmupMoves(warmup),
    blocks: exercises.length > 0 ? [{ exercises: spreadGroups(exercises), rounds }] : [],
    finishers: [],
    cooldown: cooldownStretches(cooldown),
  };
}

export const generateCustomWorkout = (config: WorkoutConfig): WorkoutInterval[] => buildIntervals(customPlan(config), config.rythme);

// Length of a session in whole minutes, as announced to the runner.
export const sessionMinutes = (intervals: WorkoutInterval[]) => Math.round(intervals.reduce((sum, i) => sum + i.duration, 0) / 60);

export interface SessionShape {
  warmupMinutes: number;
  blocks: { length: number; rounds: number }[];
  finisherMinutes: number;
  cooldownMinutes: number;
}

// How a session of `minutes` is laid out. Circuits stay short (about six exercises, eight at
// most, 3 or 4 rounds); long sessions get a second block rather than an endless circuit. Every change of
// round or block adds 30 s of rest. Skipping the warm-up gives the time to the circuits.
export function sessionShape(minutes: number, skipWarmup = false): SessionShape {
  const target = {
    warmup: skipWarmup ? 0 : minutes < 20 ? 3 : minutes < 30 ? 4 : minutes < 45 ? 5 : MAX_WARMUP_MINUTES,
    finisher: minutes < 30 ? 2 : 3,
    cooldown: minutes < 20 ? 1 : minutes < 45 ? 2 : 3,
  };
  // Long sessions: more rounds of about six exercises rather than ever longer circuits.
  const roundsTarget = minutes >= 45 ? 4 : 3;
  const around = (value: number, min: number, max: number) =>
    [value - 1, value, value + 1].filter(v => v >= min && v <= max);
  const structures: { blocks: { length: number; rounds: number }[]; minutes: number }[] = [];
  for (let rounds = 2; rounds <= 4; rounds++) {
    for (let length = 4; length <= 8; length++) {
      structures.push({ blocks: [{ length, rounds }], minutes: length * rounds + (rounds - 1) / 2 });
      if (rounds >= 3) {
        for (const second of [length, length - 1]) {
          if (second < 4) continue;
          structures.push({ blocks: [{ length, rounds }, { length: second, rounds }], minutes: (length + second) * rounds + (2 * rounds - 1) / 2 });
        }
      }
    }
  }
  let best: SessionShape | null = null, bestScore = Infinity;
  for (const warmup of skipWarmup ? [0] : around(target.warmup, 2, MAX_WARMUP_MINUTES)) {
    for (const finisher of around(target.finisher, 1, 4)) {
      for (const cooldown of around(target.cooldown, 1, 3)) {
        for (const structure of structures) {
          // The pause after the last stretch is not played.
          const total = warmup + finisher + cooldown + structure.minutes - 5 / 60;
          const [first] = structure.blocks;
          const score = Math.abs(total - minutes) * 10
            + Math.abs(warmup - target.warmup) + Math.abs(finisher - target.finisher) * 0.8 + Math.abs(cooldown - target.cooldown) * 0.6
            + (structure.blocks.length - 1) * 1.5 + Math.abs(first.rounds - roundsTarget) * 0.5 + Math.abs(first.length - 6) * 0.3;
          if (score < bestScore) {
            bestScore = score;
            best = { warmupMinutes: warmup, blocks: structure.blocks, finisherMinutes: finisher, cooldownMinutes: cooldown };
          }
        }
      }
    }
  }
  return best!;
}

export interface CircuitBlock {
  exercises: Exercise[];
  rounds: number;
}

// What a session is made of, minute by minute: warm-up, one or two circuits repeated,
// finisher, cool-down.
export interface SessionPlan {
  warmup: Exercise[];
  blocks: CircuitBlock[];
  finishers: Exercise[];
  cooldown: Exercise[];
}

interface MinuteSlot {
  stage: WorkoutStage;
  exercise: Exercise;
  roundNumber?: number;
  blockNumber?: number;
  isRoundTransition?: boolean;
  isBlockTransition?: boolean;
}

// Turns a plan into the timed work and rest intervals the player runs through.
export function buildIntervals(plan: SessionPlan, rythme: WorkoutConfig['rythme']): WorkoutInterval[] {
  const slots: MinuteSlot[] = [];
  plan.warmup.forEach(exercise => slots.push({ stage: 'warmup', exercise }));
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
  plan.cooldown.forEach(exercise => slots.push({ stage: 'cooldown', exercise }));

  const { work: workTime, rest: restTime } = RHYTHMS[rythme];
  const intervals: WorkoutInterval[] = [];

  slots.forEach((slot, blockIdx) => {
    const { stage, exercise, roundNumber, blockNumber } = slot;
    const isRoundTransition = !!slot.isRoundTransition;
    const isBlockTransition = !!slot.isBlockTransition;
    const roundTransitionFrom = isRoundTransition ? roundNumber : undefined;
    const roundTransitionTo = isRoundTransition && roundNumber ? roundNumber + 1 : undefined;

    // Warm-up minutes are 50 s of easy work and 10 s to switch; stretches are held 55 s.
    const currentWorkTime = stage === 'warmup' ? 50 : stage === 'cooldown' ? 55 : workTime;
    let currentRestTime = stage === 'warmup' ? 10 : stage === 'cooldown' ? 5 : restTime;
    // Add extra 30s recovery between rounds or blocks
    if (isRoundTransition || isBlockTransition) {
      currentRestTime += 30;
    }

    intervals.push({
      intervalIndex: intervals.length,
      blockIndex: blockIdx,
      stage,
      type: 'work',
      title: exercise.name,
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
    } else if (stage === 'cooldown') {
      restTitle = 'Étirement suivant';
      restDescription = 'Change de position doucement.';
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
/**
 * Distributes exercises across legs, arms, and abs targets.
 */
// Every circuit includes these groups when they have selected exercises.
const KEY_GROUPS: ExerciseGroup[] = ['mollets', 'adducteurs', 'fessiers', 'gainage'];

// How likely each group is to fill the remaining places of a circuit.
const GROUP_WEIGHTS: Record<ExerciseGroup, number> = {
  mollets: 3, gainage: 3, adducteurs: 2, fessiers: 2, cuisses: 2, haut_du_corps: 1, cardio: 1,
};

const MAX_PER_GROUP = 2;

const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

// A random unused exercise of the group, preferring ones not in the session being replaced.
function pickFromGroup(
  pools: Map<ExerciseGroup, Exercise[]>,
  group: ExerciseGroup,
  usedIds: Set<string>,
  avoidIds: Set<string>
): Exercise | undefined {
  const unused = (pools.get(group) ?? []).filter(ex => !usedIds.has(ex.id));
  const fresh = unused.filter(ex => !avoidIds.has(ex.id));
  return fresh.length > 0 ? randomItem(fresh) : unused.length > 0 ? randomItem(unused) : undefined;
}

// Shuffles so that two exercises of the same group never follow each other when avoidable.
function spreadGroups(exercises: Exercise[]): Exercise[] {
  const remaining = shuffle(exercises);
  const result: Exercise[] = [];
  while (remaining.length > 0) {
    const previousGroup = result[result.length - 1]?.group;
    // Take from the most represented groups first so the last places don't end up doubled.
    const counts = new Map<ExerciseGroup, number>();
    remaining.forEach(ex => counts.set(ex.group, (counts.get(ex.group) ?? 0) + 1));
    const candidates = remaining.filter(ex => ex.group !== previousGroup);
    const pool = candidates.length > 0 ? candidates : remaining;
    const maxCount = Math.max(...pool.map(ex => counts.get(ex.group)!));
    const next = randomItem(pool.filter(ex => counts.get(ex.group) === maxCount));
    result.push(next);
    remaining.splice(remaining.indexOf(next), 1);
  }
  return result;
}

function createCircuitExercises(
  circuitLength: number,
  pools: Map<ExerciseGroup, Exercise[]>,
  usedIds: Set<string>,
  avoidIds: Set<string>,
  fallbackPool: Exercise[]
): Exercise[] {
  const chosen: Exercise[] = [];
  const take = (exercise: Exercise) => {
    chosen.push(exercise);
    usedIds.add(exercise.id);
  };

  // 1. One exercise from each key group, in random order.
  for (const group of shuffle(KEY_GROUPS)) {
    if (chosen.length >= circuitLength) break;
    const exercise = pickFromGroup(pools, group, usedIds, avoidIds);
    if (exercise) take(exercise);
  }

  // 2. Remaining places: a weighted random group, then a random exercise in it.
  while (chosen.length < circuitLength) {
    const withUnused = [...pools.keys()].filter(group => pools.get(group)!.some(ex => !usedIds.has(ex.id)));
    if (withUnused.length === 0) break;
    // At most two exercises per group in a circuit while other groups can fill it.
    const notFull = withUnused.filter(group => chosen.filter(ex => ex.group === group).length < MAX_PER_GROUP);
    const candidates = notFull.length > 0 ? notFull : withUnused;
    // Groups that still have exercises not done in the replaced session come first.
    const withFresh = candidates.filter(group => pools.get(group)!.some(ex => !usedIds.has(ex.id) && !avoidIds.has(ex.id)));
    const groups = withFresh.length > 0 ? withFresh : candidates;
    const total = groups.reduce((sum, group) => sum + GROUP_WEIGHTS[group], 0);
    let ticket = Math.random() * total;
    const group = groups.find(g => (ticket -= GROUP_WEIGHTS[g]) < 0) ?? groups[groups.length - 1];
    take(pickFromGroup(pools, group, usedIds, avoidIds)!);
  }

  // 3. Every selected exercise is used: repeat, preferring ones not yet in this circuit.
  while (chosen.length < circuitLength) {
    const notInCircuit = fallbackPool.filter(ex => !chosen.includes(ex));
    take(randomItem(notInCircuit.length > 0 ? notInCircuit : fallbackPool));
  }

  return spreadGroups(chosen);
}
