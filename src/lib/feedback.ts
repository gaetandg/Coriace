import { supabase } from './supabase';
import { isNativeApp } from './native';
import { thisDevice } from './install';

// "Ton avis": a mark out of 5 and a few words, saved in Supabase (supabase/migrations: feedback),
// read from its dashboard. Sent without the account, the name or anything else about the runner.

export const MAX_MESSAGE = 2000;

// Without a Supabase project, there is nowhere to send it: nothing asks for it.
export const feedbackAvailable = !!supabase;

export type FeedbackPlatform = 'web' | 'pwa' | 'android';

export const feedbackPlatform = (): FeedbackPlatform =>
  isNativeApp ? 'android' : thisDevice().standalone ? 'pwa' : 'web';

export interface Feedback {
  rating: number | null; // 1 to 5, or none
  message: string;
  sessions: number; // completed sessions so far, to read the opinion in context
}

// Something worth sending: a mark, or a few words.
export const canSend = (feedback: Pick<Feedback, 'rating' | 'message'>) =>
  feedback.rating !== null || feedback.message.trim().length > 0;

export async function sendFeedback(feedback: Feedback): Promise<boolean> {
  if (!supabase || !canSend(feedback)) return false;
  const message = feedback.message.trim().slice(0, MAX_MESSAGE);
  const { error } = await supabase.from('feedback').insert({
    rating: feedback.rating,
    message: message || null,
    platform: feedbackPlatform(),
    sessions: feedback.sessions,
  });
  return !error;
}
