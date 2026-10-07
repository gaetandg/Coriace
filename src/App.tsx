import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { Header } from './components/Header';
import { ConfigScreen } from './components/config/ConfigScreen';
import { SummaryScreen } from './components/summary/SummaryScreen';
import { PlayerScreen } from './components/player/PlayerScreen';
import { CompletedScreen } from './components/CompletedScreen';
import { SoundSheet } from './components/SoundSheet';
import { useBackHandler } from './hooks/useBackHandler';
import { HistoryScreen } from './components/HistoryScreen';
import { sessionsInLastDays } from './lib/history';
import { useAuth } from './hooks/useAuth';
import { AccountCard } from './components/AccountCard';
import { AccountSheet } from './components/AccountSheet';

const accountInitial = (user: User | null) =>
  user ? ((user.user_metadata?.full_name as string | undefined) || user.email || '?').charAt(0).toUpperCase() : '';

type AppTab = 'workout' | 'history';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('workout');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [showSound, setShowSound] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const notify = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const auth = useAuth();
  const session = useWorkoutSession(notify, auth.user?.id ?? null);
  const { config, workoutState, activeInterval, summaryPlanGroups } = session;

  // Phone back button, from the deepest level: sheets, history, then the workout screens.
  useBackHandler(workoutState === 'summary', session.handleBackToConfig);
  useBackHandler(workoutState === 'completed', session.resetWorkout);
  useBackHandler(workoutState === 'active', () => {
    // Leaving a session by accident would lose it: pause instead.
    if (session.isPlaying) session.togglePlayPause();
    notify('Séance en pause. Touche « Quitter » pour l\'arrêter.');
  });
  // Leaving the history after a session goes home rather than back to the completion screen.
  const closeHistory = () => {
    setActiveTab('workout');
    if (workoutState === 'completed') session.resetWorkout();
  };
  useBackHandler(activeTab === 'history', closeHistory);
  useBackHandler(showSound, () => setShowSound(false));
  useBackHandler(showAccount, () => setShowAccount(false));

  // Rest turns the screen green so effort and recovery read at a glance from the floor.
  const isBreak = activeTab === 'workout' && workoutState === 'active' && activeInterval?.type === 'rest';

  return (
    <div className={`min-h-dvh overflow-x-clip text-white transition-colors duration-500 ${isBreak ? 'bg-grass' : 'bg-brick'}`}>
      <div className="relative w-full max-w-md min-h-dvh mx-auto px-5 pt-5 pb-6 flex flex-col gap-[22px]">
        <Header
          soundOn={session.sound.beeps || (session.sound.voice && session.speechSupported)}
          onOpenSound={() => setShowSound(true)}
          accountInitial={auth.enabled ? accountInitial(auth.user) : null}
          onOpenAccount={() => setShowAccount(true)}
        />

        {activeTab === 'history' ? (
          <HistoryScreen
            history={session.history}
            onBack={closeHistory}
            onClear={session.clearHistory}
            account={<AccountCard auth={auth} />}
          />
        ) : (
          <>
            {workoutState === 'config' && <ConfigScreen session={session} onOpenHistory={() => setActiveTab('history')} />}

            {workoutState === 'summary' && summaryPlanGroups && (
              <SummaryScreen
                title={session.activePreset?.name ?? 'Ta séance'}
                backLabel={session.activePreset ? 'Séances prédéfinies' : 'Réglages'}
                minutes={session.plannedMinutes}
                rythme={config.rythme}
                plan={summaryPlanGroups}
                onBack={session.handleBackToConfig}
                onRegenerate={session.activePreset ? undefined : session.handleRegeneratePlan}
                onLaunch={session.handleLaunchWorkout}
              />
            )}

            {workoutState === 'active' && activeInterval && (
              <PlayerScreen session={session} activeInterval={activeInterval} isBreak={isBreak} />
            )}

            {workoutState === 'completed' && summaryPlanGroups && (
              <CompletedScreen
                durationMinutes={session.plannedMinutes}
                exerciseCount={summaryPlanGroups.circuitExercises.length + summaryPlanGroups.finishers.length}
                rythme={config.rythme}
                recentCount={sessionsInLastDays(session.history, 7)}
                onRestart={session.resetWorkout}
                onOpenHistory={() => setActiveTab('history')}
                account={<AccountCard auth={auth} compact />}
              />
            )}
          </>
        )}
      </div>

      {showSound && (
        <SoundSheet
          sound={session.sound}
          speechSupported={session.speechSupported}
          onChange={session.setSoundOption}
          onTest={session.testSound}
          onClose={() => setShowSound(false)}
        />
      )}

      {showAccount && (
        <AccountSheet
          auth={auth}
          onOpenHistory={() => { setShowAccount(false); setActiveTab('history'); }}
          onClose={() => setShowAccount(false)}
        />
      )}

      {feedbackMessage && (
        <div role="status" className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 max-w-[90vw] bg-ink text-cream font-semibold text-sm px-5 py-3 rounded-full shadow-lg">
          {feedbackMessage}
        </div>
      )}
    </div>
  );
}
