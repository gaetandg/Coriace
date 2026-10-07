import { Check, ChevronRight } from 'lucide-react';
import { BlockStep } from '../../lib/plan';

interface StepListProps {
  steps: BlockStep[];
  activeBlockIndex: number;
  onJump: (blockIndex: number) => void;
}

// Collapsible list of every step of the session, grouped by stage; tap one to jump to it.
export function StepList({ steps, activeBlockIndex, onJump }: StepListProps) {
  const mainSteps = steps.filter(s => s.stage === 'main');
  const hasSeparateBlocks = mainSteps.some(s => s.blockNumber === 2);

  const groups: { key: string; label: string; prefix: string; steps: BlockStep[] }[] = [
    { key: 'warmup', label: 'Échauffement', prefix: '', steps: steps.filter(s => s.stage === 'warmup') },
    ...(hasSeparateBlocks
      ? [
          { key: 'blockA', label: 'Bloc A', prefix: 'A', steps: mainSteps.filter(s => (s.blockNumber || 1) === 1) },
          { key: 'blockB', label: 'Bloc B', prefix: 'B', steps: mainSteps.filter(s => s.blockNumber === 2) },
        ]
      : [{ key: 'main', label: 'Circuit', prefix: '', steps: mainSteps }]),
    { key: 'finisher', label: 'Finisher', prefix: 'F', steps: steps.filter(s => s.stage === 'finisher') },
  ];

  return (
    <details className="relative group border-t border-white/30 pt-1">
      <summary className="h-12 flex items-center justify-between font-semibold cursor-pointer list-none">
        Déroulé de la séance
        <span className="text-sand text-sm group-open:hidden">Afficher</span>
        <span className="text-sand text-sm hidden group-open:inline">Masquer</span>
      </summary>

      <div className="flex flex-col gap-4 pb-2">
        <p className="text-sm text-sand">Touche une étape pour y aller directement.</p>
        {groups.filter(g => g.steps.length > 0).map(group => (
          <div key={group.key} className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-sand">{group.label} · {group.steps.length} min</span>
            {group.steps.map(step => {
              const isActive = step.blockIndex === activeBlockIndex;
              const isPassed = step.blockIndex < activeBlockIndex;
              return (
                <button
                  key={step.blockIndex}
                  type="button"
                  onClick={() => onJump(step.blockIndex)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-left cursor-pointer ${
                    isActive ? 'bg-cream text-ink' : isPassed ? 'text-white/55 hover:bg-white/5' : 'hover:bg-white/5'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[13px] font-semibold ${isActive ? 'bg-ink/10' : 'bg-ink/35'}`}>
                    {isPassed ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : `${group.prefix}${step.blockIndex + 1}`}
                  </span>
                  <span className="flex-1 min-w-0 truncate font-medium">{step.title.replace('Échauffement : ', '')}</span>
                  <span className={`text-sm truncate ${isActive ? 'text-clay' : 'text-sand'}`}>{step.target.split(' - ')[0]}</span>
                  {!isActive && <ChevronRight className="w-4 h-4 shrink-0 text-sand" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </details>
  );
}
