import { describe, expect, it } from 'vitest';
import { EXERCISE_DATABASE } from './exercises';
import { CATEGORY_PAGES, HOME, SitePage, exerciseSlug, pageAt, pagePath, pageText } from './pages';
import { PRESET_CATEGORIES } from './sessions';

const ALL: SitePage[] = [
  HOME,
  ...PRESET_CATEGORIES.map(category => ({ kind: 'category', category }) as SitePage),
  { kind: 'exercises' },
  ...EXERCISE_DATABASE.map(ex => ({ kind: 'exercise', exerciseId: ex.id }) as SitePage),
];

describe('page addresses', () => {
  it('gives every page its own address, title and description', () => {
    for (const read of [(p: SitePage) => pagePath(p), (p: SitePage) => pageText(p).title, (p: SitePage) => pageText(p).description]) {
      const values = ALL.map(read);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it('finds each page back from its address, at the root or under a sub-path', () => {
    for (const base of ['/', '/coriace/']) {
      for (const page of ALL) expect(pageAt(pagePath(page, base), base)).toEqual(page);
    }
  });

  it('names exercise pages after the exercise, without accents', () => {
    const slug = (id: string) => exerciseSlug(EXERCISE_DATABASE.find(ex => ex.id === id)!);
    expect(slug('calves_standing_slow')).toBe('mollets-debout-descente-lente');
    expect(slug('copenhagen_plank')).toBe('copenhagen-plank');
    for (const ex of EXERCISE_DATABASE) expect(exerciseSlug(ex)).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('accepts an address without its trailing slash or with index.html', () => {
    expect(pageAt('/marathon')).toEqual({ kind: 'category', category: 'marathon' });
    expect(pageAt('/marathon/index.html')).toEqual({ kind: 'category', category: 'marathon' });
    expect(pageAt('/exercices')).toEqual({ kind: 'exercises' });
    expect(pageAt('/exercices/copenhagen-plank')).toEqual({ kind: 'exercise', exerciseId: 'copenhagen_plank' });
  });

  it('opens the home page for any other address', () => {
    for (const path of ['/', '/index.html', '/conditions.html', '/marathon/autre/', '/exercices/inconnu/', '/exercices/copenhagen-plank/x/']) {
      expect(pageAt(path)).toEqual(HOME);
    }
    expect(pageAt('/marathon/', '/coriace/')).toEqual(HOME);
  });

  it('keeps titles and descriptions to what a search result shows', () => {
    for (const page of PRESET_CATEGORIES.map(c => CATEGORY_PAGES[c])) expect(page.title.length).toBeLessThanOrEqual(65);
    for (const page of ALL) expect(pageText(page).description.length).toBeLessThanOrEqual(180);
  });
});
