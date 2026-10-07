import { Auth } from '../hooks/useAuth';

interface AccountCardProps {
  auth: Auth;
  // Short version for the end of a session; shown only when signed out.
  compact?: boolean;
}

// Google sign-in to keep the history across devices; hidden when accounts aren't configured.
export function AccountCard({ auth, compact = false }: AccountCardProps) {
  if (!auth.enabled) return null;

  if (auth.user) {
    if (compact) return null;
    const name = auth.user.user_metadata?.full_name || auth.user.email;
    return (
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-sand">Connecté{name ? ` : ${name}` : ''}</span>
        <button onClick={auth.signOut} className="h-11 font-semibold underline underline-offset-4 cursor-pointer">
          Se déconnecter
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-cream text-ink rounded-[18px] px-4 py-3.5 flex flex-col gap-2.5">
      <div className="flex flex-col gap-0.5">
        <span className="font-display font-bold text-lg leading-tight">Garde ton historique</span>
        <span className="text-[15px] text-clay leading-snug">
          {compact
            ? 'Connecte-toi pour ne pas perdre tes séances.'
            : 'Connecte-toi pour retrouver tes séances sur tous tes appareils.'}
        </span>
      </div>
      <button
        id="btn-sign-in"
        onClick={auth.signIn}
        className="h-12 rounded-[14px] bg-ink text-cream font-semibold text-[15px] cursor-pointer"
      >
        Se connecter avec Google
      </button>
    </div>
  );
}
