import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { track } from '../lib/analytics';
import { GOOGLE_WEB_CLIENT_ID, SUPABASE_ANON_KEY, SUPABASE_URL } from '../config';
import { isNativeApp } from '../lib/native';
import { GoogleSignIn, signInNonce } from '../lib/googleSignIn';

// Asks the project whether Google sign-in is switched on, so the button never leads to an error.
async function googleSignInAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_ANON_KEY } });
    const settings = await response.json();
    return settings?.external?.google === true;
  } catch {
    return false;
  }
}

// Google sign-in through Supabase. `enabled` is false when no project is configured or Google is
// not switched on in it. The Android app signs in with the phone's Google account (Google refuses
// its web sign-in page inside an app), and only once its web client id is set.
export function useAuth(notify: (message: string) => void) {
  const [user, setUser] = useState<User | null>(null);
  const [googleAvailable, setGoogleAvailable] = useState(false);

  useEffect(() => {
    if (supabase && (!isNativeApp || GOOGLE_WEB_CLIENT_ID)) googleSignInAvailable().then(setGoogleAvailable);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const signInInApp = async () => {
    if (!supabase) return;
    try {
      const nonce = await signInNonce();
      const { idToken } = await GoogleSignIn.signIn({ clientId: GOOGLE_WEB_CLIENT_ID, nonce: nonce.hashed });
      const { error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken, nonce: nonce.raw });
      if (error) throw error;
    } catch (error) {
      // Closing Google's window is a choice, not a failure.
      if ((error as { code?: string })?.code !== 'canceled') notify('La connexion n\'a pas abouti. Réessaie dans un moment.');
    }
  };

  const signIn = () => {
    track('connexion-google');
    if (isNativeApp) {
      signInInApp();
      return;
    }
    // Google sends the runner back to the app's home page, where the session is picked up.
    supabase?.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + import.meta.env.BASE_URL },
    });
  };

  const signOut = () => {
    supabase?.auth.signOut();
    if (isNativeApp) GoogleSignIn.signOut().catch(() => {});
  };

  // Deletes the account and the history saved on it, for good (supabase/migrations: delete_my_account).
  // The sessions kept on this device stay, as for a runner without an account.
  const deleteAccount = async (): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase.rpc('delete_my_account');
    if (error) {
      notify('La suppression n\'a pas abouti. Réessaie dans un moment.');
      return false;
    }
    // The session no longer exists on the server: only this device has to forget it.
    await supabase.auth.signOut({ scope: 'local' });
    if (isNativeApp) GoogleSignIn.signOut().catch(() => {});
    track('compte-supprime');
    notify('Ton compte est supprimé.');
    return true;
  };

  // A signed-in user keeps seeing their account even if the settings check fails (offline).
  return { enabled: !!supabase && (googleAvailable || !!user), user, signIn, signOut, deleteAccount };
}

export type Auth = ReturnType<typeof useAuth>;
