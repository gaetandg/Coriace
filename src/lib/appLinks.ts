import { SITE_URL } from '../pages';

// A coriace.app link opened in the Android app (Android App Links, public/.well-known/assetlinks.json):
// the page it leads to inside the app, or null for any other address.
export function appLinkPath(url: string, base = '/'): string | null {
  try {
    const link = new URL(url);
    if (link.origin !== SITE_URL) return null;
    return base + link.pathname.replace(/^\//, '') + link.search + link.hash;
  } catch {
    return null;
  }
}
