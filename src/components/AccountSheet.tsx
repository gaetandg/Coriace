import { Auth } from '../hooks/useAuth';

interface AccountSheetProps {
  auth: Auth;
  onOpenHistory: () => void;
  onClose: () => void;
}

// Bottom sheet opened from the header: Google sign-in, or the signed-in account.
export function AccountSheet({ auth, onOpenHistory, onClose }: AccountSheetProps) {
  const user = auth.user;
  const name = user?.user_metadata?.full_name as string | undefined;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-title"
        className="w-full max-w-md bg-cream text-ink rounded-t-3xl px-6 pt-6 pb-8 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="account-title" className="font-display font-extrabold text-[30px] leading-tight">Compte</h2>

        {user ? (
          <>
            <div className="flex flex-col gap-0.5">
              {name && <span className="font-semibold text-lg">{name}</span>}
              <span className="text-[15px] text-clay">{user.email}</span>
            </div>
            <p className="text-[15px] leading-snug">Ton historique est sauvegardé sur ton compte et synchronisé entre tes appareils.</p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={onOpenHistory}
                className="h-14 rounded-[18px] border-[1.5px] border-ink/40 font-semibold cursor-pointer"
              >
                Voir l'historique
              </button>
              <button
                id="btn-sign-out"
                onClick={() => { auth.signOut(); onClose(); }}
                className="h-12 font-semibold underline underline-offset-4 cursor-pointer"
              >
                Se déconnecter
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-[15px] leading-snug">
              Connecte-toi pour garder ton historique et le retrouver sur tous tes appareils. Les séances déjà faites sur ce téléphone sont reprises.
            </p>
            <button
              id="btn-sheet-sign-in"
              onClick={auth.signIn}
              className="h-14 rounded-[18px] bg-ink text-cream font-semibold text-base cursor-pointer"
            >
              Se connecter avec Google
            </button>
            <p className="text-[13px] text-clay leading-snug">
              En te connectant, tu acceptes les <a href="conditions.html" className="underline">conditions d'utilisation</a> et
              la <a href="confidentialite.html" className="underline">politique de confidentialité</a>.
            </p>
          </>
        )}

        {user && (
          <p className="text-[13px] text-clay">
            <a href="conditions.html" className="underline">Conditions d'utilisation</a>
            {' · '}
            <a href="confidentialite.html" className="underline">Confidentialité</a>
          </p>
        )}

        <button onClick={onClose} className="h-14 rounded-[18px] bg-ink/10 font-display font-extrabold text-lg cursor-pointer">
          Fermer
        </button>
      </div>
    </div>
  );
}
