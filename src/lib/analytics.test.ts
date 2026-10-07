import { afterEach, describe, expect, it, vi } from 'vitest';
import { track } from './analytics';

afterEach(() => vi.unstubAllGlobals());

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
