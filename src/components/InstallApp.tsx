import { useEffect, useState } from 'react';
import { Share } from 'lucide-react';
import { InstallPlace, InstallRoute, installRoute, playAppInstalled, playStoreLink, thisDevice } from '../lib/install';
import { track } from '../lib/analytics';

// How this device gets the app; null in the app itself, or once the Play Store app is on the phone.
export function useInstallRoute(): InstallRoute {
  const [route, setRoute] = useState<InstallRoute>(() => installRoute(thisDevice()));
  useEffect(() => {
    if (route === 'play') playAppInstalled().then(installed => { if (installed) setRoute(null); });
  }, []);
  return route;
}

// Google's own badge, as its guidelines ask (public/google-play-badge.png, unchanged).
export function PlayBadge({ place, onOpen }: { place: InstallPlace; onOpen?: () => void }) {
  return (
    <a
      href={playStoreLink(place)}
      target="_blank"
      rel="noopener"
      onClick={() => { track('installation-cliquee', { emplacement: place }); onOpen?.(); }}
      className="self-start -ml-1.5"
    >
      <img src={`${import.meta.env.BASE_URL}google-play-badge.png`} alt="Disponible sur Google Play" width={162} height={63} />
    </a>
  );
}

// Safari can't add the site to the home screen on its own: these are the steps.
export function HomeScreenSteps() {
  return (
    <span>
      Touche Partager <Share className="inline w-4 h-4 -mt-1" aria-hidden="true" />, puis « Sur l'écran d'accueil ».
    </span>
  );
}

const card = 'relative bg-cream text-ink rounded-[18px] px-4 py-3.5 flex flex-col gap-2.5';

// At the end of a session, in place of the sign-in card when the app is due.
export function InstallCard({ route, onDone, onLater }: { route: Exclude<InstallRoute, null>; onDone: () => void; onLater: () => void }) {
  return (
    <div id="card-install" className={card}>
      <div className="flex flex-col gap-0.5">
        <span className="font-display font-bold text-lg leading-tight">
          {route === 'play' ? 'Coriace en app' : 'Coriace sur ton écran d\'accueil'}
        </span>
        <span className="text-[15px] text-clay leading-snug">
          {route === 'play'
            ? 'L\'app Android : tes séances d\'un geste, même sans réseau.'
            : <>Elle s'ouvre comme une app, même sans réseau. <HomeScreenSteps /></>}
        </span>
      </div>
      {route === 'play' ? (
        <PlayBadge place="fin-seance" onOpen={onDone} />
      ) : (
        <button onClick={onDone} className="h-12 rounded-[14px] bg-ink text-cream font-semibold text-[15px] cursor-pointer">
          C'est fait
        </button>
      )}
      <button onClick={onLater} className="self-start h-11 font-semibold underline underline-offset-4 cursor-pointer">
        Plus tard
      </button>
    </div>
  );
}

// Under an article: its sessions are in the app.
export function InstallAside({ route }: { route: InstallRoute }) {
  if (!route) return null;
  return (
    <aside id="install-aside" className="bg-cream text-ink rounded-[18px] px-4 py-3.5 flex flex-col gap-1.5">
      <h2 className="font-display font-bold text-[21px] leading-tight">Tes séances dans la poche</h2>
      <p className="text-[15px] leading-snug">
        {route === 'play'
          ? 'Les séances de Coriace, guidées à la voix, dans l\'app Android.'
          : <>Ajoute Coriace à ton écran d'accueil, elle s'ouvre comme une app. <HomeScreenSteps /></>}
      </p>
      {route === 'play' && <PlayBadge place="article" />}
    </aside>
  );
}

// One line, at the foot of the home screen and in the account sheet.
export function InstallLine({ route, place }: { route: InstallRoute; place: InstallPlace }) {
  if (!route) return null;
  if (route === 'home-screen') return <p>Coriace sur ton écran d'accueil ? <HomeScreenSteps /></p>;
  return (
    <p>
      <a href={playStoreLink(place)} target="_blank" rel="noopener" onClick={() => track('installation-cliquee', { emplacement: place })} className="underline">
        L'app Android sur Google Play
      </a>
    </p>
  );
}
