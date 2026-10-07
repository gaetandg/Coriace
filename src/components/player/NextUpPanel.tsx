import { WorkoutInterval } from '../../types';

interface NextUpPanelProps {
  nextUp: WorkoutInterval;
  // During rest and transitions, show the full instructions so the runner can get ready.
  detailed: boolean;
}

export function NextUpPanel({ nextUp, detailed }: NextUpPanelProps) {
  return (
    <div id="pnl-next-up" className="relative bg-cream text-ink rounded-[18px] px-4 py-3.5 flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-clay">Prochain exercice</span>
          <span className="font-display font-bold text-[21px] leading-tight">{nextUp.title.replace('Échauffement : ', '')}</span>
        </div>
        <span className="text-sm text-clay text-right">{nextUp.target.split(' - ')[0]}</span>
      </div>

      {detailed && nextUp.exercise && (
        <div className="mt-2 pt-2.5 border-t border-cream-line flex flex-col gap-1.5 text-[15px] leading-relaxed">
          <p>{nextUp.exercise.description}</p>
          <p className="font-semibold">À retenir : {nextUp.exercise.instructionHighlight}</p>
        </div>
      )}
    </div>
  );
}
