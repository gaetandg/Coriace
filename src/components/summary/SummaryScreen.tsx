import { useState } from 'react';
import { ArrowLeft, ChevronRight, Play } from 'lucide-react';
import { Exercise, WorkoutConfig, WorkoutInterval } from '../../types';
import { PlanGroups } from '../../lib/plan';
import { outlineButton, primaryButton, sectionLabel } from '../../lib/ui';
import { ExerciseDetailModal } from './ExerciseDetailModal';

interface PlanSectionProps {
  label: string;
  items: WorkoutInterval[];
  prefix?: string; // badge prefix; no badge when undefined
  onSelect: (exercise: Exercise) => void;
}

function PlanSection({ label, items, prefix, onSelect }: PlanSectionProps) {
  return (
    <section className="flex flex-col gap-1.5">
      <h2 className={sectionLabel}>{label}</h2>
      <ul className="flex flex-col">
        {items.map((item, idx) => (
          <li key={idx} className="border-b border-white/20">
            <button
              type="button"
              onClick={() => item.exercise && onSelect(item.exercise)}
              title="Voir les consignes"
              className="w-full py-2.5 flex items-center gap-3 text-left cursor-pointer hover:bg-white/5"
            >
              {prefix !== undefined && (
                <span className="w-7 h-7 rounded-full bg-ink/40 shrink-0 flex items-center justify-center text-[13px] font-semibold">
                  {prefix}{idx + 1}
                </span>
              )}
              <span className="flex-1 font-medium text-base">{item.title.replace('Échauffement : ', '')}</span>
              <span className="text-sm text-sand text-right">{item.target.split(' - ')[0]}</span>
              <ChevronRight className="w-[18px] h-[18px] shrink-0 text-sand" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
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
  const tours = (rounds: number) => `${rounds} ${rounds > 1 ? 'tours' : 'tour'}`;

  const stats = [
    { value: String(durationMinutes), label: 'minutes' },
    { value: config.rythme === 'equilibre' ? '30/30' : '40/20', label: config.rythme === 'equilibre' ? 'équilibré' : 'intense' },
    { value: String(plan.circuitExercises.length + plan.finishers.length), label: 'exercices' },
  ];

  return (
    <div id="panel-summary" className="flex-1 flex flex-col gap-5">
      <button onClick={onBack} className="-ml-2.5 self-start h-11 pr-3 flex items-center gap-2 text-sand font-semibold text-[15px] cursor-pointer">
        <ArrowLeft className="w-[22px] h-[22px] text-white" />
        Réglages
      </button>

      <div className="flex flex-col gap-2">
        <h1 className="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">Ta séance</h1>
        <p className="text-[15px] text-sand">Touche un exercice pour voir ses consignes.</p>
      </div>

      <div className="grid grid-cols-3 bg-cream text-ink rounded-[18px] py-3.5">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`flex flex-col items-center gap-0.5 ${i === 1 ? 'border-x border-cream-line' : ''}`}>
            <span className="font-display font-extrabold text-[26px] leading-tight">{stat.value}</span>
            <span className="text-[13px] text-clay">{stat.label}</span>
          </div>
        ))}
      </div>

      <PlanSection label={`Échauffement · ${plan.totalWarmup} min`} items={plan.warmups} onSelect={setSelectedExercise} />

      {plan.hasTwoBlocks ? (
        <>
          <PlanSection
            label={`Bloc A · ${tours(plan.numRounds1)} · ${plan.circuit1Exercises.length * plan.numRounds1} min`}
            items={plan.circuit1Exercises}
            prefix="A"
            onSelect={setSelectedExercise}
          />
          <PlanSection
            label={`Bloc B · ${tours(plan.numRounds2)} · ${plan.circuit2Exercises.length * plan.numRounds2} min`}
            items={plan.circuit2Exercises}
            prefix="B"
            onSelect={setSelectedExercise}
          />
        </>
      ) : (
        <PlanSection
          label={`Circuit · ${tours(plan.numRounds)} · ${plan.totalMainCircuit * plan.numRounds} min`}
          items={plan.circuitExercises}
          prefix=""
          onSelect={setSelectedExercise}
        />
      )}

      <PlanSection label={`Finisher · ${plan.totalFinishers} min`} items={plan.finishers} prefix="F" onSelect={setSelectedExercise} />

      <div className="sticky bottom-0 mt-auto -mx-5 px-5 pt-3 pb-1 bg-brick flex gap-2.5">
        <button onClick={onRegenerate} title="Tirer un nouvel ordre des exercices" className={`h-15 px-[18px] rounded-[18px] text-[15px] ${outlineButton}`}>
          Mélanger
        </button>
        <button onClick={onLaunch} className={`flex-1 ${primaryButton}`}>
          <Play className="w-[18px] h-[18px] fill-current" />
          Commencer
        </button>
      </div>

      {selectedExercise && (
        <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      )}
    </div>
  );
}
