import { isNativeApp } from './native';
import { PLAY_STORE_URL } from '../pages';

// Where an install link sits, for Umami and the Play Console's acquisition reports (UTM campaign).
export type InstallPlace = 'fin-seance' | 'article' | 'pied-de-page' | 'compte';

export const playStoreLink = (place: InstallPlace) =>
  `${PLAY_STORE_URL}&referrer=${encodeURIComponent(`utm_source=coriace.app&utm_medium=site&utm_campaign=${place}`)}`;

// How this device gets the app: from Google Play (Android, and a computer, from which Google Play
// installs it on the phone), by adding the site to the home screen (iPhone and iPad, no Coriace app
// there), or not at all when the app is what is running.
export type InstallRoute = 'play' | 'home-screen' | null;

export interface Device {
  native: boolean;
  standalone: boolean; // the site opened from the home screen, as an app
  userAgent: string;
  maxTouchPoints: number;
}

export function installRoute(device: Device): InstallRoute {
  if (device.native || device.standalone) return null;
  // iPadOS presents itself as a Mac, one with a touch screen.
  const apple = /iPhone|iPad|iPod/.test(device.userAgent) || (/Macintosh/.test(device.userAgent) && device.maxTouchPoints > 1);
  return apple ? 'home-screen' : 'play';
}

export const thisDevice = (): Device => ({
  native: isNativeApp,
  standalone: typeof window !== 'undefined' &&
    (window.matchMedia?.('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true),
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  maxTouchPoints: typeof navigator !== 'undefined' ? navigator.maxTouchPoints ?? 0 : 0,
});

// On Android, Chrome tells whether the Play Store app is already on the phone (`related_applications`
// in the site's manifest, `asset_statements` in the app's).
export async function playAppInstalled(): Promise<boolean> {
  try {
    const getInstalled = (navigator as { getInstalledRelatedApps?: () => Promise<{ id?: string }[]> }).getInstalledRelatedApps;
    if (!getInstalled) return false;
    const apps = await getInstalled.call(navigator);
    return apps.some(app => app.id === 'app.coriace');
  } catch {
    return false;
  }
}
