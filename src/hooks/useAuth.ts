import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { track } from '../lib/analytics';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config';
import { isNativeApp } from '../lib/native';

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

// Google sign-in through Supabase. `enabled` is false when no project is configured or
// Google is not switched on in it, and in the Android app until its native sign-in exists
// (Google refuses its web sign-in page inside an app).
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [googleAvailable, setGoogleAvailable] = useState(false);

  useEffect(() => {
    if (supabase && !isNativeApp) googleSignInAvailable().then(setGoogleAvailable);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = () => {
    track('connexion-google');
    // Google sends the runner back to the app's home page, where the session is picked up.
    supabase?.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + import.meta.env.BASE_URL },
    });
  };

  const signOut = () => {
    supabase?.auth.signOut();
  };

  // A signed-in user keeps seeing their account even if the settings check fails (offline).
  return { enabled: !!supabase && (googleAvailable || !!user), user, signIn, signOut };
}

export type Auth = ReturnType<typeof useAuth>;
