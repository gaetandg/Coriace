import { ReactNode, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { HistoryEntry, sessionsInLastDays } from '../lib/history';
import { primaryButton } from '../lib/ui';

const dayFormat = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

export const plural = (count: number, word: string) => `${count} ${word}${count > 1 ? 's' : ''}`;

interface HistoryScreenProps {
  history: HistoryEntry[];
  onBack: () => void;
  onClear: () => void;
  account: ReactNode;
}

export function HistoryScreen({ history, onBack, onClear, account }: HistoryScreenProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const stats = [
    { value: String(sessionsInLastDays(history, 7)), label: '7 derniers jours' },
    { value: String(sessionsInLastDays(history, 30)), label: '30 derniers jours' },
    { value: String(history.length), label: 'au total' },
  ];

  return (
    <main id="panel-history" className="flex-1 flex flex-col gap-5">
      <button onClick={onBack} className="-ml-2.5 self-start h-11 pr-3 flex items-center gap-2 text-sand font-semibold text-[15px] cursor-pointer">
        <ArrowLeft className="w-[22px] h-[22px] text-white" />
        Retour
      </button>

      <h1 className="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">Historique</h1>

      <div className="grid grid-cols-3 bg-cream text-ink rounded-[18px] py-3.5">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`flex flex-col items-center gap-0.5 ${i === 1 ? 'border-x border-cream-line' : ''}`}>
            <span className="font-display font-extrabold text-[26px] leading-tight">{stat.value}</span>
            <span className="text-[13px] text-clay">{stat.label}</span>
          </div>
        ))}
      </div>

      {account}

      {history.length === 0 ? (
        <p className="text-base text-sand">Aucune séance terminée pour l'instant. Elles apparaîtront ici.</p>
      ) : (
        <ul className="flex flex-col">
          {history.map(entry => (
            <li key={entry.id} className="py-3 border-b border-white/20 flex items-baseline justify-between gap-3">
              <span className="flex flex-col">
                <span className="font-semibold text-base">{entry.name}</span>
                <span className="text-sm text-sand">
                  {entry.minutes} min · {entry.rythme === 'equilibre' ? '30/30' : '40/20'} · {plural(entry.exerciseCount, 'exercice')}
                </span>
              </span>
              <span className="text-sm text-sand shrink-0 first-letter:uppercase">{dayFormat.format(new Date(entry.completedAt))}</span>
            </li>
          ))}
        </ul>
      )}

      {history.length > 0 && (
        <button
          onClick={() => {
            if (confirmClear) {
              onClear();
              setConfirmClear(false);
            } else {
              setConfirmClear(true);
            }
          }}
          className="self-start h-11 text-sm font-semibold text-sand underline underline-offset-4 cursor-pointer"
        >
          {confirmClear ? 'Confirmer : tout effacer' : "Effacer l'historique"}
        </button>
      )}

      <button onClick={onBack} className={`mt-auto w-full ${primaryButton}`}>Préparer une séance</button>
    </main>
  );
}
