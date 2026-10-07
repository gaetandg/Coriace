import { useState, useEffect, useMemo } from 'react';
import { generateWorkout } from '../workoutGenerator';
import { WorkoutConfig, WorkoutInterval } from '../types';
import { EXERCISE_DATABASE } from '../exercises';
import { getBlockSteps, groupPlan } from '../lib/plan';
import { useBeep } from './useBeep';

export type WorkoutState = 'config' | 'summary' | 'active' | 'completed';
export type EquipmentKey = keyof WorkoutConfig['equipment'];

// Workout configuration, generated plan and player state, with every action on them.
export function useWorkoutSession(notify: (message: string) => void) {
  // --- STATE ---
  const [config, setConfig] = useState<WorkoutConfig>({
    equipment: {
      none: false,
      chaise: true,
      poids_8kg: true,
      corde_a_sauter: false,
    },
    rythme: 'equilibre', // 'equilibre' vs 'intense'
    durationMinutes: 30,
    numBlocks: 1, // Defaulting to 1 block
    selectedExerciseIds: EXERCISE_DATABASE.map(ex => ex.id)
  });

  const [workoutState, setWorkoutState] = useState<WorkoutState>('config');
  const [intervals, setIntervals] = useState<WorkoutInterval[]>([]);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const { initAudio, beep: triggerAudioBeep } = useBeep(soundEnabled);

  // --- INTERVAL & TIMER HOOKS ---
  const activeInterval = useMemo<WorkoutInterval | null>(() => {
    if (intervals.length === 0 || currentIntervalIndex >= intervals.length) return null;
    return intervals[currentIntervalIndex];
  }, [intervals, currentIntervalIndex]);

  // Overall workout progress calculations
  const progressMetrics = useMemo(() => {
    if (intervals.length === 0) return { totalSeconds: 1800, elapsedSeconds: 0, percentage: 0 };

    let totalSeconds = 0;
    intervals.forEach(inv => {
      totalSeconds += inv.duration;
    });

    let elapsedSeconds = 0;
    for (let i = 0; i < currentIntervalIndex; i++) {
      elapsedSeconds += intervals[i].duration;
    }
    // Add elapsed seconds of the current active interval
    if (activeInterval) {
      const activeElapsed = activeInterval.duration - secondsRemaining;
      elapsedSeconds += activeElapsed;
    }

    const percentage = totalSeconds > 0 ? (elapsedSeconds / totalSeconds) * 100 : 0;
    return {
      totalSeconds,
      elapsedSeconds,
      percentage: Math.min(percentage, 100)
    };
  }, [intervals, currentIntervalIndex, secondsRemaining, activeInterval]);

  const blockSteps = useMemo(() => getBlockSteps(intervals), [intervals]);

  // Handle ticking timer
  useEffect(() => {
    if (!isPlaying || workoutState !== 'active' || intervals.length === 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Transition to next interval
          handleNextInterval();
          return 0;
        }

        const nextSec = prev - 1;
        // BEEP MANAGEMENT: Play short beep on 3, 2, 1 seconds left
        if (soundEnabled && (nextSec === 3 || nextSec === 2 || nextSec === 1)) {
          triggerAudioBeep(880, 0.15);
        }

        return nextSec;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, workoutState, currentIntervalIndex, soundEnabled, intervals]);

  // Turning sound on plays a beep so the runner can check the volume.
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      initAudio();
      triggerAudioBeep(1200, 0.4, true);
    }
  };

  // --- NAVIGATION & CONTROLS ---
  const handleGenerateWorkoutPlan = () => {
    initAudio();
    const generated = generateWorkout(config);
    setIntervals(generated);
    setCurrentIntervalIndex(0);
    setSecondsRemaining(generated[0]?.duration || 30);
    setWorkoutState('summary');
  };

  const handleLaunchWorkout = () => {
    initAudio();
    setWorkoutState('active');
    setIsPlaying(true);

    // Play starting high beep
    setTimeout(() => {
      triggerAudioBeep(1320, 0.6);
    }, 100);
  };

  const handleBackToConfig = () => {
    setWorkoutState('config');
  };

  const handleRegeneratePlan = () => {
    initAudio();
    const generated = generateWorkout(config);
    setIntervals(generated);
    setCurrentIntervalIndex(0);
    setSecondsRemaining(generated[0]?.duration || 30);
    notify('Nouvel ordre des exercices.');
  };

  // Find compatible exercises for selected configuration (equipment based)
  const compatibleExercises = useMemo(() => {
    return EXERCISE_DATABASE.filter(ex => {
      return ex.equipmentRequired.every(eq => {
        if (eq === 'chaise') return config.equipment.chaise;
        if (eq === 'poids_8kg') return config.equipment.poids_8kg;
        if (eq === 'corde_a_sauter') return config.equipment.corde_a_sauter;
        return true;
      });
    });
  }, [config.equipment]);

  // Find preview exercises that are both compatible AND selected by the user
  const previewExercises = useMemo(() => {
    return compatibleExercises.filter(ex => {
      const selected = config.selectedExerciseIds || EXERCISE_DATABASE.map(e => e.id);
      return selected.includes(ex.id);
    });
  }, [compatibleExercises, config.selectedExerciseIds]);

  const toggleExerciseSelection = (id: string) => {
    setConfig(prev => {
      const selected = prev.selectedExerciseIds || EXERCISE_DATABASE.map(e => e.id);
      let nextSelected;
      if (selected.includes(id)) {
        // Prevent deselecting if it is the last compatible one
        const compatibleSelectedCount = compatibleExercises.filter(ex => selected.includes(ex.id)).length;
        if (compatibleSelectedCount <= 1 && selected.includes(id)) {
          notify('Garde au moins un exercice.');
          return prev;
        }
        nextSelected = selected.filter(x => x !== id);
      } else {
        nextSelected = [...selected, id];
      }
      return {
        ...prev,
        selectedExerciseIds: nextSelected
      };
    });
  };

  const handleSelectAllExercises = (select: boolean) => {
    setConfig(prev => {
      let nextSelected;
      if (select) {
        nextSelected = Array.from(new Set([...(prev.selectedExerciseIds || []), ...compatibleExercises.map(ex => ex.id)]));
      } else {
        nextSelected = (prev.selectedExerciseIds || []).filter(id => !compatibleExercises.some(ex => ex.id === id));
        // Fallback: keep at least 1 exercise
        if (nextSelected.length === 0 && compatibleExercises.length > 0) {
          nextSelected.push(compatibleExercises[0].id);
        }
      }
      return {
        ...prev,
        selectedExerciseIds: nextSelected
      };
    });
  };

  const handleNextInterval = () => {
    if (currentIntervalIndex < intervals.length - 1) {
      const nextIdx = currentIntervalIndex + 1;
      setCurrentIntervalIndex(nextIdx);
      setSecondsRemaining(intervals[nextIdx].duration);
      // Play high change-of-stage beep
      triggerAudioBeep(1200, 0.5);
    } else {
      // Workout Completed!
      setWorkoutState('completed');
      setIsPlaying(false);
      triggerAudioBeep(1500, 0.8);
    }
  };

  const handlePrevInterval = () => {
    if (currentIntervalIndex > 0) {
      const prevIdx = currentIntervalIndex - 1;
      setCurrentIntervalIndex(prevIdx);
      setSecondsRemaining(intervals[prevIdx].duration);
      triggerAudioBeep(980, 0.3);
    }
  };

  const handleJumpToBlock = (blockIdx: number) => {
    initAudio();
    const targetIdx = blockIdx * 2;
    if (targetIdx < intervals.length) {
      setCurrentIntervalIndex(targetIdx);
      setSecondsRemaining(intervals[targetIdx].duration);
      triggerAudioBeep(1100, 0.25);
    }
  };

  const togglePlayPause = () => {
    initAudio();
    setIsPlaying(prev => !prev);
    triggerAudioBeep(1000, 0.15);
  };

  const resetWorkout = () => {
    setIsPlaying(false);
    setCurrentIntervalIndex(0);
    setWorkoutState('config');
  };

  const handleEquipmentChange = (key: EquipmentKey) => {
    if (key === 'none') {
      setConfig(prev => ({
        ...prev,
        equipment: { none: true, chaise: false, poids_8kg: false, corde_a_sauter: false }
      }));
    } else {
      setConfig(prev => {
        const nextEq = { ...prev.equipment, none: false, [key]: !prev.equipment[key] };
        // If everything gets unchecked, fallback to 'none'
        if (!nextEq.chaise && !nextEq.poids_8kg && !nextEq.corde_a_sauter) {
          nextEq.none = true;
        }
        return {
          ...prev,
          equipment: nextEq
        };
      });
    }
  };

  const summaryPlanGroups = useMemo(() => {
    if (intervals.length === 0) return null;
    return groupPlan(intervals);
  }, [intervals]);

  // Find the total rounds in the currently active block
  const activeBlockTotalRounds = useMemo(() => {
    if (!activeInterval || activeInterval.stage !== 'main') return 0;
    const mains = intervals.filter(inv => inv.stage === 'main' && inv.type === 'work');
    if (mains.some(m => m.blockNumber === 2)) {
      const isBlock2 = activeInterval.blockNumber === 2;
      const targetBlockNumber = isBlock2 ? 2 : 1;
      const rounds = mains.filter(m => (m.blockNumber || 1) === targetBlockNumber).map(m => m.roundNumber || 0);
      return rounds.length > 0 ? Math.max(...rounds) : 2;
    }
    const rounds = mains.map(m => m.roundNumber || 0);
    return rounds.length > 0 ? Math.max(...rounds) : 2;
  }, [intervals, activeInterval]);

  // Next up exercise lookup
  const nextUp = useMemo(() => {
    if (currentIntervalIndex >= intervals.length - 1) return null;
    // Walk down the flat array to find the next 'work' stage interval
    for (let i = currentIntervalIndex + 1; i < intervals.length; i++) {
      if (intervals[i].type === 'work') {
        return intervals[i];
      }
    }
    return null;
  }, [intervals, currentIntervalIndex]);

  return {
    config,
    setConfig,
    workoutState,
    intervals,
    currentIntervalIndex,
    secondsRemaining,
    isPlaying,
    soundEnabled,
    toggleSound,
    activeInterval,
    progressMetrics,
    blockSteps,
    compatibleExercises,
    previewExercises,
    summaryPlanGroups,
    activeBlockTotalRounds,
    nextUp,
    handleGenerateWorkoutPlan,
    handleLaunchWorkout,
    handleBackToConfig,
    handleRegeneratePlan,
    toggleExerciseSelection,
    handleSelectAllExercises,
    handleNextInterval,
    handlePrevInterval,
    handleJumpToBlock,
    togglePlayPause,
    resetWorkout,
    handleEquipmentChange,
  };
}

export type WorkoutSession = ReturnType<typeof useWorkoutSession>;
