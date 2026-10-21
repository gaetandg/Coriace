import { useLayoutEffect, useRef, useState } from 'react';
import { EndCard, endCard, loadPrompts, refuseInstall, savePrompts, shouldAskReview } from '../lib/prompts';
import { InstallRoute } from '../lib/install';
import { isNativeApp } from '../lib/native';
import { requestReview } from '../lib/review';
import { track } from '../lib/analytics';
import { feedbackAvailable } from '../lib/feedback';

// Picks, once per completed session, the card its end screen shows (installing the app, "Ton avis",
// or none, which leaves the place to the sign-in card), and opens Google's rating card when it's due.
export function useEndOfSession(completedScreen: boolean, completed: number, route: InstallRoute) {
  const [card, setCard] = useState<EndCard>(null);
  // A card put away leaves the place empty: one card per end of session.
  const [dismissed, setDismissed] = useState(false);
  // Decided once per end screen, even when React runs the effect twice.
  const decided = useRef(false);

  // Before the screen paints, so the sign-in card doesn't flash in the card's place.
  useLayoutEffect(() => {
    if (!completedScreen) {
      decided.current = false;
      setCard(null);
      setDismissed(false);
      return;
    }
    if (decided.current) return;
    decided.current = true;
    const state = loadPrompts();
    const due = endCard(completed, route, state);
    const next = due === 'feedback' && !feedbackAvailable ? null : due;
    setCard(next);
    if (next === 'install') track('installation-proposee');
    if (next === 'feedback') track('avis-propose');
    const review = shouldAskReview(isNativeApp, completed, next, state);
    savePrompts({
      ...state,
      feedbackShown: state.feedbackShown || next === 'feedback',
      reviewAskedAt: review ? new Date().toISOString() : state.reviewAskedAt,
    });
    if (review) {
      track('note-demandee');
      // Once "Séance terminée" has had a moment on screen.
      setTimeout(requestReview, 1500);
    }
  }, [completedScreen]);

  const laterInstall = () => {
    savePrompts(refuseInstall(loadPrompts(), completed));
    track('installation-refusee');
    dismiss();
  };

  const doneInstall = () => {
    savePrompts({ ...loadPrompts(), installDone: true });
    dismiss();
  };

  const dismiss = () => {
    setCard(null);
    setDismissed(true);
  };

  return { card, showSignIn: card === null && !dismissed, laterInstall, doneInstall, dismiss };
}
