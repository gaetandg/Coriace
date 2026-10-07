import { useState, useEffect, useMemo, useRef } from 'react';
import { generateWorkout } from '../workoutGenerator';
import { SoundSettings, WorkoutConfig, WorkoutInterval } from '../types';
import { loadPreferences, savePreferences } from '../lib/preferences';
import { EXERCISE_DATABASE } from '../exercises';
import { getBlockSteps, groupPlan } from '../lib/plan';
import { useBeep } from './useBeep';
import { useSpeech } from './useSpeech';
import { useWakeLock } from './useWakeLock';
import { Cue, intervalStartCue, sessionEndCue, sessionStartCue, tickCue } from '../lib/cues';

export type WorkoutState = 'config' | 'summary' | 'active' | 'completed';
export type EquipmentKey = keyof WorkoutConfig['equipment'];

export type { SoundSettings };

// Workout configuration, generated plan and player state, with every action on them.
export function useWorkoutSession(notify: (message: string) => void) {
  // --- STATE ---
  // Saved settings are read once, when the app opens.
  const [initialPreferences] = useState(loadPreferences);
  const [config, setConfig] = useState<WorkoutConfig>(initialPreferences.config);

  const [workoutState, setWorkoutState] = useState<WorkoutState>('config');
  const [intervals, setIntervals] = useState<WorkoutInterval[]>([]);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sound, setSound] = useState<SoundSettings>(initialPreferences.sound);
  // Bumped whenever the countdown must restart from `secondsRemaining` without the interval changing.
  const [timerRun, setTimerRun] = useState(0);

  useEffect(() => {
    savePreferences({ config, sound });
  }, [config, sound]);

  const { initAudio, beep: triggerAudioBeep } = useBeep(sound.beeps);
  const speech = useSpeech(sound.voice);
  useWakeLock(workoutState === 'active');

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

  const playCue = (cue: Cue | null) => {
    if (!cue) return;
    const voiceOn = sound.voice && speech.supported;
    if (cue.beep) triggerAudioBeep(cue.beep.frequency, cue.beep.duration);
    if (cue.say && voiceOn) speech.speak(cue.say);
    else if (cue.fallbackBeep) triggerAudioBeep(cue.fallbackBeep.frequency, cue.fallbackBeep.duration);
  };

  // Countdown: derived from an end timestamp so it stays accurate even if ticks are delayed.
  const secondsRef = useRef(secondsRemaining);
  secondsRef.current = secondsRemaining;
  useEffect(() => {
    if (!isPlaying || workoutState !== 'active') return;
    const endAt = Date.now() + secondsRef.current * 1000;
    const timer = window.setInterval(() => {
      setSecondsRemaining(Math.max(0, Math.ceil((endAt - Date.now()) / 1000)));
    }, 200);
    return () => window.clearInterval(timer);
  }, [isPlaying, workoutState, currentIntervalIndex, timerRun]);

  // Cues and moving on: each interval start and each second is handled once.
  const startedIndexRef = useRef(-1);
  const lastTickRef = useRef('');
  useEffect(() => {
    if (workoutState !== 'active' || !isPlaying || !activeInterval) return;
    const tickKey = `${currentIntervalIndex}:${secondsRemaining}`;
    if (startedIndexRef.current !== currentIntervalIndex) {
      startedIndexRef.current = currentIntervalIndex;
      lastTickRef.current = tickKey;
      playCue(intervalStartCue(intervals, currentIntervalIndex));
      return;
    }
    if (lastTickRef.current === tickKey) return;
    lastTickRef.current = tickKey;
    if (secondsRemaining <= 0) {
      handleNextInterval();
    } else {
      playCue(tickCue(activeInterval, secondsRemaining));
    }
  }, [workoutState, isPlaying, currentIntervalIndex, secondsRemaining]);

  const setSoundOption = (key: keyof SoundSettings, value: boolean) => {
    setSound(prev => ({ ...prev, [key]: value }));
    if (key === 'voice' && !value) speech.cancel();
  };

  // Plays whatever is switched on so the runner can check the volume.
  const testSound = () => {
    initAudio();
    if (sound.beeps) triggerAudioBeep(1200, 0.4);
    if (sound.voice) speech.speak('Le son fonctionne.');
  };

  const goToInterval = (index: number) => {
    setCurrentIntervalIndex(index);
    setSecondsRemaining(intervals[index].duration);
    setTimerRun(run => run + 1);
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
    setTimerRun(run => run + 1);
    // Spoken inside the tap: iOS only allows speech that starts from a user gesture.
    startedIndexRef.current = 0;
    playCue(sessionStartCue(intervals));
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
    notify('Nouvelle séance générée.');
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

  // Checks or unchecks several exercises at once (a group, or the whole list).
  // At least one exercise usable with the equipment stays checked.
  const setExercisesSelected = (ids: string[], select: boolean) => {
    const current = config.selectedExerciseIds || EXERCISE_DATABASE.map(e => e.id);
    const nextSelected = select ? Array.from(new Set([...current, ...ids])) : current.filter(id => !ids.includes(id));
    if (!compatibleExercises.some(ex => nextSelected.includes(ex.id))) {
      const kept = compatibleExercises.find(ex => ids.includes(ex.id)) ?? compatibleExercises[0];
      if (!kept) return;
      nextSelected.push(kept.id);
      notify(`Il faut au moins un exercice : ${kept.name} reste coché.`);
    }
    setConfig(prev => ({ ...prev, selectedExerciseIds: nextSelected }));
  };

  // The start cue of the new interval is played by the cue effect.
  const handleNextInterval = () => {
    if (currentIntervalIndex < intervals.length - 1) {
      goToInterval(currentIntervalIndex + 1);
    } else {
      setWorkoutState('completed');
      setIsPlaying(false);
      playCue(sessionEndCue());
    }
  };

  const handlePrevInterval = () => {
    if (currentIntervalIndex > 0) goToInterval(currentIntervalIndex - 1);
  };

  const handleJumpToBlock = (blockIdx: number) => {
    initAudio();
    const targetIdx = blockIdx * 2;
    if (targetIdx < intervals.length) goToInterval(targetIdx);
  };

  const togglePlayPause = () => {
    initAudio();
    if (isPlaying) speech.cancel();
    setIsPlaying(prev => !prev);
    triggerAudioBeep(1000, 0.15);
  };

  const resetWorkout = () => {
    speech.cancel();
    setIsPlaying(false);
    setCurrentIntervalIndex(0);
    startedIndexRef.current = -1;
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
    sound,
    setSoundOption,
    testSound,
    speechSupported: speech.supported,
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
    setExercisesSelected,
    handleNextInterval,
    handlePrevInterval,
    handleJumpToBlock,
    togglePlayPause,
    resetWorkout,
    handleEquipmentChange,
  };
}

export type WorkoutSession = ReturnType<typeof useWorkoutSession>;
