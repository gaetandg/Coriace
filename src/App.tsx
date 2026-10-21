import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { User } from '@supabase/supabase-js';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { Header } from './components/Header';
import { TAB_BAR_HEIGHT, TabBar, TabBarTab } from './components/TabBar';
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
import { categoryLabel, presetUsesWeight } from './sessions';
import { HOME, SitePage, pageAt, pagePath, pageText } from './pages';
import { ExerciseList, ExercisePage } from './components/exercises/ExercisePages';
import { ArticleList, ArticlePage, AuthorPage, SHOW_DRAFTS } from './components/articles/ArticlePages';
import { AUTHOR } from './articles';
import { useArticles } from './hooks/useArticles';
import { PresetCategory } from './sessions';

const accountInitial = (user: User | null) =>
  user ? ((user.user_metadata?.full_name as string | undefined) || user.email || '?').charAt(0).toUpperCase() : '';

type AppTab = 'workout' | 'stats' | 'exercises' | 'articles';

export default function App() {
  // Opened at a page's address (coriace.app/marathon/…): the app starts on that page.
  const [landingPage] = useState(() => pageAt(window.location.pathname, import.meta.env.BASE_URL, SHOW_DRAFTS));
  const [activeTab, setActiveTab] = useState<AppTab>(
    landingPage.kind === 'exercises' || landingPage.kind === 'exercise' ? 'exercises'
      : landingPage.kind === 'articles' || landingPage.kind === 'article' || landingPage.kind === 'author' ? 'articles'
      : 'workout',
  );
  // On the articles tab: the article open (its slug), the author's page (AUTHOR.slug), or null for the list.
  const [articleView, setArticleView] = useState<string | null>(
    landingPage.kind === 'article' ? landingPage.slug : landingPage.kind === 'author' ? AUTHOR.slug : null,
  );
  // On the exercises tab: the exercise whose page is open, or null for the list.
  const [exerciseId, setExerciseId] = useState<string | null>(landingPage.kind === 'exercise' ? landingPage.exerciseId : null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [showSound, setShowSound] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const notify = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const auth = useAuth(notify);
  const articles = useArticles(SHOW_DRAFTS);
  // The article open, if it is one of those shown.
  const article = articles.find(a => a.slug === articleView);
  const session = useWorkoutSession(notify, auth.user?.id ?? null, landingPage.kind === 'category' ? landingPage.category : null);
  const { config, workoutState, activeInterval, summaryPlanGroups } = session;

  // Phone back button, from the deepest level: sheets, stats, then the workout screens.
  useBackHandler(workoutState === 'summary', session.handleBackToConfig);
  const categoryOpen = workoutState === 'config' && session.mode === 'preset' && session.presetCategory !== null;
  useBackHandler(categoryOpen, () => session.setPresetCategory(null));
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
  // The exercise pages: an exercise leads back to the list, the list to the home screen.
  const openExercises = () => { setActiveTab('exercises'); setExerciseId(null); };
  const closeExercises = () => { setActiveTab('workout'); setExerciseId(null); };
  useBackHandler(activeTab === 'exercises' && exerciseId === null, closeExercises);
  useBackHandler(activeTab === 'exercises' && exerciseId !== null, () => setExerciseId(null));
  // The articles: an article or the author's page leads back to the list, the list to the home screen.
  const openArticles = () => { setActiveTab('articles'); setArticleView(null); };
  const closeArticles = () => { setActiveTab('workout'); setArticleView(null); };
  useBackHandler(activeTab === 'articles' && articleView === null, closeArticles);
  useBackHandler(activeTab === 'articles' && articleView !== null, () => setArticleView(null));
  const openCategory = (category: PresetCategory) => {
    closeExercises();
    session.setMode('preset');
    session.setPresetCategory(category);
  };
  useBackHandler(showSound, () => setShowSound(false));
  useBackHandler(showAccount, () => setShowAccount(false));

  // The address bar and tab title follow the page shown: an exercise page, or the page of ready-made
  // sessions in use, also during one of its sessions, so a reload or a shared link comes back to it.
  // Replaced rather than pushed: the back button is handled above. Also run after its moves through
  // history, which can land on an entry with another address.
  const page: SitePage = activeTab === 'exercises'
    ? (exerciseId ? { kind: 'exercise', exerciseId } : { kind: 'exercises' })
    : activeTab === 'articles'
    ? (articleView === AUTHOR.slug ? { kind: 'author' } : articleView ? { kind: 'article', slug: articleView } : { kind: 'articles' })
    : session.mode === 'preset' && session.presetCategory ? { kind: 'category', category: session.presetCategory } : HOME;
  const pathShown = pagePath(page, import.meta.env.BASE_URL);
  const titleShown = pageText(page).title;
  useEffect(() => {
    document.title = titleShown;
    const showPath = () => {
      if (window.location.pathname === pathShown) return;
      window.history.replaceState(window.history.state, '', pathShown + window.location.search + window.location.hash);
    };
    showPath();
    window.addEventListener('popstate', showPath);
    return () => window.removeEventListener('popstate', showPath);
  }, [pathShown, titleShown]);

  // The logo leads home, except during a session, which only "Quitter" ends.
  const goHome = () => {
    if (workoutState === 'active') return;
    setShowSound(false);
    setShowAccount(false);
    setActiveTab('workout');
    setExerciseId(null);
    setArticleView(null);
    if (workoutState === 'summary') session.handleBackToConfig();
    if (workoutState === 'completed') session.resetWorkout();
    session.setPresetCategory(null);
  };

  // Every new screen opens at the top. Coming back to the settings, to a page of ready-made
  // sessions from one of them, or to the list of exercises from one, finds it where it was left.
  const screen = activeTab === 'stats' ? 'stats'
    : activeTab === 'exercises' ? (exerciseId ? `exercise:${exerciseId}` : 'exercises')
    : activeTab === 'articles' ? (articleView ? `article:${articleView}` : 'articles')
    : categoryOpen ? `category:${session.presetCategory}` : workoutState;
  const screenRef = useRef(screen);
  const scrolls = useRef<Record<string, number>>({});
  const keepsScroll = (s: string) => s === 'config' || s === 'exercises' || s === 'articles' || s.startsWith('category:');
  useEffect(() => {
    // The app places the scroll itself; the browser would otherwise restore it on the back button.
    history.scrollRestoration = 'manual';
    const remember = () => { if (keepsScroll(screenRef.current)) scrolls.current[screenRef.current] = window.scrollY; };
    window.addEventListener('scroll', remember, { passive: true });
    return () => window.removeEventListener('scroll', remember);
  }, []);
  useLayoutEffect(() => {
    if (screenRef.current === screen) return;
    const from = screenRef.current;
    screenRef.current = screen;
    // A page opened from the home screen or an exercise starts at the top.
    if ((from === 'config' || from.startsWith('exercise:')) && screen.startsWith('category:')) delete scrolls.current[screen];
    if (screen === 'exercises' && !from.startsWith('exercise:')) delete scrolls.current[screen];
    if (screen === 'articles' && !from.startsWith('article:')) delete scrolls.current[screen];
    window.scrollTo(0, keepsScroll(screen) ? scrolls.current[screen] ?? 0 : 0);
  }, [screen]);

  // The menu at the bottom, except during a session and on the screen that launches it.
  const showTabBar = workoutState !== 'active' && workoutState !== 'summary';
  const tabBarTab: TabBarTab = activeTab === 'stats' ? 'stats' : activeTab === 'articles' ? 'articles' : 'sessions';
  const selectTab = (tab: TabBarTab) => {
    if (tab === 'stats') {
      if (activeTab !== 'stats') openStats();
    } else if (tab === 'articles') {
      openArticles();
    } else {
      goHome();
    }
  };

  // Rest turns the screen green so effort and recovery read at a glance from the floor.
  const isBreak = activeTab === 'workout' && workoutState === 'active' && activeInterval?.type === 'rest';

  return (
    <div
      className={`min-h-dvh overflow-x-clip text-white transition-colors duration-500 ${isBreak ? 'bg-grass' : 'bg-brick'}`}
      style={{ '--tab-bar': showTabBar ? TAB_BAR_HEIGHT : '0px' } as CSSProperties}
    >
      <div className="relative w-full max-w-md min-h-dvh mx-auto px-5 pt-5 pb-[calc(1.5rem+var(--tab-bar))] flex flex-col gap-[22px]">
        <Header
          onHome={goHome}
          soundOn={session.sound.beeps || (session.sound.voice && session.speechSupported)}
          onOpenSound={() => { setShowSound(true); track('reglages-son'); }}
          accountInitial={auth.enabled ? accountInitial(auth.user) : null}
          onOpenAccount={() => { setShowAccount(true); track('compte'); }}
        />

        {activeTab === 'stats' ? (
          <StatsScreen
            history={session.history}
            canRedo={session.canRedo}
            onRedo={entry => { setActiveTab('workout'); session.redoSession(entry); }}
            onBack={closeStats}
            onClear={session.clearHistory}
            account={<AccountCard auth={auth} />}
          />
        ) : activeTab === 'articles' ? (
          articleView === AUTHOR.slug ? (
            <AuthorPage onBack={() => setArticleView(null)} />
          ) : article ? (
            <ArticlePage article={article} onBack={() => setArticleView(null)} onOpen={setArticleView} onOpenAuthor={() => setArticleView(AUTHOR.slug)} />
          ) : (
            <ArticleList articles={articles} onBack={closeArticles} onOpen={setArticleView} onOpenAuthor={() => setArticleView(AUTHOR.slug)} />
          )
        ) : activeTab === 'exercises' ? (
          exerciseId ? (
            <ExercisePage exerciseId={exerciseId} onBack={() => setExerciseId(null)} onOpen={setExerciseId} onOpenCategory={openCategory} />
          ) : (
            <ExerciseList onBack={closeExercises} onOpen={setExerciseId} />
          )
        ) : (
          <>
            {workoutState === 'config' && <ConfigScreen session={session} onOpenHistory={openStats} onOpenExercises={openExercises} />}

            {workoutState === 'summary' && summaryPlanGroups && (
              <SummaryScreen
                title={session.activePreset?.name ?? 'Ta séance'}
                backLabel={session.activePreset && session.presetCategory ? categoryLabel(session.presetCategory) : 'Réglages'}
                minutes={session.plannedMinutes}
                rythme={config.rythme}
                plan={summaryPlanGroups}
                onBack={session.handleBackToConfig}
                onRegenerate={session.planKind === 'random' ? session.handleRegeneratePlan : undefined}
                onRhythmChange={session.activePreset ? session.setPresetRhythm : undefined}
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

        {/* Also the way to the privacy policy in the Android app, which the Play Store requires. */}
        {activeTab === 'workout' && workoutState === 'config' && !categoryOpen && (
          <footer className="text-sm text-sand">
            <a href={`${import.meta.env.BASE_URL}conditions.html`} className="underline">Conditions d'utilisation</a>
            {' · '}
            <a href={`${import.meta.env.BASE_URL}confidentialite.html`} className="underline">Confidentialité</a>
          </footer>
        )}
      </div>

      {showTabBar && <TabBar active={tabBarTab} onSelect={selectTab} />}

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
