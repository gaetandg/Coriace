import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { staticPages } from './staticPages';
import { CATEGORY_PAGES } from './pages';
import { PRESET_CATEGORIES, RACE_SESSIONS, TARGETED_SESSIONS, presetExercises } from './sessions';

const template = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const files = staticPages(template);
const file = (fileName: string) => files.find(f => f.fileName === fileName)!.source;
const root = (html: string) => html.slice(html.indexOf('<div id="root">'), html.lastIndexOf('</body>'));

describe('static pages', () => {
  it('writes the home page, one page per distance and the targeted sessions', () => {
    expect(files.map(f => f.fileName)).toEqual([
      'index.html', '10-km/index.html', 'semi-marathon/index.html', 'marathon/index.html', 'trail-ultra/index.html',
      'seances-ciblees/index.html', 'sitemap.xml', 'robots.txt',
    ]);
  });

  it('gives each page its title, description and address', () => {
    const html = file('marathon/index.html');
    expect(html).toContain(`<title>${CATEGORY_PAGES.marathon.title}</title>`);
    expect(html).toContain('<link rel="canonical" href="https://coriace.app/marathon/" />');
    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html.match(/<meta name="description"/g)).toHaveLength(1);
    expect(file('index.html')).toContain('<link rel="canonical" href="https://coriace.app/" />');
  });

  it('puts every session of the page in its text, with its exercises', () => {
    const marathon = root(file('marathon/index.html'));
    for (const preset of RACE_SESSIONS.filter(p => p.objective === 'marathon')) {
      expect(marathon).toContain(preset.description);
      for (const exercise of presetExercises(preset)) expect(marathon).toContain(exercise.name);
    }
    expect(marathon).not.toContain(RACE_SESSIONS.find(p => p.id === 'ultra-confirme')!.description);
    const targeted = root(file('seances-ciblees/index.html'));
    for (const preset of TARGETED_SESSIONS) expect(targeted).toContain(preset.name);
  });

  it('links the home page to every page, and each page to the others', () => {
    const home = root(file('index.html'));
    for (const category of PRESET_CATEGORIES) expect(home).toContain(`href="/${CATEGORY_PAGES[category].slug}/"`);
    const semi = root(file('semi-marathon/index.html'));
    expect(semi).toContain('href="/marathon/"');
    expect(semi).not.toContain('href="/semi-marathon/"');
  });

  it('escapes the text', () => {
    const html = staticPages(template).map(f => f.source).join('');
    expect(html).not.toMatch(/content="[^"]*[<>][^"]*"/);
  });

  it('lists every page in the sitemap, which robots.txt points to', () => {
    const sitemap = file('sitemap.xml');
    expect(sitemap.match(/<loc>/g)).toHaveLength(PRESET_CATEGORIES.length + 1);
    expect(sitemap).toContain('<loc>https://coriace.app/trail-ultra/</loc>');
    expect(file('robots.txt')).toContain('Sitemap: https://coriace.app/sitemap.xml');
  });

  it('serves the pages under a sub-path', () => {
    const html = staticPages(template, '/coriace/').find(f => f.fileName === 'marathon/index.html')!.source;
    expect(html).toContain('href="https://coriace.app/coriace/marathon/"');
    expect(html).toContain('href="/coriace/semi-marathon/"');
  });

  it('fails rather than publish a page without its text', () => {
    expect(() => staticPages(template.replace('<div id="root"></div>', '<div id="app"></div>'))).toThrow();
  });
});
