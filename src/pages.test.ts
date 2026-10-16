import { describe, expect, it } from 'vitest';
import { CATEGORY_PAGES, pageAt, pagePath, pageTitle } from './pages';
import { PRESET_CATEGORIES } from './sessions';

describe('page addresses', () => {
  it('gives every page its own address and title', () => {
    const slugs = PRESET_CATEGORIES.map(c => CATEGORY_PAGES[c].slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const titles = [null, ...PRESET_CATEGORIES].map(pageTitle);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('finds each page back from its address, at the root or under a sub-path', () => {
    for (const base of ['/', '/coriace/']) {
      for (const category of PRESET_CATEGORIES) expect(pageAt(pagePath(category, base), base)).toBe(category);
      expect(pagePath(null, base)).toBe(base);
      expect(pageAt(base, base)).toBeNull();
    }
  });

  it('accepts an address without its trailing slash or with index.html', () => {
    expect(pageAt('/marathon')).toBe('marathon');
    expect(pageAt('/marathon/index.html')).toBe('marathon');
    expect(pageAt('/seances-ciblees/')).toBe('ciblees');
  });

  it('opens the home page for any other address', () => {
    expect(pageAt('/index.html')).toBeNull();
    expect(pageAt('/conditions.html')).toBeNull();
    expect(pageAt('/marathon/autre/')).toBeNull();
    expect(pageAt('/marathon/', '/coriace/')).toBeNull();
  });

  it('keeps titles and descriptions to what a search result shows', () => {
    for (const page of PRESET_CATEGORIES.map(c => CATEGORY_PAGES[c])) {
      expect(page.title.length).toBeLessThanOrEqual(65);
      expect(page.description.length).toBeLessThanOrEqual(180);
    }
  });
});
