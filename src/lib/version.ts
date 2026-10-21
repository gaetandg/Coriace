// Which build is running, shown small in the account sheet. In the Android app, the version
// number of the Play Console; on the site, the commit. Both with the day of the build.
export interface AppVersion {
  code: string | null; // Android version code; null on the site
  commit: string; // short commit hash, or "dev"
  builtAt: string; // YYYY-MM-DD
}

export const APP_VERSION: AppVersion = __APP_VERSION__;

export function versionLabel(version: AppVersion = APP_VERSION): string {
  const day = new Date(`${version.builtAt}T12:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  return version.code ? `Version ${version.code} (${version.commit}) · ${day}` : `Version ${version.commit} · ${day}`;
}
