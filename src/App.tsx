import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { Header } from './components/Header';
import { ConfigScreen } from './components/config/ConfigScreen';
import { SummaryScreen } from './components/summary/SummaryScreen';
import { PlayerScreen } from './components/player/PlayerScreen';
import { CompletedScreen } from './components/CompletedScreen';
import { SoundSheet } from './components/SoundSheet';
import { useBackHandler } from './hooks/useBackHandler';
import { StatsScreen } from './components/stats/StatsScreen';
import { sessionsInLastDays } from './lib/history';
import { useAuth } from './hooks/useAuth';
import { AccountCard } from './components/AccountCard';
import { AccountSheet } from './components/AccountSheet';
import { track } from './lib/analytics';
import { presetUsesWeight } from './sessions';

const accountInitial = (user: User | null) =>
  user ? ((user.user_metadata?.full_name as string | undefined) || user.email || '?').charAt(0).toUpperCase() : '';

type AppTab = 'workout' | 'stats';

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

  // Phone back button, from the deepest level: sheets, stats, then the workout screens.
  useBackHandler(workoutState === 'summary', session.handleBackToConfig);
  useBackHandler(workoutState === 'completed', session.resetWorkout);
  useBackHandler(workoutState === 'active', () => {
    // Leaving a session by accident would lose it: pause instead.
    if (session.isPlaying) session.togglePlayPause();
    notify('Séance en pause. Touche « Quitter » pour l\'arrêter.');
  });
  // Leaving the stats after a session goes home rather than back to the completion screen.
  const closeStats = () => {
    setActiveTab('workout');
    if (workoutState === 'completed') session.resetWorkout();
  };
  useBackHandler(activeTab === 'stats', closeStats);
  const openStats = () => { setActiveTab('stats'); track('statistiques'); };
  useBackHandler(showSound, () => setShowSound(false));
  useBackHandler(showAccount, () => setShowAccount(false));

  // The logo leads home, except during a session, which only "Quitter" ends.
  const goHome = () => {
    if (workoutState === 'active') return;
    setShowSound(false);
    setShowAccount(false);
    setActiveTab('workout');
    if (workoutState === 'summary') session.handleBackToConfig();
    if (workoutState === 'completed') session.resetWorkout();
  };

  // Every new screen opens at the top. Coming back to the settings finds them where they were left.
  const screen = activeTab === 'stats' ? 'stats' : workoutState;
  const screenRef = useRef(screen);
  const settingsScroll = useRef(0);
  useEffect(() => {
    // The app places the scroll itself; the browser would otherwise restore it on the back button.
    history.scrollRestoration = 'manual';
    const remember = () => { if (screenRef.current === 'config') settingsScroll.current = window.scrollY; };
    window.addEventListener('scroll', remember, { passive: true });
    return () => window.removeEventListener('scroll', remember);
  }, []);
  useLayoutEffect(() => {
    if (screenRef.current === screen) return;
    screenRef.current = screen;
    window.scrollTo(0, screen === 'config' ? settingsScroll.current : 0);
  }, [screen]);

  // Rest turns the screen green so effort and recovery read at a glance from the floor.
  const isBreak = activeTab === 'workout' && workoutState === 'active' && activeInterval?.type === 'rest';

  return (
    <div className={`min-h-dvh overflow-x-clip text-white transition-colors duration-500 ${isBreak ? 'bg-grass' : 'bg-brick'}`}>
      <div className="relative w-full max-w-md min-h-dvh mx-auto px-5 pt-5 pb-6 flex flex-col gap-[22px]">
        <Header
          onHome={goHome}
          statsOpen={activeTab === 'stats'}
          onToggleStats={() => (activeTab === 'stats' ? closeStats() : openStats())}
          soundOn={session.sound.beeps || (session.sound.voice && session.speechSupported)}
          onOpenSound={() => { setShowSound(true); track('reglages-son'); }}
          accountInitial={auth.enabled ? accountInitial(auth.user) : null}
          onOpenAccount={() => { setShowAccount(true); track('compte'); }}
        />

        {activeTab === 'stats' ? (
          <StatsScreen
            history={session.history}
            onBack={closeStats}
            onClear={session.clearHistory}
            account={<AccountCard auth={auth} />}
          />
        ) : (
          <>
            {workoutState === 'config' && <ConfigScreen session={session} onOpenHistory={openStats} />}

            {workoutState === 'summary' && summaryPlanGroups && (
              <SummaryScreen
                title={session.activePreset?.name ?? 'Ta séance'}
                backLabel={session.activePreset ? 'Séances prédéfinies' : 'Réglages'}
                minutes={session.plannedMinutes}
                rythme={config.rythme}
                plan={summaryPlanGroups}
                onBack={session.handleBackToConfig}
                onRegenerate={session.planKind === 'random' ? session.handleRegeneratePlan : undefined}
                withoutWeight={session.activePreset && presetUsesWeight(session.activePreset)
                  ? { checked: !!config.presetWithoutWeight, onChange: session.setPresetWithoutWeight }
                  : undefined}
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
                onOpenStats={openStats}
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
          onOpenStats={() => { setShowAccount(false); openStats(); }}
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
