import { useState } from 'react';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { AppTab, Header } from './components/Header';
import { GuideScreen } from './components/GuideScreen';
import { ConfigScreen } from './components/config/ConfigScreen';
import { SummaryScreen } from './components/summary/SummaryScreen';
import { PlayerScreen } from './components/player/PlayerScreen';
import { CompletedScreen } from './components/CompletedScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('workout');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const notify = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const session = useWorkoutSession(notify);
  const { config, workoutState, activeInterval, summaryPlanGroups } = session;

  // Rest turns the screen green so effort and recovery read at a glance from the floor.
  const isBreak = activeTab === 'workout' && workoutState === 'active' && activeInterval?.type === 'rest';

  return (
    <div className={`min-h-dvh overflow-x-clip text-white transition-colors duration-500 ${isBreak ? 'bg-grass' : 'bg-brick'}`}>
      <div className="relative w-full max-w-md min-h-dvh mx-auto px-5 pt-5 pb-6 flex flex-col gap-[22px]">
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          soundEnabled={session.soundEnabled}
          onToggleSound={session.toggleSound}
        />

        {activeTab === 'guide' ? (
          <GuideScreen onOpenWorkout={() => setActiveTab('workout')} />
        ) : (
          <>
            {workoutState === 'config' && <ConfigScreen session={session} />}

            {workoutState === 'summary' && summaryPlanGroups && (
              <SummaryScreen
                config={config}
                plan={summaryPlanGroups}
                onBack={session.handleBackToConfig}
                onRegenerate={session.handleRegeneratePlan}
                onLaunch={session.handleLaunchWorkout}
              />
            )}

            {workoutState === 'active' && activeInterval && (
              <PlayerScreen session={session} activeInterval={activeInterval} isBreak={isBreak} />
            )}

            {workoutState === 'completed' && summaryPlanGroups && (
              <CompletedScreen
                durationMinutes={config.durationMinutes || 30}
                exerciseCount={summaryPlanGroups.circuitExercises.length + summaryPlanGroups.finishers.length}
                rythme={config.rythme}
                onRestart={session.resetWorkout}
              />
            )}
          </>
        )}
      </div>

      {feedbackMessage && (
        <div role="status" className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 max-w-[90vw] bg-ink text-cream font-semibold text-sm px-5 py-3 rounded-full shadow-lg">
          {feedbackMessage}
        </div>
      )}
    </div>
  );
}
