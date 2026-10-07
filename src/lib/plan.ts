import { WorkoutInterval } from '../types';

// Group intervals for session summary
export function groupPlan(intervals: WorkoutInterval[]) {
  const warmups = intervals.filter(inv => inv.stage === 'warmup' && inv.type === 'work');
  const mains = intervals.filter(inv => inv.stage === 'main' && inv.type === 'work');
  const finishers = intervals.filter(inv => inv.stage === 'finisher' && inv.type === 'work');
  const cooldowns = intervals.filter(inv => inv.stage === 'cooldown' && inv.type === 'work');

  const hasTwoBlocks = mains.some(m => m.blockNumber === 2);
  const circuit1Exercises = mains.filter(m => (m.blockNumber || 1) === 1 && m.roundNumber === 1);
  const circuit2Exercises = mains.filter(m => m.blockNumber === 2 && m.roundNumber === 1);
  const numRounds1 = Math.max(...mains.filter(m => (m.blockNumber || 1) === 1).map(m => m.roundNumber || 0), 1);
  const numRounds2 = Math.max(...mains.filter(m => m.blockNumber === 2).map(m => m.roundNumber || 0), 1);

  const circuitExercises = mains.filter(m => m.roundNumber === 1);
  const numRounds = Math.max(...mains.map(m => m.roundNumber || 0), 1);

  return {
    warmups,
    circuitExercises,
    finishers,
    cooldowns,
    numRounds,
    hasTwoBlocks,
    circuit1Exercises,
    circuit2Exercises,
    numRounds1,
    numRounds2,
    totalWarmup: warmups.length,
    totalMainCircuit: circuitExercises.length,
    totalFinishers: finishers.length,
    totalCooldown: cooldowns.length,
  };
}

export type PlanGroups = ReturnType<typeof groupPlan>;

// One step per minute block: the work interval that opens it.
export function getBlockSteps(intervals: WorkoutInterval[]) {
  const steps = [];
  const count = Math.round(intervals.length / 2);
  for (let b = 0; b < count; b++) {
    const workInterval = intervals[b * 2];
    if (workInterval) {
      steps.push({
        blockIndex: b,
        intervalIndex: b * 2,
        stage: workInterval.stage,
        title: workInterval.title,
        exercise: workInterval.exercise,
        target: workInterval.target,
        roundNumber: workInterval.roundNumber,
        blockNumber: workInterval.blockNumber,
      });
    }
  }
  return steps;
}

export type BlockStep = ReturnType<typeof getBlockSteps>[number];
