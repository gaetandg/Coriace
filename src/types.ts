export type ExerciseCategory = 'specific_calf' | 'specific_adductor' | 'abdos' | 'general';

export interface Exercise {
  id: string;
  name: string;
  target: string;
  description: string;
  equipmentRequired: ('chaise' | 'poids_8kg' | 'corde_a_sauter')[];
  category: ExerciseCategory;
  tips: string;
  instructionHighlight: string;
}

export type WorkoutStage = 'warmup' | 'main' | 'finisher';
export type IntervalType = 'work' | 'rest';

export interface WorkoutInterval {
  intervalIndex: number; // 0 to 59
  blockIndex: number;    // 0 to 29 (Minute of the workout)
  stage: WorkoutStage;
  type: IntervalType;
  title: string;
  description: string;
  target: string;
  duration: number; // in seconds
  exercise: Exercise | null;
  roundNumber?: number; // for main circuit rounds
  blockNumber?: number; // for 1 or 2 blocks of circuit
  isRoundTransition?: boolean;
  roundTransitionFrom?: number;
  roundTransitionTo?: number;
  isBlockTransition?: boolean;
}

export interface WorkoutConfig {
  equipment: {
    none: boolean;
    chaise: boolean;
    poids_8kg: boolean;
    corde_a_sauter: boolean;
  };
  rythme: 'equilibre' | 'intense'; // equilibre = 30s/30s, intense = 40s/20s
  durationMinutes?: number; // 15 to 60, default 30
  selectedExerciseIds?: string[]; // Exercises selected by the user
  numBlocks?: number; // 1 or 2 blocks of circuit
}
