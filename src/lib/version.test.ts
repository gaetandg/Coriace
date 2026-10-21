import { describe, expect, it } from 'vitest';
import { APP_VERSION, versionLabel } from './version';

describe('versionLabel', () => {
  it('gives the Play Console number in the Android app', () => {
    expect(versionLabel({ code: '35', commit: 'ea86107', builtAt: '2026-10-22' })).toBe('Version 35 (ea86107) · 22 octobre 2026');
  });

  it('gives the commit on the site', () => {
    expect(versionLabel({ code: null, commit: 'ea86107', builtAt: '2026-10-22' })).toBe('Version ea86107 · 22 octobre 2026');
  });

  it('is written at build time', () => {
    expect(APP_VERSION.commit).toMatch(/^([0-9a-f]{7}|dev)$/);
    expect(APP_VERSION.builtAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
