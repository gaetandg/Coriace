import { ReactNode, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { HistoryEntry, sessionsInLastDays } from '../../lib/history';
import { groupSets, minutesInLastDays, topSessions, weekStreak, weeklyStats } from '../../lib/stats';
import { plural } from '../../lib/format';
import { primaryButton, sectionLabel } from '../../lib/ui';
import { WeeklyChart } from './WeeklyChart';
import { BarList } from './BarList';

const dayFormat = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
// Older sessions stay behind a button so the page doesn't grow forever.
const VISIBLE_SESSIONS = 10;
const decimal = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

interface StatsScreenProps {
  history: HistoryEntry[];
  onBack: () => void;
  onClear: () => void;
  account: ReactNode;
}

export function StatsScreen({ history, onBack, onClear, account }: StatsScreenProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? history : history.slice(0, VISIBLE_SESSIONS);
  const tiles = [
    { value: String(sessionsInLastDays(history, 7)), label: 'séances sur 7 jours' },
    { value: String(sessionsInLastDays(history, 30)), label: 'séances sur 30 jours' },
    { value: String(history.length), label: 'séances au total' },
    { value: String(minutesInLastDays(history, 30)), label: 'minutes sur 30 jours' },
    { value: String(weekStreak(history)), label: "semaines d'affilée" },
    { value: decimal.format(sessionsInLastDays(history, 28) / 4), label: 'en moyenne par semaine' },
  ];
  const top = topSessions(history, 5);
  const worked = groupSets(history, 30);
  const trackedSets = worked.groups.reduce((sum, g) => sum + g.sets, 0);

  return (
    <main id="panel-stats" className="flex-1 flex flex-col gap-5">
      <button onClick={onBack} className="-ml-2.5 self-start h-11 pr-3 flex items-center gap-2 text-sand font-semibold text-[15px] cursor-pointer">
        <ArrowLeft className="w-[22px] h-[22px] text-white" />
        Retour
      </button>

      <h1 className="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">Statistiques</h1>

      {history.length === 0 ? (
        <p className="text-base text-sand">Aucune séance terminée pour l'instant. Tes stats apparaîtront ici après ta première séance.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {tiles.map(tile => (
              <div key={tile.label} className="bg-cream text-ink rounded-2xl px-3 py-3 flex flex-col gap-0.5">
                <span className="font-display font-extrabold text-[26px] leading-tight">{tile.value}</span>
                <span className="text-[13px] leading-snug text-clay">{tile.label}</span>
              </div>
            ))}
          </div>

          <WeeklyChart weeks={weeklyStats(history, 12)} />
          {trackedSets > 0 && (
            <BarList
              title="Groupes travaillés"
              subtitle="Séries de travail sur 30 jours"
              items={worked.groups.map(g => ({ label: g.label, value: g.sets, valueLabel: plural(g.sets, 'série') }))}
              footer={worked.untracked > 0
                ? `${plural(worked.untracked, 'séance')} plus ancienne${worked.untracked > 1 ? 's' : ''} sans le détail des exercices.`
                : undefined}
            />
          )}
          <BarList
            title="Séances les plus faites"
            items={top.map(s => ({ label: s.name, value: s.count, valueLabel: `${s.count} fois` }))}
          />
        </>
      )}

      {account}

      {history.length > 0 && (
        <section className="flex flex-col gap-1">
          <h2 className={sectionLabel}>Historique</h2>
          <ul className="flex flex-col">
            {visible.map(entry => (
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
          {visible.length < history.length && (
            <button onClick={() => setShowAll(true)} className="self-start h-11 font-semibold underline underline-offset-4 cursor-pointer">
              Tout afficher ({history.length})
            </button>
          )}
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
        </section>
      )}

      <button onClick={onBack} className={`mt-auto w-full ${primaryButton}`}>Préparer une séance</button>
    </main>
  );
}
