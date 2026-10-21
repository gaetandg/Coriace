import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {Plugin, defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import {execSync} from 'node:child_process';
import {staticPages} from './src/staticPages';
import {shareImage} from './src/ogImage';

// The Android app ships its files inside the app: no service worker there.
const androidBuild = process.env.BUILD_TARGET === 'android';

// One HTML file per page (home, each race distance, targeted sessions, exercises) with its own
// title, description, structured data and text readable without JavaScript, its share image, plus
// the sitemap and robots.txt. The Android app has no use for the share images.
function seoPages(): Plugin {
  let base = '/';
  return {
    name: 'coriace-seo-pages',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      base = config.base;
    },
    generateBundle(_options, bundle) {
      const index = bundle['index.html'];
      if (index?.type !== 'asset') return this.error('index.html is missing from the build');
      // CORIACE_DRAFTS=1 also writes the draft articles, for a local preview.
      for (const file of staticPages(String(index.source), base, process.env.CORIACE_DRAFTS === '1')) {
        if ('card' in file && androidBuild) continue;
        const source = 'card' in file ? shareImage(file.card) : file.source;
        if (file.fileName === 'index.html') index.source = source;
        else this.emitFile({type: 'asset', fileName: file.fileName, source});
      }
    },
  };
}

// The build running, shown small in the account sheet: the Android version code (the Play Console's
// number, passed by CI), the commit and the day of the build.
function buildVersion() {
  let commit = process.env.GITHUB_SHA || '';
  if (!commit) {
    try {
      commit = execSync('git rev-parse HEAD', {stdio: ['ignore', 'pipe', 'ignore']}).toString().trim();
    } catch {
      // Not a git checkout: the version reads "dev".
    }
  }
  return {code: process.env.VERSION_CODE || null, commit: commit.slice(0, 7) || 'dev', builtAt: new Date().toISOString().slice(0, 10)};
}

export default defineConfig(() => {
  return {
    // Served at the root of coriace.app; BASE_PATH allows hosting under a sub-path.
    base: process.env.BASE_PATH || '/',
    define: {__APP_VERSION__: JSON.stringify(buildVersion())},
    plugins: [
      react(),
      tailwindcss(),
      seoPages(),
      VitePWA({
        disable: androidBuild,
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'apple-touch-icon-180x180.png'],
        manifest: {
          name: 'Coriace · Renfo pour coureurs',
          short_name: 'Coriace',
          description: 'Séances de renfo guidées pour les coureurs.',
          lang: 'fr',
          start_url: '.',
          scope: '.',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#A13D2B',
          theme_color: '#A13D2B',
          // The Android app, so that Chrome can tell the site it is already on the phone (the app
          // names the site back in its asset_statements). The site stays installable as it is.
          related_applications: [{platform: 'play', url: 'https://play.google.com/store/apps/details?id=app.coriace', id: 'app.coriace'}],
          prefer_related_applications: false,
          icons: [
            {src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png'},
            {src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png'},
            {src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
          ],
        },
        workbox: {
          // Exercise pages are served by the app itself when offline (navigation fallback).
          globIgnores: ['**/node_modules/**/*', 'exercices/**'],
          // Cache Google Fonts so the app keeps its typography offline.
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {cacheName: 'google-fonts-stylesheets'},
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365},
                cacheableResponse: {statuses: [0, 200]},
              },
            },
          ],
        },
      }),
    ],
  };
});
