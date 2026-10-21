import { registerPlugin } from '@capacitor/core';

// The Android app's Google sign-in (android/app/src/main/java/app/coriace/GoogleSignInPlugin.java):
// the phone's account picker, then Google's ID token for Supabase.
interface GoogleSignInPlugin {
  signIn(options: { clientId: string; nonce: string }): Promise<{ idToken: string }>;
  signOut(): Promise<void>;
}

export const GoogleSignIn = registerPlugin<GoogleSignInPlugin>('GoogleSignIn');

const hex = (buffer: ArrayBuffer) => [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');

// A fresh nonce for each sign-in: Google puts its hash in the token, Supabase checks it against
// the nonce itself, so a token caught on the way can't be replayed.
export async function signInNonce(): Promise<{ raw: string; hashed: string }> {
  const raw = crypto.randomUUID();
  const hashed = hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)));
  return { raw, hashed };
}
