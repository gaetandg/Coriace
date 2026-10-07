/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Dumbbell, 
  Award, 
  Volume2, 
  VolumeX, 
  Flame, 
  Shield, 
  Footprints, 
  ArrowRight, 
  ArrowLeft, 
  Timer, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  Activity, 
  Check, 
  Heart,
  HelpCircle,
  X
} from 'lucide-react';
import { generateWorkout, getBodyPart } from './workoutGenerator';
import { WorkoutConfig, WorkoutInterval, Exercise } from './types';
import { EXERCISE_DATABASE } from './exercises';

export default function App() {
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

  const [workoutState, setWorkoutState] = useState<'config' | 'summary' | 'active' | 'completed'>('config');
  const [intervals, setIntervals] = useState<WorkoutInterval[]>([]);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'workout' | 'guide'>('workout');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [selectedSummaryExercise, setSelectedSummaryExercise] = useState<Exercise | null>(null);

  // Audio Context Ref to preserve browser interaction policy
  const audioContextRef = useRef<AudioContext | null>(null);

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

  const blockSteps = useMemo(() => {
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
  }, [intervals]);

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

  // --- AUDIO SOUND SYNTHESIS (Web Audio API) ---
  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    // Resume context if suspended (browser requirements)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const triggerAudioBeep = (frequency: number, duration: number) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Avoid clicking noises with sharp volume envelope
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio API is blocked or uninitialized. Tap anywhere to activate.", e);
    }
  };

  // Sound test triggering
  const testBeeps = () => {
    initAudio();
    triggerAudioBeep(1200, 0.4);
    setFeedbackMessage('🔊 Test réussi : Bip sonore activé !');
    setTimeout(() => setFeedbackMessage(''), 3000);
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

  const handleRefleshPlan = () => {
    initAudio();
    const generated = generateWorkout(config);
    setIntervals(generated);
    setCurrentIntervalIndex(0);
    setSecondsRemaining(generated[0]?.duration || 30);
    setFeedbackMessage('🔄 Séance ré-organisée de façon optimale !');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const toggleExerciseSelection = (id: string) => {
    setConfig(prev => {
      const selected = prev.selectedExerciseIds || EXERCISE_DATABASE.map(e => e.id);
      let nextSelected;
      if (selected.includes(id)) {
        // Prevent deselecting if it is the last compatible one
        const compatibleSelectedCount = compatibleExercises.filter(ex => selected.includes(ex.id)).length;
        if (compatibleSelectedCount <= 1 && selected.includes(id)) {
          setFeedbackMessage('⚠️ Sélectionnez au moins un exercice compatible !');
          setTimeout(() => setFeedbackMessage(''), 3000);
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

  const handleEquipmentChange = (key: 'none' | 'chaise' | 'poids_8kg' | 'corde_a_sauter') => {
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

  // Helper formatting mm:ss
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = Math.round(totalSecs % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  // Group intervals for session summary
  const summaryPlanGroups = useMemo(() => {
    if (intervals.length === 0) return null;
    
    const warmups = intervals.filter(inv => inv.stage === 'warmup' && inv.type === 'work');
    const mains = intervals.filter(inv => inv.stage === 'main' && inv.type === 'work');
    const finishers = intervals.filter(inv => inv.stage === 'finisher' && inv.type === 'work');

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
      numRounds,
      hasTwoBlocks,
      circuit1Exercises,
      circuit2Exercises,
      numRounds1,
      numRounds2,
      totalWarmup: warmups.length,
      totalMainCircuit: circuitExercises.length,
      totalFinishers: finishers.length,
    };
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

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#FF6321] selection:text-white">
      {/* HEADER BAR */}
      <header className="border-b border-white/10 bg-[#050505]/95 backdrop-blur-md sticky top-0 z-50 py-5 px-6 sm:px-8">
        <div id="app-header" className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6321] rounded-full flex items-center justify-center shrink-0">
              <div className="w-4 h-4 bg-white rotate-45"></div>
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-display font-black tracking-tighter uppercase text-white flex items-center gap-1.5">
                Marathon PPG Coach
              </h1>
              <span className="text-[10px] text-white/50 tracking-widest font-black uppercase block">
                Session Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-6 text-xs font-semibold uppercase tracking-[0.15em]">
              <button
                id="tab-workout"
                onClick={() => setActiveTab('workout')}
                className={`py-1 transition-all relative cursor-pointer ${
                  activeTab === 'workout' 
                    ? 'text-[#FF6321] font-bold border-b-2 border-[#FF6321]' 
                    : 'text-white/50 hover:text-white border-b-2 border-transparent'
                }`}
              >
                Séance
              </button>
              <button
                id="tab-guide"
                onClick={() => setActiveTab('guide')}
                className={`py-1 transition-all relative cursor-pointer ${
                  activeTab === 'guide' 
                    ? 'text-[#FF6321] font-bold border-b-2 border-[#FF6321]' 
                    : 'text-white/50 hover:text-white border-b-2 border-transparent'
                }`}
              >
                Guide Prévention
              </button>
            </div>

            {/* Mute button */}
            <button
              id="btn-toggle-sound"
              onClick={() => setSoundEnabled(prev => !prev)}
              title={soundEnabled ? "Couper le son" : "Activer le son"}
              className={`p-2.5 rounded-full border transition-all ${
                soundEnabled 
                  ? 'bg-white/5 border-white/10 hover:border-white/30 text-white/85 hover:text-white' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400 hover:text-red-350'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* DYNAMIC FEEDBACK TOAST */}
      {feedbackMessage && (
        <div className="bg-[#FF6321] text-black font-extrabold text-xs sm:text-sm text-center py-2 px-4 shadow-lg sticky top-0 z-40 transition-all uppercase tracking-wider">
          {feedbackMessage}
        </div>
      )}

      {activeTab === 'guide' ? (
        /* BIOMECHANICAL PREVENTION GUIDE TAB */
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2.5">
              <Shield className="text-[#FF6321] w-6 h-6" />
              Pourquoi cette préparation physique spécifique (PPG) ?
            </h2>
            <p className="text-sm text-white/60 leading-relaxed font-sans">
              La majorité des marathoniens s'entraînent uniquement en courant. Pourtant, après 3 heures de foulées répétées, le système neuromusculaire fatigue et les déséquilibres apparaissent :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
                <span className="text-2xl">🦵</span>
                <h3 className="font-display font-bold text-white text-base tracking-tight uppercase">Les Crampes aux Mollets</h3>
                <p className="text-xs text-white/50 leading-relaxed font-sans">
                  Le muscle <i>Soléaire</i> encaisse jusqu'à 8 fois le poids du corps à chaque impact. S'il n'est pas entraîné en endurance de force (extensions de mollets assis) et en freinage excentrique lent (extensions de mollets debout), il se tétanise après le 30ème km.
                </p>
              </div>

              <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
                <span className="text-2xl">💥</span>
                <h3 className="font-display font-bold text-white text-base tracking-tight uppercase">Les Adducteurs</h3>
                <p className="text-xs text-white/50 leading-relaxed font-sans">
                  Les adducteurs stabilisent le bassin pour empêcher son oscillation latérale. Des adducteurs fatigués ou faibles entraînent une déstabilisation du genou et tirent sur la rotule, créant des spasmes douloureux. Le <b>Copenhagen Plank</b> est l'exercice de référence universel.
                </p>
              </div>

              <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-3">
                <span className="text-2xl">🛡️</span>
                <h3 className="font-display font-bold text-white text-base tracking-tight uppercase">La Sangle Abdominale</h3>
                <p className="text-xs text-white/50 leading-relaxed font-sans">
                  Le gainage maintient votre posture droite. Quand les abdominaux s'effondrent, le bassin bascule en antéversion, modifiant l'angle d'impact au sol des jambes, ce qui surcharge instantanément les mollets et déclenche les crampes reflexe.
                </p>
              </div>
            </div>

            <div className="bg-[#FF6321]/5 border border-[#FF6321]/20 p-5 rounded-xl text-xs text-[#FF6321] flex items-start gap-3">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block uppercase tracking-wider mb-0.5">Fréquence Recommandée</span>
                <p className="leading-relaxed text-white/80">
                  Réalisez ce circuit de 30 minutes 2 fois par semaine en période de préparation marathon (jusqu'à 10 jours avant l'épreuve). Les fibres musculaires mettront environ 3 semaines pour se restructurer solidement. Bien respirer et s'hydrater activement.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={() => setActiveTab('workout')}
                className="px-8 h-12 rounded-full bg-[#FF6321] hover:bg-[#FF6321]/90 text-black font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                Accéder au configurateur <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* WORKOUT TAB */
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
          
          {/* 1. CONFIGURATION SCREEN */}
          {workoutState === 'config' && (
            <div id="panel-config" className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fade-in">
              <div className="text-center max-w-xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-[#FF6321]/15 text-[#FF6321] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#FF6321]/20">
                  <Flame className="w-3.5 h-3.5" /> Programme de {config.durationMinutes || 30} minutes spécifique
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
                  Préparez votre corps face au 30è KM
                </h2>
                <p className="text-xs sm:text-sm text-white/55 leading-relaxed font-sans max-w-lg mx-auto">
                  Cette séance de préparation physique à domicile va assembler automatiquement un circuit adapté d'échauffement, de renforcement de haute précision (mollets, adducteurs, gainage) et de finisher postural.
                </p>
              </div>

              {/* EQUIPMENT CHOICES checkboxes */}
              <div className="space-y-4">
                <label className="text-xs font-semibold tracking-widest text-white/50 uppercase block">
                  1. Matériel disponible à la maison
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    id="chk-eq-none"
                    onClick={() => handleEquipmentChange('none')}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      config.equipment.none 
                        ? 'bg-white/15 border-[#FF6321]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🧘</span>
                      <div>
                        <span className="font-display font-bold text-sm block text-white">Aucun matériel</span>
                        <span className="text-[10px] text-white/40 font-medium">Poids du corps</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                      config.equipment.none ? 'bg-[#FF6321] border-[#FF6321] text-black' : 'border-white/20'
                    }`}>
                      {config.equipment.none && <Check className="w-3 h-3 stroke-[4]" />}
                    </div>
                  </button>

                  <button
                    id="chk-eq-chaise"
                    onClick={() => handleEquipmentChange('chaise')}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      config.equipment.chaise 
                        ? 'bg-white/15 border-[#FF6321]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🪑</span>
                      <div>
                        <span className="font-display font-bold text-sm block text-white">Chaise robuste</span>
                        <span className="text-[10px] text-white/40 font-medium font-mono">Copenhagen Plank</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                      config.equipment.chaise ? 'bg-[#FF6321] border-[#FF6321] text-black' : 'border-white/20'
                    }`}>
                      {config.equipment.chaise && <Check className="w-3 h-3 stroke-[4]" />}
                    </div>
                  </button>

                  <button
                    id="chk-eq-weight"
                    onClick={() => handleEquipmentChange('poids_8kg')}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      config.equipment.poids_8kg 
                        ? 'bg-white/15 border-[#FF6321]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏋️</span>
                      <div>
                        <span className="font-display font-bold text-sm block text-white">Poids de 8kg</span>
                        <span className="text-[10px] text-white/40 font-medium font-mono">Haltère, kettlebell, eau</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                      config.equipment.poids_8kg ? 'bg-[#FF6321] border-[#FF6321] text-black' : 'border-white/20'
                    }`}>
                      {config.equipment.poids_8kg && <Check className="w-3 h-3 stroke-[4]" />}
                    </div>
                  </button>

                  <button
                    id="chk-eq-corde"
                    onClick={() => handleEquipmentChange('corde_a_sauter')}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      config.equipment.corde_a_sauter 
                        ? 'bg-white/15 border-[#FF6321]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🪢</span>
                      <div>
                        <span className="font-display font-bold text-sm block text-white">Corde à sauter</span>
                        <span className="text-[10px] text-white/40 font-medium font-mono">Option sauts & élastique</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                      config.equipment.corde_a_sauter ? 'bg-[#FF6321] border-[#FF6321] text-black' : 'border-white/20'
                    }`}>
                      {config.equipment.corde_a_sauter && <Check className="w-3 h-3 stroke-[4]" />}
                    </div>
                  </button>
                </div>
              </div>

              {/* PACE SELECTION TIMERS */}
              <div className="space-y-4">
                <label className="text-xs font-semibold tracking-widest text-white/50 uppercase block">
                  2. Choix du rythme de l'entraînement
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    id="rad-rythme-equilibre"
                    onClick={() => setConfig(prev => ({ ...prev, rythme: 'equilibre' }))}
                    className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                      config.rythme === 'equilibre'
                        ? 'bg-white/10 border-emerald-500 shadow-lg shadow-emerald-950/10'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 rounded-full w-4 h-4 border flex items-center justify-center shrink-0 ${
                        config.rythme === 'equilibre' ? 'border-emerald-500 bg-emerald-500' : 'border-white/30'
                      }`}>
                        {config.rythme === 'equilibre' && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </div>
                      <div>
                        <span className="font-display font-bold text-sm block text-emerald-400 uppercase tracking-tight">Mode Équilibré (30s / 30s)</span>
                        <span className="text-xs text-white/60 leading-relaxed block mt-2">
                          30 secondes d'effort concentré suivies de 30 secondes de récupération active. Évite l'excès d'acide lactique tout en prolongeant l'impact aérobie.
                        </span>
                      </div>
                    </div>
                  </button>

                  <button
                    id="rad-rythme-intense"
                    onClick={() => setConfig(prev => ({ ...prev, rythme: 'intense' }))}
                    className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                      config.rythme === 'intense'
                        ? 'bg-white/10 border-[#FF6321] shadow-lg shadow-orange-950/10'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 rounded-full w-4 h-4 border flex items-center justify-center shrink-0 ${
                        config.rythme === 'intense' ? 'border-[#FF6321] bg-[#FF6321]' : 'border-white/30'
                      }`}>
                        {config.rythme === 'intense' && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </div>
                      <div>
                        <span className="font-display font-bold text-sm block text-[#FF6321] uppercase tracking-tight">Mode Intense (40s / 20s)</span>
                        <span className="text-xs text-white/60 leading-relaxed block mt-2">
                          40 secondes d'effort intensifié pour seulement 20 secondes de repos. Simule la détresse neuromusculaire de fin de marathon.
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* DURATION SELECTION */}
              <div className="space-y-4">
                <label className="text-xs font-semibold tracking-widest text-white/50 uppercase block">
                  3. Durée totale de la séance
                </label>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <span className="font-display font-bold text-lg text-white">
                        {config.durationMinutes || 30} minutes
                      </span>
                      <span className="text-xs text-white/55 block font-sans">
                        Comprend l'échauffement spécifique et le finisher d'intensité.
                      </span>
                    </div>
                    {/* Presets */}
                    <div className="flex flex-wrap gap-2">
                      {[15, 20, 30, 45, 60].map(mins => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setConfig(prev => ({ ...prev, durationMinutes: mins }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer transition ${
                            (config.durationMinutes || 30) === mins
                              ? 'bg-[#FF6321] text-black shadow-lg shadow-[#FF6321]/10'
                              : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                          }`}
                        >
                          {mins} min
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Slider input */}
                  <div className="space-y-2 pt-2">
                    <input
                      type="range"
                      min="15"
                      max="60"
                      step="5"
                      value={config.durationMinutes || 30}
                      onChange={(e) => setConfig(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) }))}
                      className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#FF6321]"
                    />
                    <div className="flex justify-between text-[10px] text-white/40 font-mono uppercase tracking-wider">
                      <span>15 Min (Express)</span>
                      <span>30 Min (Idéal)</span>
                      <span>45 Min (Avancé)</span>
                      <span>60 Min (Expert)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BLOCKS SELECTION */}
              <div className="space-y-4">
                <label className="text-xs font-semibold tracking-widest text-white/50 uppercase block">
                  3b. Organisation du circuit principal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, numBlocks: 1 }))}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      (config.numBlocks || 1) === 1
                        ? 'bg-white/10 border-[#FF6321] text-white shadow-lg shadow-[#FF6321]/5'
                        : 'bg-white/5 border-white/5 text-white/45 hover:bg-white/8 hover:text-white/70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 rounded-full w-4 h-4 border flex items-center justify-center shrink-0 ${
                        (config.numBlocks || 1) === 1 ? 'border-[#FF6321] bg-[#FF6321]' : 'border-white/30'
                      }`}>
                        {(config.numBlocks || 1) === 1 && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </div>
                      <div>
                        <span className="font-display font-bold text-xs sm:text-sm block text-[#FF6321] uppercase tracking-tight">1 Seul Circuit</span>
                        <span className="text-[11px] sm:text-xs text-white/60 leading-relaxed block mt-2">
                          Un seul circuit répété sur plusieurs rounds. Idéal pour mémoriser les gestes.
                        </span>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, numBlocks: 2 }))}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      (config.numBlocks || 1) === 2
                        ? 'bg-white/10 border-[#FF6321] text-white shadow-lg shadow-[#FF6321]/5'
                        : 'bg-white/5 border-white/5 text-white/45 hover:bg-white/8 hover:text-white/70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 rounded-full w-4 h-4 border flex items-center justify-center shrink-0 ${
                        (config.numBlocks || 1) === 2 ? 'border-[#FF6321] bg-[#FF6321]' : 'border-white/30'
                      }`}>
                        {(config.numBlocks || 1) === 2 && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                      </div>
                      <div>
                        <span className="font-display font-bold text-xs sm:text-sm block text-[#FF6321] uppercase tracking-tight">2 Circuits Distincts (Bloc A & B)</span>
                        <span className="text-[11px] sm:text-xs text-white/60 leading-relaxed block mt-2">
                          Sépare la séance en deux blocs différents, sans doublons d'un bloc à l'autre. Moins monotone !
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* INDIVIDUAL EXERCISE SELECTION CHECKBOXES */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label className="text-xs font-semibold tracking-widest text-white/50 uppercase block">
                    4. Exercices possibles à inclure ({previewExercises.length} sélectionnés)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectAllExercises(true)}
                      className="text-[10px] text-[#FF6321] hover:underline uppercase tracking-wider font-extrabold cursor-pointer"
                    >
                      Tout inclure
                    </button>
                    <span className="text-white/20 text-xs">|</span>
                    <button
                      type="button"
                      onClick={() => handleSelectAllExercises(false)}
                      className="text-[10px] text-[#FF6321] hover:underline uppercase tracking-wider font-extrabold cursor-pointer"
                    >
                      Tout exclure
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {compatibleExercises.map((ex) => {
                    const isSelected = (config.selectedExerciseIds || EXERCISE_DATABASE.map(e => e.id)).includes(ex.id);
                    const bodyPart = getBodyPart(ex);
                    const partEmoji = bodyPart === 'bras' ? '💪' : bodyPart === 'abdos' ? '🧘' : '🦵';
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => toggleExerciseSelection(ex.id)}
                        className={`flex items-start text-left gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white/10 border-[#FF6321] shadow-lg shadow-[#FF6321]/5 text-white'
                            : 'bg-white/5 border-white/5 text-white/45 hover:bg-white/8 hover:text-white/70'
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                          isSelected ? 'bg-[#FF6321] border-[#FF6321] text-black' : 'border-white/20 bg-[#050505]'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[4]" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5 font-display font-bold text-sm tracking-tight">
                            <span>{ex.name}</span>
                            <span className="shrink-0 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-md text-[10px] font-mono flex items-center gap-1 text-white/75 font-normal">
                              {partEmoji} {bodyPart.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#FF6321] block font-mono uppercase tracking-wider">{ex.target}</span>
                          <p className="text-xs leading-relaxed font-sans mt-1 opacity-85">{ex.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ACTION BUILT LAUNCHERS */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  id="btn-test-beep"
                  onClick={testBeeps}
                  className="text-xs text-white/60 hover:text-white flex items-center gap-2 bg-white/5 hover:bg-white/10 w-full sm:w-auto px-5 h-12 rounded-full border border-white/10 hover:border-white/20 transition-all font-bold uppercase tracking-wider justify-center cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-[#FF6321]" /> Tester le bip audio
                </button>

                <button
                  id="btn-generate-launch"
                  onClick={handleGenerateWorkoutPlan}
                  className="w-full sm:w-auto bg-[#FF6321] hover:bg-[#FF6321]/95 text-black font-extrabold px-10 h-14 rounded-full shadow-lg shadow-[#FF6321]/15 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-widest cursor-pointer"
                >
                  <Activity className="w-4 h-4 shrink-0" /> Generer le plan de seance
                </button>
              </div>
            </div>
          )}

          {/* 1.5. SESSION PLAN SUMMARY SCREEN */}
          {workoutState === 'summary' && summaryPlanGroups && (
            <div id="panel-summary" className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in text-white">
              <div className="text-center max-w-xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-[#FF6321]/15 text-[#FF6321] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#FF6321]/20">
                  📋 Confirmation de séance
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight uppercase">
                  Résumé du Plan de Séance d'Entraînement
                </h2>
                <p className="text-xs sm:text-sm text-white/55 leading-relaxed font-sans">
                  Voici l'ordonnancement optimal de vos {config.durationMinutes || 30} minutes de PPG spécifique. Vous pouvez ré-organiser les exercices ou retourner ajuster vos choix.
                </p>
              </div>

              {/* STATS OVERVIEW CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                  <span className="text-[10px] text-white/40 uppercase font-black font-mono tracking-widest block">Durée Totale</span>
                  <span className="text-xl font-bold font-display text-white">{config.durationMinutes || 30} minutes</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                  <span className="text-[10px] text-white/40 uppercase font-black font-mono tracking-widest block">Rythme d'effort</span>
                  <span className="text-xl font-bold font-display text-[#FF6321] uppercase text-xs sm:text-sm md:text-base lg:text-xl">
                    {config.rythme === 'equilibre' ? 'Équilibré (30s/30s)' : 'Intense (40s/20s)'}
                  </span>
                </div>
                <div className="bg-[#FF6321]/5 border border-[#FF6321]/20 p-4 rounded-xl text-center">
                  <span className="text-[10px] text-[#FF6321]/80 uppercase font-black font-mono tracking-widest block">Exercices Distincts</span>
                  <span className="text-xl font-bold font-display text-white">
                    {summaryPlanGroups.circuitExercises.length + summaryPlanGroups.finishers.length} exercices
                  </span>
                </div>
              </div>

              {/* TIMELINE PREVIEW */}
              <div className="space-y-4">
                {/* stage 1: Warmup */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
                    <span className="text-sm">🔥</span>
                    <h3 className="text-xs uppercase text-emerald-400 font-bold tracking-widest flex items-center justify-between w-full">
                      <span>Phase Échauffement : Progressive ({summaryPlanGroups.totalWarmup} minutes)</span>
                      <span className="text-[10px] text-white/40 normal-case font-normal font-sans">Cliquez sur un exercice pour voir les consignes</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {summaryPlanGroups.warmups.map((item, idx) => {
                      const bPart = item.exercise ? getBodyPart(item.exercise) : 'jambes';
                      const emoji = bPart === 'bras' ? '💪' : bPart === 'abdos' ? '🧘' : '🦵';
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => item.exercise && setSelectedSummaryExercise(item.exercise)}
                          className="bg-white/3 p-3 rounded-xl border border-white/5 hover:bg-white/8 hover:border-white/12 active:scale-98 transition-all cursor-pointer text-left w-full group relative focus:outline-none focus:ring-1 focus:ring-[#FF6321] min-w-0 text-xs"
                          title="Cliquez pour voir les consignes de l'exercice"
                        >
                          <div className="flex items-start gap-2 min-w-0 w-full">
                            <span className="text-white/40 font-mono font-bold w-4 shrink-0 mt-0.5">{idx + 1}.</span>
                            <div className="leading-tight flex-1 min-w-0">
                              <div className="font-bold flex items-start justify-between gap-1.5 text-white/90 group-hover:text-[#FF6321] transition-colors">
                                <span className="break-words whitespace-normal leading-tight">{item.title.replace('Échauffement : ', '')}</span>
                                <span className="text-[10px] bg-white/5 px-1 py-0.5 rounded text-white/50 shrink-0 select-none">{emoji}</span>
                              </div>
                              <span className="text-[10px] text-white/40 font-mono block mt-1 break-words whitespace-normal leading-tight">{item.target}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* stage 2: Main Circuit */}
                <div className="space-y-4">
                  {summaryPlanGroups.hasTwoBlocks ? (
                    <>
                      {/* Block A */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
                          <span className="text-sm">⚡</span>
                          <h3 className="text-xs uppercase text-[#FF6321] font-bold tracking-widest flex items-center justify-between w-full">
                            <span>Circuit Bloc A : {summaryPlanGroups.numRounds1} {summaryPlanGroups.numRounds1 > 1 ? 'Rounds' : 'Round'} du Circuit ({summaryPlanGroups.circuit1Exercises.length * summaryPlanGroups.numRounds1} minutes)</span>
                            <span className="text-[10px] text-white/40 normal-case font-normal font-sans">Cliquez pour voir les consignes</span>
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {summaryPlanGroups.circuit1Exercises.map((item, idx) => {
                            const bPart = item.exercise ? getBodyPart(item.exercise) : 'jambes';
                            const emoji = bPart === 'bras' ? '💪' : bPart === 'abdos' ? '🧘' : '🦵';
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => item.exercise && setSelectedSummaryExercise(item.exercise)}
                                className="bg-white/3 p-3 rounded-xl border border-white/5 hover:bg-white/8 hover:border-white/12 active:scale-98 transition-all cursor-pointer text-left w-full group relative focus:outline-none focus:ring-1 focus:ring-[#FF6321] min-w-0 text-xs"
                                title="Cliquez pour voir les consignes de l'exercice"
                              >
                                <div className="flex items-start gap-2.5 min-w-0 w-full">
                                  <span className="text-[#FF6321]/85 font-mono font-semibold w-5 h-5 bg-[#FF6321]/10 rounded flex items-center justify-center shrink-0 border border-[#FF6321]/20 text-[10px] mt-0.5">
                                    A{idx + 1}
                                  </span>
                                  <div className="leading-tight flex-1 min-w-0">
                                    <div className="font-bold flex items-start justify-between gap-1.5 text-white group-hover:text-[#FF6321] transition-colors">
                                      <span className="break-words whitespace-normal leading-tight">{item.title}</span>
                                      <span className="text-[10px] bg-white/5 px-1 py-0.5 rounded text-white/50 shrink-0 select-none">{emoji}</span>
                                    </div>
                                    <span className="text-[10px] text-[#FF6321] font-bold font-mono tracking-wider block mt-1 break-words whitespace-normal leading-tight">{item.target.split(' - ')[0]}</span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Block B */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
                          <span className="text-sm">⚡</span>
                          <h3 className="text-xs uppercase text-orange-400 font-bold tracking-widest flex items-center justify-between w-full">
                            <span>Circuit Bloc B : {summaryPlanGroups.numRounds2} {summaryPlanGroups.numRounds2 > 1 ? 'Rounds' : 'Round'} du Circuit ({summaryPlanGroups.circuit2Exercises.length * summaryPlanGroups.numRounds2} minutes)</span>
                            <span className="text-[10px] text-white/40 normal-case font-normal font-sans">Cliquez pour voir les consignes</span>
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {summaryPlanGroups.circuit2Exercises.map((item, idx) => {
                            const bPart = item.exercise ? getBodyPart(item.exercise) : 'jambes';
                            const emoji = bPart === 'bras' ? '💪' : bPart === 'abdos' ? '🧘' : '🦵';
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => item.exercise && setSelectedSummaryExercise(item.exercise)}
                                className="bg-white/3 p-3 rounded-xl border border-white/5 hover:bg-white/8 hover:border-white/12 active:scale-98 transition-all cursor-pointer text-left w-full group relative focus:outline-none focus:ring-1 focus:ring-[#FF6321] min-w-0 text-xs"
                                title="Cliquez pour voir les consignes de l'exercice"
                              >
                                <div className="flex items-start gap-2.5 min-w-0 w-full">
                                  <span className="text-orange-400 font-mono font-semibold w-5 h-5 bg-orange-400/10 rounded flex items-center justify-center shrink-0 border border-orange-400/20 text-[10px] mt-0.5">
                                    B{idx + 1}
                                  </span>
                                  <div className="leading-tight flex-1 min-w-0">
                                    <div className="font-bold flex items-start justify-between gap-1.5 text-white group-hover:text-orange-400 transition-colors">
                                      <span className="break-words whitespace-normal leading-tight">{item.title}</span>
                                      <span className="text-[10px] bg-white/5 px-1 py-0.5 rounded text-white/50 shrink-0 select-none">{emoji}</span>
                                    </div>
                                    <span className="text-[10px] text-orange-400 font-bold font-mono tracking-wider block mt-1 break-words whitespace-normal leading-tight">{item.target.split(' - ')[0]}</span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
                        <span className="text-sm">⚡</span>
                        <h3 className="text-xs uppercase text-[#FF6321] font-bold tracking-widest flex items-center justify-between w-full">
                          <span>Circuit Principal : {summaryPlanGroups.numRounds} {summaryPlanGroups.numRounds > 1 ? 'Rounds' : 'Round'} du Circuit ({summaryPlanGroups.totalMainCircuit * summaryPlanGroups.numRounds} minutes)</span>
                          <span className="text-[10px] text-white/40 normal-case font-normal font-sans">Cliquez pour voir les consignes</span>
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {summaryPlanGroups.circuitExercises.map((item, idx) => {
                          const bPart = item.exercise ? getBodyPart(item.exercise) : 'jambes';
                          const emoji = bPart === 'bras' ? '💪' : bPart === 'abdos' ? '🧘' : '🦵';
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => item.exercise && setSelectedSummaryExercise(item.exercise)}
                              className="bg-white/3 p-3 rounded-xl border border-white/5 hover:bg-white/8 hover:border-white/12 active:scale-98 transition-all cursor-pointer text-left w-full group relative focus:outline-none focus:ring-1 focus:ring-[#FF6321] min-w-0 text-xs"
                              title="Cliquez pour voir les consignes de l'exercice"
                            >
                              <div className="flex items-start gap-2.5 min-w-0 w-full">
                                <span className="text-[#FF6321]/80 font-mono font-semibold w-5 h-5 bg-[#FF6321]/10 rounded flex items-center justify-center shrink-0 border border-[#FF6321]/20 text-[10px] mt-0.5">
                                  {idx + 1}
                                </span>
                                <div className="leading-tight flex-1 min-w-0">
                                  <div className="font-bold flex items-start justify-between gap-1.5 text-white group-hover:text-[#FF6321] transition-colors">
                                    <span className="break-words whitespace-normal leading-tight">{item.title}</span>
                                    <span className="text-[10px] bg-white/5 px-1 py-0.5 rounded text-white/50 shrink-0 select-none">{emoji}</span>
                                  </div>
                                  <span className="text-[10px] text-[#FF6321] font-bold font-mono tracking-wider block mt-1 break-words whitespace-normal leading-tight">{item.target.split(' - ')[0]}</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* stage 3: Finisher */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
                    <span className="text-sm">🏁</span>
                    <h3 className="text-xs uppercase text-red-400 font-bold tracking-widest flex items-center justify-between w-full">
                      <span>Dernière ligne droite : Le Finisher ({summaryPlanGroups.totalFinishers} minutes)</span>
                      <span className="text-[10px] text-white/40 normal-case font-normal font-sans">Cliquez pour voir les consignes</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {summaryPlanGroups.finishers.map((item, idx) => {
                      const bPart = item.exercise ? getBodyPart(item.exercise) : 'jambes';
                      const emoji = bPart === 'bras' ? '💪' : bPart === 'abdos' ? '🧘' : '🦵';
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => item.exercise && setSelectedSummaryExercise(item.exercise)}
                          className="bg-white/3 p-3 rounded-xl border border-white/5 hover:bg-white/8 hover:border-white/12 active:scale-98 transition-all cursor-pointer text-left w-full group relative focus:outline-none focus:ring-1 focus:ring-[#FF6321] min-w-0 text-xs"
                          title="Cliquez pour voir les consignes de l'exercice"
                        >
                          <div className="flex items-start gap-2 min-w-0 w-full">
                            <span className="text-red-400 font-mono font-bold w-4 shrink-0 mt-0.5">F{idx + 1}.</span>
                            <div className="leading-tight flex-1 min-w-0">
                              <div className="font-bold flex items-start justify-between gap-1.5 text-white group-hover:text-red-400 transition-colors">
                                <span className="break-words whitespace-normal leading-tight">{item.title}</span>
                                <span className="text-[10px] bg-white/5 px-1 py-0.5 rounded text-white/50 shrink-0 select-none">{emoji}</span>
                              </div>
                              <span className="text-[10px] text-white/45 font-mono block mt-1 break-words whitespace-normal leading-tight">{item.target}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SUMMARY ACTIONS */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleBackToConfig}
                  className="w-full sm:w-auto text-xs text-white/70 hover:text-white flex items-center gap-2 bg-white/5 hover:bg-white/10 px-6 h-12 rounded-full border border-white/10 hover:border-white/20 transition-all font-bold uppercase tracking-wider justify-center cursor-pointer font-sans"
                >
                  <ArrowLeft className="w-4 h-4 text-[#FF6321]" /> Modifier la configuration
                </button>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleRefleshPlan}
                    className="w-full sm:w-auto text-xs text-white/70 hover:text-white flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 h-12 rounded-full border border-white/10 hover:border-white/20 transition-all font-bold uppercase tracking-wider justify-center cursor-pointer font-sans"
                    title="Mélanger l'ordre des exercices pour une nouvelle séance aléatoire"
                  >
                    🔄 Régénérer l'ordre
                  </button>

                  <button
                    type="button"
                    onClick={handleLaunchWorkout}
                    className="w-full sm:w-auto bg-[#FF6321] hover:bg-[#FF6321]/95 text-black font-extrabold px-10 h-12 rounded-full shadow-lg shadow-[#FF6321]/15 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-widest cursor-pointer font-sans animate-pulse"
                  >
                    <Play className="w-4 h-4 fill-black shrink-0" /> Lancer l'entraînement !
                  </button>
                </div>
              </div>

              {/* EXERCISE DETAIL POPUP MODAL */}
              {selectedSummaryExercise && (
                <div 
                  className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
                  onClick={() => setSelectedSummaryExercise(null)}
                >
                  <div 
                    className="bg-[#121212] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close button top right */}
                    <button
                      type="button"
                      onClick={() => setSelectedSummaryExercise(null)}
                      className="absolute top-4 right-4 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer focus:outline-none"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-0.5 bg-[#FF6321]/15 border border-[#FF6321]/30 text-[#FF6321] text-[10px] font-bold uppercase rounded-md tracking-wider font-mono">
                          {selectedSummaryExercise.target}
                        </span>
                        <span className="px-3 py-0.5 bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold uppercase rounded-md tracking-wider font-mono">
                          {getBodyPart(selectedSummaryExercise) === 'bras' ? '💪 Bras' : getBodyPart(selectedSummaryExercise) === 'abdos' ? '🧘 Abdos' : '🦵 Jambes'}
                        </span>
                        {selectedSummaryExercise.equipmentRequired.length > 0 ? (
                          selectedSummaryExercise.equipmentRequired.map(eq => (
                            <span key={eq} className="px-3 py-0.5 bg-orange-400/15 border border-orange-400/30 text-orange-400 text-[10px] font-bold uppercase rounded-md tracking-wider font-mono">
                              🛠️ {eq === 'poids_8kg' ? 'Poids 8kg' : eq === 'chaise' ? 'Chaise' : eq === 'corde_a_sauter' ? 'Corde à sauter' : eq}
                            </span>
                          ))
                        ) : (
                          <span className="px-3 py-0.5 bg-emerald-400/15 border border-emerald-400/30 text-emerald-400 text-[10px] font-bold uppercase rounded-md tracking-wider font-mono">
                            🍃 Poids de corps
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight leading-tight uppercase pr-8">
                        {selectedSummaryExercise.name}
                      </h3>
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-4 text-left">
                      {/* Description */}
                      <div className="space-y-1">
                        <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold font-mono">Description du mouvement</h4>
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                          {selectedSummaryExercise.description}
                        </p>
                      </div>

                      {/* Tips */}
                      {selectedSummaryExercise.tips && (
                        <div className="bg-white/3 border border-white/5 rounded-2xl p-4 space-y-1.5">
                          <h4 className="text-[10px] uppercase tracking-widest text-[#FF6321] font-extrabold font-mono flex items-center gap-1.5">
                            <span>💡</span> Conseils d'exécution
                          </h4>
                          <p className="text-xs text-white/85 leading-relaxed font-sans">
                            {selectedSummaryExercise.tips}
                          </p>
                        </div>
                      )}

                      {/* Instruction Highlight */}
                      {selectedSummaryExercise.instructionHighlight && (
                        <div className="bg-[#FF6321]/5 border border-[#FF6321]/25 rounded-2xl p-4 space-y-1">
                          <h4 className="text-[10px] uppercase tracking-widest text-[#FF6321] font-bold font-mono flex items-center gap-1.5">
                            <span>🚨</span> Consigne d'or
                          </h4>
                          <p className="text-xs text-[#FF6321] font-bold leading-relaxed font-mono">
                            {selectedSummaryExercise.instructionHighlight}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedSummaryExercise(null)}
                      className="w-full bg-[#FF6321] hover:bg-[#FF6321]/90 text-black font-extrabold py-3 rounded-xl transition-all uppercase tracking-widest text-xs cursor-pointer focus:outline-none"
                    >
                      Compris, fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. ACTIVE SESSION WORKOUT PLAYER SCREEN */}
          {workoutState === 'active' && activeInterval && (
            <div id="panel-player" className="space-y-4 md:space-y-6 animate-fade-in text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
                <button
                  id="btn-quit-session"
                  onClick={resetWorkout}
                  className="text-xs text-white/50 hover:text-white flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/25 px-4 h-10 rounded-full transition-all cursor-pointer self-start font-sans"
                >
                  ✖ Abandonner l'entraînement
                </button>

                <div className="flex items-center gap-2 sm:self-center">
                  <span className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full border ${
                    activeInterval.stage === 'warmup'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : activeInterval.stage === 'main'
                      ? 'bg-[#FF6321]/10 text-[#FF6321] border-[#FF6321]/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/25'
                  }`}>
                    {activeInterval.stage === 'warmup' ? '🔥 Échauffement' : activeInterval.stage === 'main' ? '⚡ Circuit Principal' : '🏁 Le Finisher'}
                  </span>

                  {activeInterval.roundNumber && (
                    <span className="text-[10px] sm:text-xs font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/70">
                      ROND {activeInterval.roundNumber}/{activeBlockTotalRounds || 2}
                    </span>
                  )}
                </div>
              </div>

              {/* TWO PANEL GRID (Left: Player / Right: Step Playlist Checklist) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* LEFT: Central Player card + controls */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                  {/* CENTRAL BLOCK PROGRESS CARD */}
                  <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 sm:p-10 md:p-12 shadow-2xl overflow-hidden flex flex-col items-center text-center">
                    {/* Visual pulsating background lights representing target */}
                    <div className={`absolute inset-0 filter blur-3xl pointer-events-none transition-all duration-700 opacity-20 ${
                      activeInterval.isRoundTransition || activeInterval.isBlockTransition
                        ? 'bg-amber-500/25'
                        : activeInterval.type === 'work' 
                        ? 'bg-[#FF6321]/15' 
                        : 'bg-emerald-500/15'
                    }`} />

                    <div className="relative z-10 w-full space-y-4 sm:space-y-6">
                      {/* Timer Circular visualizer svg */}
                      <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto flex items-center justify-center font-sans">
                        <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                          {/* Gray track background */}
                          <circle
                            className="text-white/5"
                            strokeWidth="5"
                            stroke="currentColor"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                          />
                          {/* Vibrant dynamic stroke */}
                          <circle
                            className={`transition-all duration-100 ease-linear ${
                              activeInterval.isRoundTransition || activeInterval.isBlockTransition
                                ? 'text-amber-400'
                                : activeInterval.type === 'work' ? 'text-[#FF6321]' : 'text-emerald-400'
                            }`}
                            strokeWidth="5"
                            strokeDasharray="263.89"
                            strokeDashoffset={263.89 * (1 - (secondsRemaining / activeInterval.duration))}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                          />
                        </svg>

                        {/* Timer content label */}
                        <div className="text-center space-y-0.5 sm:space-y-1 relative">
                          {activeInterval.roundNumber && (
                            <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest block font-mono leading-none pb-0.5">
                              ROUND {activeInterval.roundNumber}/{activeBlockTotalRounds || 2}
                            </span>
                          )}
                          <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] block transition ${
                            activeInterval.isRoundTransition || activeInterval.isBlockTransition
                              ? 'text-amber-400'
                              : activeInterval.type === 'work' ? 'text-[#FF6321]' : 'text-emerald-400'
                          }`}>
                            {activeInterval.isRoundTransition || activeInterval.isBlockTransition
                              ? 'Transition'
                              : activeInterval.type === 'work'
                              ? 'Travail'
                              : 'Récupération'}
                          </span>
                          <span className="text-3xl sm:text-5xl md:text-6xl font-display font-black leading-none tracking-tighter text-[#FF6321] block">
                            {secondsRemaining < 10 ? `00:0${secondsRemaining}` : `00:${secondsRemaining}`}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 font-mono block uppercase tracking-wider">
                            TEMPS {formatTime(progressMetrics.elapsedSeconds)} / {formatTime(progressMetrics.totalSeconds)}
                          </span>
                        </div>
                      </div>

                      {/* Present Exercise Details */}
                      <div className="space-y-2 sm:space-y-4 max-w-xl mx-auto">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <span className="px-3.5 py-1 bg-[#FF6321]/15 border border-[#FF6321]/30 text-[#FF6321] text-[9px] sm:text-[10px] font-bold uppercase rounded-full tracking-wider font-mono">
                            Cible : {activeInterval.target}
                          </span>
                          {activeInterval.exercise && (() => {
                            const bPart = getBodyPart(activeInterval.exercise);
                            const emoji = bPart === 'bras' ? '💪' : bPart === 'abdos' ? '🧘' : '🦵';
                            return (
                              <span className="px-3.5 py-1 bg-white/5 border border-white/10 text-white/85 text-[9px] sm:text-[10px] font-bold uppercase rounded-full tracking-wider font-mono flex items-center gap-1">
                                {emoji} {bPart.toUpperCase()}
                              </span>
                            );
                          })()}
                        </div>
                        <h3 className="text-xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight leading-none uppercase">
                          {activeInterval.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/75 font-sans max-w-xl mx-auto leading-relaxed pb-1">
                          {activeInterval.description}
                        </p>

                        {/* Truc visuel de changement de round */}
                        {activeInterval.isRoundTransition && activeInterval.roundTransitionFrom && activeInterval.roundTransitionTo && (
                          <div className="max-w-md mx-auto bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 sm:p-5 mt-4 space-y-3 shadow-xl">
                            <div className="flex items-center justify-between text-[10px] font-bold font-mono tracking-widest text-amber-400 uppercase">
                              <span>Rond {activeInterval.roundTransitionFrom} / {activeBlockTotalRounds || 2} Terminé</span>
                              <span>Rond {activeInterval.roundTransitionTo} / {activeBlockTotalRounds || 2} Suivant</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-lg flex flex-col items-center justify-center shrink-0 min-w-[64px]">
                                <span className="text-[8px] uppercase tracking-wide opacity-75">ROND {activeInterval.roundTransitionFrom}</span>
                                <span className="text-xs font-bold leading-none mt-1">Acquis ✓</span>
                              </div>

                              <div className="flex-1 space-y-1 text-center">
                                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#FF6321] transition-all duration-300 ease-out"
                                    style={{ width: `${(1 - secondsRemaining / activeInterval.duration) * 100}%` }}
                                  />
                                </div>
                                <span className="text-[9px] text-amber-400/95 font-bold block font-mono uppercase tracking-wider">Changement de Round</span>
                              </div>

                              <div className="px-3 py-1.5 bg-[#FF6321]/15 border border-[#FF6321]/30 text-[#FF6321] rounded-lg flex flex-col items-center justify-center shrink-0 min-w-[64px] animate-pulse">
                                <span className="text-[8px] uppercase tracking-wide opacity-75">ROND {activeInterval.roundTransitionTo}</span>
                                <span className="text-xs font-bold leading-none mt-1">Suivant ➔</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeInterval.isBlockTransition && (
                          <div className="max-w-md mx-auto bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 sm:p-5 mt-4 space-y-3 shadow-xl">
                            <div className="flex items-center justify-between text-[10px] font-bold font-mono tracking-widest text-orange-400 uppercase">
                              <span>Bloc A Terminé</span>
                              <span>Bloc B Suivant</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-lg flex flex-col items-center justify-center shrink-0 min-w-[64px]">
                                <span className="text-[8px] uppercase tracking-wide opacity-75">BLOC A</span>
                                <span className="text-xs font-bold leading-none mt-1">Acquis ✓</span>
                              </div>

                              <div className="flex-1 space-y-1 text-center">
                                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#FF6321] transition-all duration-300 ease-out"
                                    style={{ width: `${(1 - secondsRemaining / activeInterval.duration) * 100}%` }}
                                  />
                                </div>
                                <span className="text-[9px] text-orange-400 font-bold block font-mono uppercase tracking-wider">Changement de Bloc (+30s)</span>
                              </div>

                              <div className="px-3 py-1.5 bg-orange-400/15 border border-orange-400/30 text-orange-400 rounded-lg flex flex-col items-center justify-center shrink-0 min-w-[64px] animate-pulse">
                                <span className="text-[8px] uppercase tracking-wide opacity-75">BLOC B</span>
                                <span className="text-xs font-bold leading-none mt-1">Suivant ➔</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Coach insight advice box if effort is active */}
                      {activeInterval.exercise && (
                        <div className="hidden sm:flex bg-white/5 border border-white/10 rounded-xl p-4 text-left max-w-xl mx-auto items-start gap-4">
                          <span className="text-xl shrink-0">💡</span>
                          <div className="space-y-0.5">
                            <span className="font-bold text-xs uppercase tracking-wider text-white">Conseil de Prévention</span>
                            <p className="text-xs text-white/60 leading-relaxed font-sans">
                              {activeInterval.exercise.tips}
                            </p>
                            <span className="inline-block text-[10px] text-[#FF6321] font-mono uppercase tracking-widest font-bold pt-1">
                              ↳ {activeInterval.exercise.instructionHighlight}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Simple encouragement tip during rest stages */}
                      {!activeInterval.exercise && (
                        <div className="hidden sm:flex bg-white/5 border border-white/10 rounded-xl p-4 text-left max-w-xl mx-auto items-start gap-4">
                          <span className="text-xl shrink-0">💧</span>
                          <div className="space-y-0.5">
                            <span className="font-bold text-xs uppercase tracking-wider text-white font-sans">Hydratation & Relâchement</span>
                            <p className="text-xs text-white/60 leading-relaxed font-sans">
                              Profitez du temps imparti pour relâcher vos muscles et décrisper vos trapèzes. Inspirez profondément pour oxygéner vos fibres.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* NEXT EXERCISE PREVIEW PANEL */}
                  {nextUp && (
                    <div id="pnl-next-up" className={`border rounded-xl p-3.5 md:p-4 text-left transition duration-300 ${
                      activeInterval.type === 'rest' || activeInterval.isRoundTransition || activeInterval.isBlockTransition
                        ? 'bg-[#FF6321]/5 border-[#FF6321]/20 shadow-md shadow-[#FF6321]/5'
                        : 'bg-white/5 border border-white/10 hover:border-[#FF6321]/30'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1 pr-4">
                          <span className="text-white/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest block font-sans">
                            {activeInterval.type === 'rest' || activeInterval.isRoundTransition || activeInterval.isBlockTransition
                              ? '🚀 Prochaine Étape (À anticiper)'
                              : 'Prochaine Étape'}
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display font-bold text-xs sm:text-sm text-white uppercase tracking-tight">{nextUp.title}</span>
                            <span className="px-2.5 py-0.5 bg-[#FF6321]/15 border border-[#FF6321]/30 text-[#FF6321] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded-full font-mono">{nextUp.target}</span>
                          </div>
                          
                          {/* Rich Anticipation Detail */}
                          {nextUp.exercise && (
                            <div className="mt-2.5 space-y-1.5 text-xs text-white/70 font-sans border-t border-white/10 pt-2.5">
                              <p className="leading-relaxed">
                                <span className="font-semibold text-white/90">Cible & But :</span> {nextUp.exercise.description}
                              </p>
                              {nextUp.exercise.tips && (
                                <p className="text-white/50 text-[11px] leading-relaxed italic flex items-start gap-1">
                                  <span className="shrink-0 text-orange-400">💡</span>
                                  <span>{nextUp.exercise.tips}</span>
                                </p>
                              )}
                              {nextUp.exercise.instructionHighlight && (
                                <p className="text-[#FF6321]/90 text-[11px] font-mono font-bold leading-relaxed flex items-start gap-1">
                                  <span className="shrink-0">🚨</span>
                                  <span>Consigne : {nextUp.exercise.instructionHighlight}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#FF6321] shrink-0 mt-0.5" />
                      </div>
                    </div>
                  )}

                  {/* MEDIA CONTROLLER ACTION BAR */}
                  <div className="flex items-center justify-center gap-4 py-1">
                    <button
                      id="btn-player-prev"
                      onClick={handlePrevInterval}
                      disabled={currentIntervalIndex === 0}
                      className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <button
                      id="btn-player-playpause"
                      onClick={togglePlayPause}
                      className="px-8 sm:px-12 h-12 rounded-full bg-white text-black hover:bg-white/90 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer font-sans"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-black" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>Reprendre</span>
                        </>
                      )}
                    </button>

                    <button
                      id="btn-player-next"
                      onClick={handleNextInterval}
                      className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* GLOBAL PROGRESS MINUTE ACCUMULATIVE BAR */}
                  <div className="space-y-2">
                    {(() => {
                      const totalBlocks = Math.round(intervals.length / 2);
                      return (
                        <>
                          <div className="flex items-center justify-between text-[11px] sm:text-xs text-white/50 px-1 font-bold tracking-wider uppercase">
                            <span>Progression globale ({totalBlocks} blocs de 1 min)</span>
                            <span className="font-mono text-[#FF6321] text-xs font-bold">Minute {activeInterval.blockIndex + 1} / {totalBlocks}</span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-500 via-[#FF6321] to-red-500 transition-all duration-350"
                              style={{ width: `${((activeInterval.blockIndex + (secondsRemaining === 0 ? 1 : 0)) / totalBlocks) * 100}%` }}
                            />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* RIGHT: ALL STEPS GROUP LIST INTERACTIVE PLAYLIST */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 md:p-6 space-y-4 max-h-[660px] overflow-y-auto flex flex-col text-left">
                  <div className="border-b border-white/10 pb-3 flex flex-col">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#FF6321]">
                      📋 Déroulé de la Séance
                    </h3>
                    <p className="text-[10px] text-white/40 mt-1">Cliquez sur une étape pour y sauter directement</p>
                  </div>

                  <div className="space-y-4">
                    {(() => {
                      // Prepare groups
                      const steps = blockSteps;
                      const warmupSteps = steps.filter(s => s.stage === 'warmup');
                      const mainSteps = steps.filter(s => s.stage === 'main');
                      const finisherSteps = steps.filter(s => s.stage === 'finisher');

                      const hasSeparateBlocks = mainSteps.some(s => s.blockNumber === 2);
                      const blockASteps = hasSeparateBlocks ? mainSteps.filter(s => (s.blockNumber || 1) === 1) : [];
                      const blockBSteps = hasSeparateBlocks ? mainSteps.filter(s => s.blockNumber === 2) : [];

                      const renderStepItem = (step: typeof steps[0], labelPrefix: string) => {
                        const isPassed = step.blockIndex < activeInterval.blockIndex;
                        const isActive = step.blockIndex === activeInterval.blockIndex;
                        
                        // Icon mapping
                        const bPart = step.exercise ? getBodyPart(step.exercise) : 'jambes';
                        const emoji = bPart === 'bras' ? '💪' : bPart === 'abdos' ? '🧘' : '🦵';

                        let stateStyle = "border-white/5 bg-white/3 hover:bg-white/5 hover:border-white/10 text-white/60";
                        let ringStyle = "";

                        if (isActive) {
                          if (step.stage === 'warmup') {
                            stateStyle = "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
                            ringStyle = "ring-1 ring-emerald-500";
                          } else if (step.stage === 'finisher') {
                            stateStyle = "border-red-500/40 bg-red-500/10 text-red-300";
                            ringStyle = "ring-1 ring-red-500";
                          } else {
                            stateStyle = "border-[#FF6321]/40 bg-[#FF6321]/10 text-[#FF6321]";
                            ringStyle = "ring-1 ring-[#FF6321]";
                          }
                        } else if (isPassed) {
                          stateStyle = "border-white/5 bg-[#121212]/30 text-white/30";
                        }

                        // Label badge color
                        let badgeStyle = "bg-white/10 text-white/50";
                        if (isActive) {
                          badgeStyle = step.stage === 'warmup' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : step.stage === 'finisher' 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-[#FF6321]/20 text-[#FF6321]';
                        }

                        return (
                          <button
                            key={step.blockIndex}
                            type="button"
                            onClick={() => handleJumpToBlock(step.blockIndex)}
                            className={`w-full p-2.5 rounded-xl border flex items-center gap-2.5 text-xs text-left transition-all cursor-pointer ${stateStyle} ${ringStyle} focus:outline-none`}
                          >
                            {/* Num / status indicator */}
                            {isPassed ? (
                              <span className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-400 font-mono shrink-0">
                                ✓
                              </span>
                            ) : (
                              <span className={`w-5 h-5 rounded-md border flex items-center justify-center text-[9px] font-mono font-bold shrink-0 ${badgeStyle}`}>
                                {labelPrefix}{step.blockIndex + 1}
                              </span>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0 leading-snug">
                              <div className="font-bold flex items-center justify-between gap-1.5">
                                <span className={`truncate ${isActive ? 'text-white' : ''}`}>
                                  {step.title.replace('Échauffement : ', '')}
                                </span>
                                <span className="opacity-60 text-[10px]" title={bPart}>{emoji}</span>
                              </div>
                              <div className="text-[10px] opacity-50 truncate mt-0.5">
                                {step.target.split(' - ')[0]}
                              </div>
                            </div>
                            
                            {/* Active light indicator */}
                            {isActive && (
                              <span className="flex h-2 w-2 relative shrink-0">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                  step.stage === 'warmup' ? 'bg-emerald-400' : step.stage === 'finisher' ? 'bg-red-400' : 'bg-[#FF6321]'
                                }`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                                  step.stage === 'warmup' ? 'bg-emerald-500' : step.stage === 'finisher' ? 'bg-red-500' : 'bg-[#FF6321]'
                                }`}></span>
                              </span>
                            )}
                          </button>
                        );
                      };

                      return (
                        <div className="space-y-4">
                          {/* 1. Échauffement Section */}
                          {warmupSteps.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/80 flex items-center gap-1">
                                🔥 Echauffement ({warmupSteps.length} min)
                              </span>
                              <div className="space-y-1">
                                {warmupSteps.map(s => renderStepItem(s, ''))}
                              </div>
                            </div>
                          )}

                          {/* 2. Main Circuit / Blocks */}
                          {hasSeparateBlocks ? (
                            <>
                              {/* Bloc A */}
                              {blockASteps.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF6321]/80 flex items-center gap-1">
                                    ⚡ Bloc A ({blockASteps.length} min)
                                  </span>
                                  <div className="space-y-1">
                                    {blockASteps.map(s => renderStepItem(s, 'A'))}
                                  </div>
                                </div>
                              )}

                              {/* Bloc B */}
                              {blockBSteps.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400 flex items-center gap-1">
                                    ⚡ Bloc B ({blockBSteps.length} min)
                                  </span>
                                  <div className="space-y-1">
                                    {blockBSteps.map(s => renderStepItem(s, 'B'))}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            /* Single Main Circuit */
                            mainSteps.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF6321]/80 flex items-center gap-1">
                                  ⚡ Circuit Principal ({mainSteps.length} min)
                                </span>
                                <div className="space-y-1">
                                  {mainSteps.map((s, idx) => renderStepItem(s, ''))}
                                </div>
                              </div>
                            )
                          )}

                          {/* 3. Finisher Section */}
                          {finisherSteps.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 flex items-center gap-1">
                                🏁 Le Finisher ({finisherSteps.length} min)
                              </span>
                              <div className="space-y-1">
                                {finisherSteps.map(s => renderStepItem(s, 'F'))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 3. WORKOUT COMPLETED REWARDS SCREEN */}
          {workoutState === 'completed' && (
            <div id="panel-completed" className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-10 shadow-2xl text-center space-y-6 max-w-xl mx-auto animate-fade-in text-white font-sans">
              <div className="w-16 h-16 bg-[#FF6321]/15 text-[#FF6321] border border-[#FF6321]/20 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                🏆
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">Entraînement Bouclé !</h2>
                <p className="text-[#FF6321] font-bold text-sm tracking-widest uppercase font-mono">
                  Sangle Abdominale & Adducteurs Blindés
                </p>
                <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed font-sans opacity-95">
                  Excellent travail. En répétant cette séance de PPG spécifique 2 fois par semaine, votre corps résistera efficacement aux crampes violentes et à l'effondrement postural après le 30ème kilomètre.
                </p>
              </div>

              {/* SUMMARY STATS GRID */}
              <div className="grid grid-cols-2 gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl text-left">
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block">Durée de l'exercice</span>
                  <span className="text-xl font-bold text-white font-mono uppercase tracking-wide">{config.durationMinutes || 30} minutes</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-black block">Indice de protection</span>
                  <span className="text-xl font-bold text-[#FF6321] font-mono uppercase tracking-wide">100% blindé</span>
                </div>
              </div>

              <button
                id="btn-completed-reset"
                onClick={resetWorkout}
                className="w-full bg-[#FF6321] hover:bg-[#FF6321]/90 text-black font-extrabold uppercase tracking-widest text-xs py-4 rounded-full transition-all cursor-pointer"
              >
                Retourner à l'accueil
              </button>
            </div>
          )}

        </main>
      )}

      {/* FOOTER INFORMATIONAL BLOCK */}
      <footer className="mt-auto bg-[#050505] border-t border-white/10 py-10 px-6 text-center text-white/50 text-xs space-y-4">
        <div className="max-w-xl mx-auto space-y-2">
          <h4 className="text-[10px] font-bold tracking-widest text-[#FF6321] uppercase">
            💡 Conseil Scientifique Marathon (Effet Km 30)
          </h4>
          <p className="leading-relaxed text-[#FF6321]/80 text-xs">
            Les crampes dites "de fatigue musculaire périphérique" sont principalement le fruit de la fatigue neuromusculaire. Le renforcement spécifique des adducteurs (Copenhagen plank) stabilise le bassin, ce qui neutralise le roulis parasite et soulage directement le travail excentrique compensateur des mollets.
          </p>
        </div>
        <p className="text-[10px] text-white/20 pt-3 font-mono">
          Marathon PPG Coach — Thème Sophisiqué Dark. Propulsé par un moteur déterministe.
        </p>
      </footer>
    </div>
  );
}
