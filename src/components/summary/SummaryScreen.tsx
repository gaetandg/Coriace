import { ReactNode, useState } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { Exercise, WorkoutConfig, WorkoutInterval } from '../../types';
import { bodyPartEmoji, exerciseBodyPart } from '../../lib/bodyPart';
import { PlanGroups } from '../../lib/plan';
import { ExerciseDetailModal } from './ExerciseDetailModal';

interface PlanSectionProps {
  emoji: string;
  headingClassName: string;
  label: string;
  hint?: string;
  gridClassName?: string;
  children: ReactNode;
}

function PlanSection({
  emoji,
  headingClassName,
  label,
  hint = 'Cliquez pour voir les consignes',
  gridClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2',
  children,
}: PlanSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
        <span className="text-sm">{emoji}</span>
        <h3 className={`text-xs uppercase ${headingClassName} font-bold tracking-widest flex items-center justify-between w-full`}>
          <span>{label}</span>
          <span className="text-[10px] text-white/40 normal-case font-normal font-sans">{hint}</span>
        </h3>
      </div>
      <div className={gridClassName}>
        {children}
      </div>
    </div>
  );
}

interface PlanItemCardProps {
  item: WorkoutInterval;
  onSelect: (exercise: Exercise) => void;
  badge: ReactNode;
  title: string;
  titleClassName: string;
  target: string;
  targetClassName: string;
  gapClassName?: string;
}

function PlanItemCard({ item, onSelect, badge, title, titleClassName, target, targetClassName, gapClassName = 'gap-2.5' }: PlanItemCardProps) {
  return (
    <button
      type="button"
      onClick={() => item.exercise && onSelect(item.exercise)}
      className="bg-white/3 p-3 rounded-xl border border-white/5 hover:bg-white/8 hover:border-white/12 active:scale-98 transition-all cursor-pointer text-left w-full group relative focus:outline-none focus:ring-1 focus:ring-[#FF6321] min-w-0 text-xs"
      title="Cliquez pour voir les consignes de l'exercice"
    >
      <div className={`flex items-start ${gapClassName} min-w-0 w-full`}>
        {badge}
        <div className="leading-tight flex-1 min-w-0">
          <div className={`font-bold flex items-start justify-between gap-1.5 ${titleClassName} transition-colors`}>
            <span className="break-words whitespace-normal leading-tight">{title}</span>
            <span className="text-[10px] bg-white/5 px-1 py-0.5 rounded text-white/50 shrink-0 select-none">{bodyPartEmoji(exerciseBodyPart(item.exercise))}</span>
          </div>
          <span className={`text-[10px] ${targetClassName} block mt-1 break-words whitespace-normal leading-tight`}>{target}</span>
        </div>
      </div>
    </button>
  );
}

// Class names are passed whole so Tailwind can detect them.
interface CircuitStyle {
  prefix: string;
  badgeClassName: string;
  titleClassName: string;
  targetClassName: string;
}

const CIRCUIT_STYLES: Record<'main' | 'blockA' | 'blockB', CircuitStyle> = {
  main: {
    prefix: '',
    badgeClassName: 'text-[#FF6321]/80 bg-[#FF6321]/10 border border-[#FF6321]/20',
    titleClassName: 'text-white group-hover:text-[#FF6321]',
    targetClassName: 'text-[#FF6321] font-bold font-mono tracking-wider',
  },
  blockA: {
    prefix: 'A',
    badgeClassName: 'text-[#FF6321]/85 bg-[#FF6321]/10 border border-[#FF6321]/20',
    titleClassName: 'text-white group-hover:text-[#FF6321]',
    targetClassName: 'text-[#FF6321] font-bold font-mono tracking-wider',
  },
  blockB: {
    prefix: 'B',
    badgeClassName: 'text-orange-400 bg-orange-400/10 border border-orange-400/20',
    titleClassName: 'text-white group-hover:text-orange-400',
    targetClassName: 'text-orange-400 font-bold font-mono tracking-wider',
  },
};

function circuitCards(items: WorkoutInterval[], onSelect: (exercise: Exercise) => void, { prefix, badgeClassName, titleClassName, targetClassName }: CircuitStyle) {
  return items.map((item, idx) => (
    <PlanItemCard
      key={idx}
      item={item}
      onSelect={onSelect}
      badge={
        <span className={`${badgeClassName} font-mono font-semibold w-5 h-5 rounded flex items-center justify-center shrink-0 text-[10px] mt-0.5`}>
          {prefix}{idx + 1}
        </span>
      }
      title={item.title}
      titleClassName={titleClassName}
      target={item.target.split(' - ')[0]}
      targetClassName={targetClassName}
    />
  ));
}

interface SummaryScreenProps {
  config: WorkoutConfig;
  plan: PlanGroups;
  onBack: () => void;
  onRegenerate: () => void;
  onLaunch: () => void;
}

