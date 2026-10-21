import { useEffect, useRef } from 'react';
import { App } from '@capacitor/app';
import { isNativeApp } from '../lib/native';
import { appLinkPath } from '../lib/appLinks';

// The launch link already followed, so a reload of the app doesn't follow it again.
const LAUNCH_KEY = 'coriace:launch-link';

// In the Android app, a coriace.app link tapped elsewhere (a message, a search result) opens the
// app on its page: the app starts again at that address, as the site would. Never during a session.
export function useAppLinks(inSession: boolean, notify: (message: string) => void) {
  const inSessionRef = useRef(inSession);
  inSessionRef.current = inSession;

  useEffect(() => {
    if (!isNativeApp) return;
    const open = (url: string) => {
      const path = appLinkPath(url, import.meta.env.BASE_URL);
      if (!path || path === window.location.pathname + window.location.search + window.location.hash) return;
      if (inSessionRef.current) {
        notify('Quitte la séance pour ouvrir ce lien.');
        return;
      }
      window.location.replace(path);
    };
    App.getLaunchUrl().then(launch => {
      if (!launch?.url || sessionStorage.getItem(LAUNCH_KEY) === launch.url) return;
      sessionStorage.setItem(LAUNCH_KEY, launch.url);
      open(launch.url);
    }).catch(() => {});
    const listener = App.addListener('appUrlOpen', event => open(event.url));
    return () => { listener.then(l => l.remove()); };
  }, []);
}
