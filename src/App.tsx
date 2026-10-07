import { useState } from 'react';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { AppTab, Header } from './components/Header';
import { Footer } from './components/Footer';
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

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#FF6321] selection:text-white">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        soundEnabled={session.soundEnabled}
        onToggleSound={() => session.setSoundEnabled(prev => !prev)}
      />

      {/* DYNAMIC FEEDBACK TOAST */}
      {feedbackMessage && (
        <div className="bg-[#FF6321] text-black font-extrabold text-xs sm:text-sm text-center py-2 px-4 shadow-lg sticky top-0 z-40 transition-all uppercase tracking-wider">
          {feedbackMessage}
        </div>
      )}

      {activeTab === 'guide' ? (
        <GuideScreen onOpenWorkout={() => setActiveTab('workout')} />
      ) : (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
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
            <PlayerScreen session={session} activeInterval={activeInterval} />
          )}

          {workoutState === 'completed' && (
            <CompletedScreen durationMinutes={config.durationMinutes || 30} onRestart={session.resetWorkout} />
          )}
        </main>
      )}

      <Footer />
    </div>
  );
}
