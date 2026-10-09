import type { CapacitorConfig } from '@capacitor/cli';

// The Android app wraps the web build (`npm run build:android`), served from inside the app.
const config: CapacitorConfig = {
  appId: 'app.coriace',
  appName: 'Coriace',
  webDir: 'dist',
  backgroundColor: '#A13D2B',
  plugins: {
    // The page keeps clear of the status and navigation bars, which take the brick colour.
    SystemBars: { insetsHandling: 'native', style: 'DARK' },
  },
};

export default config;
