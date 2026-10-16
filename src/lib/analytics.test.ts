import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadAnalytics, track } from './analytics';

const platform = vi.hoisted(() => ({ native: false }));
vi.mock('./native', () => ({ get isNativeApp() { return platform.native; } }));

afterEach(() => vi.unstubAllGlobals());

// The Umami script tag the app adds to the page.
function loadedScript() {
  const added: { src?: string; dataset: Record<string, string> }[] = [];
  vi.stubGlobal('document', {
    createElement: () => ({ dataset: {} }),
    head: { appendChild: (el: { src?: string; dataset: Record<string, string> }) => added.push(el) },
  });
  loadAnalytics();
  return added[0];
}

describe('loadAnalytics', () => {
  it('counts only the published site in a browser', () => {
    platform.native = false;
    const script = loadedScript();
    expect(script.src).toBe('https://cloud.umami.is/script.js');
    expect(script.dataset).toMatchObject({ domains: 'coriace.app', doNotTrack: 'true' });
    expect(script.dataset.tag).toBeUndefined();
  });

  it('counts the Android app, served from inside it, tagged apart', () => {
    platform.native = true;
    const script = loadedScript();
    expect(script.dataset).toMatchObject({ tag: 'android', doNotTrack: 'true' });
    expect(script.dataset.domains).toBeUndefined();
  });
});

describe('track', () => {
  it('passes events to Umami when it is loaded', () => {
    const umamiTrack = vi.fn();
    vi.stubGlobal('window', { umami: { track: umamiTrack } });
    track('seance-lancee', { minutes: 30 });
    expect(umamiTrack).toHaveBeenCalledWith('seance-lancee', { minutes: 30 });
  });

  it('does nothing when Umami is missing or fails', () => {
    vi.stubGlobal('window', {});
    expect(() => track('statistiques')).not.toThrow();
    vi.stubGlobal('window', { umami: { track: () => { throw new Error('blocked'); } } });
    expect(() => track('statistiques')).not.toThrow();
  });
});
