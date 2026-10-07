import { UMAMI_WEBSITE_ID } from '../config';

// Audience measurement with Umami: no cookie, no personal data, visits from browsers asking
// not to be tracked are ignored. Only the published site counts, not local development.

declare global {
  interface Window {
    umami?: { track: (event?: string, data?: Record<string, string | number | boolean>) => void };
  }
}

const SCRIPT = 'https://cloud.umami.is/script.js';
const SITE_DOMAIN = 'gaetandg.github.io';

export function loadAnalytics() {
  if (!UMAMI_WEBSITE_ID || typeof document === 'undefined') return;
  const script = document.createElement('script');
  script.src = SCRIPT;
  script.defer = true;
  script.dataset.websiteId = UMAMI_WEBSITE_ID;
  script.dataset.domains = SITE_DOMAIN;
  script.dataset.doNotTrack = 'true';
  document.head.appendChild(script);
}

// Events are dropped silently when Umami isn't loaded (offline, blocked, not configured).
export function track(event: string, data?: Record<string, string | number | boolean>) {
  try {
    window.umami?.track(event, data);
  } catch {
    // Measurement must never break the app.
  }
}
