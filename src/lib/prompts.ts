import { InstallRoute } from './install';

// What the end of a session offers besides the stats, one card at a time: installing the app,
// Coriace's own "Ton avis", or else the Google sign-in card (when signed out). And, in the Android
// app, when Google's rating card may open. Remembered in this browser only.

const STORAGE_KEY = 'coriace:prompts:v1';

export interface PromptState {
  installRefusals: number; // "Plus tard" on the install card
  installNextAt: number; // completed sessions from which it shows again
  installDone: boolean; // went to the Play Store, or added the site to the home screen
  feedbackShown: boolean; // "Ton avis" had its one showing
  reviewAskedAt: string | null; // the last time Google's rating card was asked for
}

export const DEFAULT_PROMPTS: PromptState = {
  installRefusals: 0,
  installNextAt: 1,
  installDone: false,
  feedbackShown: false,
  reviewAskedAt: null,
};

export type EndCard = 'install' | 'feedback' | null;

// The install card first, from the first completed session, again three sessions after a "Plus tard",
// never after two. "Ton avis" once, from the third session. Otherwise nothing, which leaves the place
// to the sign-in card.
export function endCard(completed: number, route: InstallRoute, state: PromptState): EndCard {
  if (route && !state.installDone && state.installRefusals < 2 && completed >= state.installNextAt) return 'install';
  if (!state.feedbackShown && completed >= 3) return 'feedback';
  return null;
}

export const refuseInstall = (state: PromptState, completed: number): PromptState =>
  ({ ...state, installRefusals: state.installRefusals + 1, installNextAt: completed + 3 });

const REVIEW_INTERVAL_DAYS = 30;

// Google's rating card, in the Android app: from the fifth session, at most once a month, never at
// the end of a session where Coriace asked for an opinion itself (Google forbids asking anything just
// before its card, or choosing who sees it).
export function shouldAskReview(native: boolean, completed: number, card: EndCard, state: PromptState, now = Date.now()): boolean {
  if (!native || completed < 5 || card === 'feedback') return false;
  return !state.reviewAskedAt || now - Date.parse(state.reviewAskedAt) >= REVIEW_INTERVAL_DAYS * 24 * 60 * 60 * 1000;
}

export function loadPrompts(): PromptState {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!stored || typeof stored !== 'object') return DEFAULT_PROMPTS;
    return {
      installRefusals: Number.isInteger(stored.installRefusals) ? stored.installRefusals : 0,
      installNextAt: Number.isInteger(stored.installNextAt) ? stored.installNextAt : 1,
      installDone: stored.installDone === true,
      feedbackShown: stored.feedbackShown === true,
      reviewAskedAt: typeof stored.reviewAskedAt === 'string' ? stored.reviewAskedAt : null,
    };
  } catch {
    return DEFAULT_PROMPTS;
  }
}

export function savePrompts(state: PromptState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the cards may show again, nothing worse.
  }
}