export function SummaryScreen({ config, plan, onBack, onRegenerate, onLaunch }: SummaryScreenProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const durationMinutes = config.durationMinutes || 30;
  const roundsLabel = (rounds: number) => `${rounds} ${rounds > 1 ? 'Rounds' : 'Round'} du Circuit`;

  return (
    <div id="panel-summary" className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in text-white">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#FF6321]/15 text-[#FF6321] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#FF6321]/20">
          📋 Confirmation de séance
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight uppercase">
          Résumé du Plan de Séance d'Entraînement
        </h2>
        <p className="text-xs sm:text-sm text-white/55 leading-relaxed font-sans">
          Voici l'ordonnancement optimal de vos {durationMinutes} minutes de PPG spécifique. Vous pouvez ré-organiser les exercices ou retourner ajuster vos choix.
        </p>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
          <span className="text-[10px] text-white/40 uppercase font-black font-mono tracking-widest block">Durée Totale</span>
          <span className="text-xl font-bold font-display text-white">{durationMinutes} minutes</span>
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
            {plan.circuitExercises.length + plan.finishers.length} exercices
          </span>
        </div>
      </div>

      {/* TIMELINE PREVIEW */}
      <div className="space-y-4">
        {/* stage 1: Warmup */}
        <PlanSection
          emoji="🔥"
          headingClassName="text-emerald-400"
          label={`Phase Échauffement : Progressive (${plan.totalWarmup} minutes)`}
          hint="Cliquez sur un exercice pour voir les consignes"
        >
          {plan.warmups.map((item, idx) => (
            <PlanItemCard
              key={idx}
              item={item}
              onSelect={setSelectedExercise}
              gapClassName="gap-2"
              badge={<span className="text-white/40 font-mono font-bold w-4 shrink-0 mt-0.5">{idx + 1}.</span>}
              title={item.title.replace('Échauffement : ', '')}
              titleClassName="text-white/90 group-hover:text-[#FF6321]"
              target={item.target}
              targetClassName="text-white/40 font-mono"
            />
          ))}
        </PlanSection>

        {/* stage 2: Main Circuit */}
        <div className="space-y-4">
          {plan.hasTwoBlocks ? (
            <>
              <PlanSection
                emoji="⚡"
                headingClassName="text-[#FF6321]"
                label={`Circuit Bloc A : ${roundsLabel(plan.numRounds1)} (${plan.circuit1Exercises.length * plan.numRounds1} minutes)`}
              >
                {circuitCards(plan.circuit1Exercises, setSelectedExercise, CIRCUIT_STYLES.blockA)}
              </PlanSection>

              <PlanSection
                emoji="⚡"
                headingClassName="text-orange-400"
                label={`Circuit Bloc B : ${roundsLabel(plan.numRounds2)} (${plan.circuit2Exercises.length * plan.numRounds2} minutes)`}
              >
                {circuitCards(plan.circuit2Exercises, setSelectedExercise, CIRCUIT_STYLES.blockB)}
              </PlanSection>
            </>
          ) : (
            <PlanSection
              emoji="⚡"
              headingClassName="text-[#FF6321]"
              label={`Circuit Principal : ${roundsLabel(plan.numRounds)} (${plan.totalMainCircuit * plan.numRounds} minutes)`}
            >
              {circuitCards(plan.circuitExercises, setSelectedExercise, CIRCUIT_STYLES.main)}
            </PlanSection>
          )}
        </div>

        {/* stage 3: Finisher */}
        <PlanSection
          emoji="🏁"
          headingClassName="text-red-400"
          label={`Dernière ligne droite : Le Finisher (${plan.totalFinishers} minutes)`}
          gridClassName="grid grid-cols-1 sm:grid-cols-3 gap-2"
        >
          {plan.finishers.map((item, idx) => (
            <PlanItemCard
              key={idx}
              item={item}
              onSelect={setSelectedExercise}
              gapClassName="gap-2"
              badge={<span className="text-red-400 font-mono font-bold w-4 shrink-0 mt-0.5">F{idx + 1}.</span>}
              title={item.title}
              titleClassName="text-white group-hover:text-red-400"
              target={item.target}
              targetClassName="text-white/45 font-mono"
            />
          ))}
        </PlanSection>
      </div>

      {/* SUMMARY ACTIONS */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto text-xs text-white/70 hover:text-white flex items-center gap-2 bg-white/5 hover:bg-white/10 px-6 h-12 rounded-full border border-white/10 hover:border-white/20 transition-all font-bold uppercase tracking-wider justify-center cursor-pointer font-sans"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF6321]" /> Modifier la configuration
        </button>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onRegenerate}
            className="w-full sm:w-auto text-xs text-white/70 hover:text-white flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 h-12 rounded-full border border-white/10 hover:border-white/20 transition-all font-bold uppercase tracking-wider justify-center cursor-pointer font-sans"
            title="Mélanger l'ordre des exercices pour une nouvelle séance aléatoire"
          >
            🔄 Régénérer l'ordre
          </button>

          <button
            type="button"
            onClick={onLaunch}
            className="w-full sm:w-auto bg-[#FF6321] hover:bg-[#FF6321]/95 text-black font-extrabold px-10 h-12 rounded-full shadow-lg shadow-[#FF6321]/15 transition-all transform active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-widest cursor-pointer font-sans animate-pulse"
          >
            <Play className="w-4 h-4 fill-black shrink-0" /> Lancer l'entraînement !
          </button>
        </div>
      </div>

      {/* EXERCISE DETAIL POPUP MODAL */}
      {selectedExercise && (
        <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      )}
    </div>
  );
}
