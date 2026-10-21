import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PROMPTS, endCard, loadPrompts, refuseInstall, savePrompts, shouldAskReview } from './prompts';
import { installRoute, playStoreLink } from './install';

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
  });
});

const device = { native: false, standalone: false, maxTouchPoints: 0 };
const ANDROID = 'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36';
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1';
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15';

describe('installRoute', () => {
  it('sends Android and computers to Google Play', () => {
    expect(installRoute({ ...device, userAgent: ANDROID })).toBe('play');
    expect(installRoute({ ...device, userAgent: MAC })).toBe('play');
  });

  it('shows the home screen steps on an iPhone and an iPad', () => {
    expect(installRoute({ ...device, userAgent: IPHONE })).toBe('home-screen');
    expect(installRoute({ ...device, userAgent: MAC, maxTouchPoints: 5 })).toBe('home-screen');
  });

  it('offers nothing in the Android app or the installed site', () => {
    expect(installRoute({ ...device, userAgent: ANDROID, native: true })).toBeNull();
    expect(installRoute({ ...device, userAgent: IPHONE, standalone: true })).toBeNull();
  });

  it('tells the Play Console where the link was', () => {
    const url = new URL(playStoreLink('article'));
    expect(url.searchParams.get('id')).toBe('app.coriace');
    expect(url.searchParams.get('referrer')).toBe('utm_source=coriace.app&utm_medium=site&utm_campaign=article');
  });
});

describe('endCard', () => {
  it('offers the app at the end of the first session', () => {
    expect(endCard(1, 'play', DEFAULT_PROMPTS)).toBe('install');
    expect(endCard(1, null, DEFAULT_PROMPTS)).toBeNull();
  });

  it('offers it again three sessions after a refusal, and never after two', () => {
    let state = refuseInstall(DEFAULT_PROMPTS, 1);
    expect(endCard(2, 'play', state)).toBeNull();
    expect(endCard(4, 'play', state)).toBe('install');
    state = refuseInstall(state, 4);
    expect(endCard(7, 'play', { ...state, feedbackShown: true })).toBeNull();
    expect(endCard(20, 'play', { ...state, feedbackShown: true })).toBeNull();
  });

  it('stops once the app is installed', () => {
    expect(endCard(2, 'play', { ...DEFAULT_PROMPTS, installDone: true })).toBeNull();
  });

  it('asks for an opinion once, from the third session, after the app when both are due', () => {
    const installed = { ...DEFAULT_PROMPTS, installDone: true };
    expect(endCard(2, null, installed)).toBeNull();
    expect(endCard(3, null, installed)).toBe('feedback');
    expect(endCard(3, 'play', DEFAULT_PROMPTS)).toBe('install');
    expect(endCard(4, null, { ...installed, feedbackShown: true })).toBeNull();
  });
});

describe('shouldAskReview', () => {
  const now = Date.parse('2026-10-21T12:00:00Z');

  it('asks in the Android app from the fifth session', () => {
    expect(shouldAskReview(true, 4, null, DEFAULT_PROMPTS, now)).toBe(false);
    expect(shouldAskReview(true, 5, null, DEFAULT_PROMPTS, now)).toBe(true);
    expect(shouldAskReview(false, 10, null, DEFAULT_PROMPTS, now)).toBe(false);
  });

  it('never where Coriace asks for an opinion itself', () => {
    expect(shouldAskReview(true, 8, 'feedback', DEFAULT_PROMPTS, now)).toBe(false);
  });

  it('waits a month before asking again', () => {
    expect(shouldAskReview(true, 9, null, { ...DEFAULT_PROMPTS, reviewAskedAt: '2026-10-01T12:00:00Z' }, now)).toBe(false);
    expect(shouldAskReview(true, 9, null, { ...DEFAULT_PROMPTS, reviewAskedAt: '2026-09-20T12:00:00Z' }, now)).toBe(true);
  });
});

describe('prompts storage', () => {
  it('uses the defaults when nothing is saved, or something unreadable', () => {
    expect(loadPrompts()).toEqual(DEFAULT_PROMPTS);
    store.set('coriace:prompts:v1', '{');
    expect(loadPrompts()).toEqual(DEFAULT_PROMPTS);
  });

  it('round-trips the saved state', () => {
    const state = { installRefusals: 1, installNextAt: 4, installDone: false, feedbackShown: true, reviewAskedAt: '2026-10-01T12:00:00.000Z' };
    savePrompts(state);
    expect(loadPrompts()).toEqual(state);
  });
});
