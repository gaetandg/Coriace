import { describe, expect, it } from 'vitest';
import { appLinkPath } from './appLinks';

describe('appLinkPath', () => {
  it('opens a coriace.app page at the same address in the app', () => {
    expect(appLinkPath('https://coriace.app/marathon/')).toBe('/marathon/');
    expect(appLinkPath('https://coriace.app/exercices/copenhagen-plank/?utm_source=x#haut')).toBe('/exercices/copenhagen-plank/?utm_source=x#haut');
    expect(appLinkPath('https://coriace.app')).toBe('/');
  });

  it('keeps the base the app is built with', () => {
    expect(appLinkPath('https://coriace.app/articles/', '/coriace/')).toBe('/coriace/articles/');
  });

  it('ignores any other address', () => {
    expect(appLinkPath('https://www.coriace.app/marathon/')).toBeNull();
    expect(appLinkPath('http://coriace.app/marathon/')).toBeNull();
    expect(appLinkPath('https://example.com/marathon/')).toBeNull();
    expect(appLinkPath('pas une adresse')).toBeNull();
  });
});
