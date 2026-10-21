import { registerPlugin } from '@capacitor/core';

// Google Play's rating card, inside the Android app (android/app/src/main/java/app/coriace/InAppReviewPlugin.java).
// Google decides whether it actually shows (it limits how often) and never says what was given.
interface InAppReviewPlugin {
  requestReview(): Promise<void>;
}

const InAppReview = registerPlugin<InAppReviewPlugin>('InAppReview');

export const requestReview = () => InAppReview.requestReview().catch(() => {});
