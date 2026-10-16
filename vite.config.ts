import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {Plugin, defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import {staticPages} from './src/staticPages';

// The Android app ships its files inside the app: no service worker there.
const androidBuild = process.env.BUILD_TARGET === 'android';

// One HTML file per page (home, each race distance, targeted sessions) with its own title,
// description and text readable without JavaScript, plus the sitemap and robots.txt.
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
      for (const file of staticPages(String(index.source), base)) {
        if (file.fileName === 'index.html') index.source = file.source;
        else this.emitFile({type: 'asset', fileName: file.fileName, source: file.source});
      }
    },
  };
}

export default defineConfig(() => {
  return {
    // Served at the root of coriace.app; BASE_PATH allows hosting under a sub-path.
    base: process.env.BASE_PATH || '/',
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
          icons: [
            {src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png'},
            {src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png'},
            {src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
          ],
        },
        workbox: {
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
