import { ReactNode } from 'react';
import { WorkoutConfig } from '../types';
import { plural } from '../lib/format';
import { primaryButton } from '../lib/ui';
import { LaneArcs } from './Logo';

interface CompletedScreenProps {
  durationMinutes: number;
  exerciseCount: number;
  rythme: WorkoutConfig['rythme'];
  recentCount: number; // sessions in the last 7 days, this one included
  onRestart: () => void;
  onOpenStats: () => void;
  account: ReactNode;
}

export function CompletedScreen({ durationMinutes, exerciseCount, rythme, recentCount, onRestart, onOpenStats, account }: CompletedScreenProps) {
  const stats = [
    { value: String(durationMinutes), label: 'minutes' },
    { value: String(exerciseCount), label: 'exercices' },
    { value: rythme === 'equilibre' ? '30/30' : '40/20', label: 'rythme' },
  ];

  return (
    <div id="panel-completed" className="flex-1 flex flex-col gap-[22px]">
      <LaneArcs className="w-[520px] top-[20px] -left-[85px] opacity-20" />

      <div className="relative mt-[120px] flex flex-col gap-3">
        <h1 className="font-display font-extrabold text-[56px] leading-[0.95] tracking-[-0.04em]">Séance<br />terminée</h1>
        <p className="text-lg leading-relaxed text-sand max-w-[310px]">
          Bien joué. {plural(recentCount, 'séance')} les 7 derniers jours.
        </p>
      </div>

      <div className="relative grid grid-cols-3 gap-2">
        {stats.map(stat => (
          <div key={stat.label} className="bg-cream text-ink rounded-2xl px-3 py-3.5 flex flex-col gap-0.5">
            <span className="font-display font-extrabold text-[28px] leading-tight">{stat.value}</span>
            <span className="text-[13px] text-clay">{stat.label}</span>
          </div>
        ))}
      </div>

      {account}

      <div className="relative mt-auto flex flex-col gap-2.5">
        <button onClick={onOpenStats} className="h-12 font-semibold underline underline-offset-4 cursor-pointer">
          Voir tes stats
        </button>
        <button id="btn-completed-reset" onClick={onRestart} className={`w-full ${primaryButton}`}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
