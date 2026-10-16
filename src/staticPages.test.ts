import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BuiltFile, SITE_PAGES, staticPages } from './staticPages';
import { CATEGORY_PAGES, pagePath } from './pages';
import { EXERCISE_DATABASE } from './exercises';
import { PRESET_CATEGORIES, RACE_SESSIONS, TARGETED_SESSIONS, presetExercises } from './sessions';

const template = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const files = staticPages(template);
const html = (fileName: string) => {
  const file = files.find(f => f.fileName === fileName);
  if (!file || !('source' in file)) throw new Error(`${fileName} missing`);
  return file.source;
};
const root = (page: string) => page.slice(page.indexOf('<div id="root">'), page.lastIndexOf('</body>'));
const jsonLd = (page: string) => JSON.parse(page.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1]);
const types = (page: string) => jsonLd(page)['@graph'].map((node: { '@type': string }) => node['@type']);

describe('static pages', () => {
  it('writes a page and a share image for every page, then the sitemap and robots.txt', () => {
    const names = files.map(f => f.fileName);
    for (const name of ['index.html', 'marathon/index.html', 'seances-ciblees/index.html', 'exercices/index.html',
      'exercices/copenhagen-plank/index.html', 'og/accueil.png', 'og/marathon.png', 'og/exercices/copenhagen-plank.png', 'sitemap.xml', 'robots.txt']) {
      expect(names).toContain(name);
    }
    expect(files.filter(f => 'card' in f)).toHaveLength(SITE_PAGES.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it('gives each page its title, description, address and share image', () => {
    const page = html('marathon/index.html');
    expect(page).toContain(`<title>${CATEGORY_PAGES.marathon.title}</title>`);
    expect(page).toContain('<link rel="canonical" href="https://coriace.app/marathon/" />');
    expect(page).toContain('<meta property="og:image" content="https://coriace.app/og/marathon.png" />');
    expect(page.match(/<title>/g)).toHaveLength(1);
    expect(page.match(/<meta name="description"/g)).toHaveLength(1);
    expect(html('index.html')).toContain('<link rel="canonical" href="https://coriace.app/" />');
  });

  it('puts every session of the page in its text, with links to its exercises', () => {
    const marathon = root(html('marathon/index.html'));
    for (const preset of RACE_SESSIONS.filter(p => p.objective === 'marathon')) {
      expect(marathon).toContain(preset.description);
      for (const exercise of presetExercises(preset)) {
        expect(marathon).toContain(`href="${pagePath({ kind: 'exercise', exerciseId: exercise.id })}"`);
      }
    }
    expect(marathon).not.toContain(RACE_SESSIONS.find(p => p.id === 'ultra-confirme')!.description);
    const targeted = root(html('seances-ciblees/index.html'));
    for (const preset of TARGETED_SESSIONS) expect(targeted).toContain(preset.name);
  });

  it('writes each exercise sheet with its picture and the sessions that use it', () => {
    const page = root(html('exercices/copenhagen-plank/index.html'));
    const exercise = EXERCISE_DATABASE.find(ex => ex.id === 'copenhagen_plank')!;
    for (const text of [exercise.description, exercise.tips, exercise.easier!, exercise.harder!]) expect(page).toContain(text);
    expect(page).toContain('<h1');
    expect(page).toContain('role="img"');
    expect(page).toContain('href="/marathon/"');
    const list = root(html('exercices/index.html'));
    for (const ex of EXERCISE_DATABASE) expect(list).toContain(`href="${pagePath({ kind: 'exercise', exerciseId: ex.id })}"`);
  });

  it('links the home page to every page, and each page to the others', () => {
    const home = root(html('index.html'));
    for (const category of PRESET_CATEGORIES) expect(home).toContain(`href="/${CATEGORY_PAGES[category].slug}/"`);
    expect(home).toContain('href="/exercices/"');
    const semi = root(html('semi-marathon/index.html'));
    expect(semi).toContain('href="/marathon/"');
    expect(semi).not.toContain('href="/semi-marathon/"');
  });

  it('describes the site, the app and each page as structured data', () => {
    expect(types(html('index.html'))).toEqual(['Organization', 'WebSite', 'WebApplication']);
    expect(types(html('marathon/index.html'))).toEqual(['CollectionPage', 'BreadcrumbList']);
    expect(types(html('exercices/copenhagen-plank/index.html'))).toEqual(['WebPage', 'BreadcrumbList']);
    const marathon = jsonLd(html('marathon/index.html'))['@graph'][0];
    expect(marathon.mainEntity.itemListElement).toHaveLength(RACE_SESSIONS.filter(p => p.objective === 'marathon').length);
    const trail = jsonLd(html('exercices/copenhagen-plank/index.html'))['@graph'][1].itemListElement;
    expect(trail.map((step: { name: string }) => step.name)).toEqual(['Accueil', 'Exercices', 'Copenhagen plank']);
  });

  it('escapes the text', () => {
    const all = files.filter((f): f is Extract<BuiltFile, { source: string }> => 'source' in f).map(f => f.source).join('');
    expect(all).not.toMatch(/content="[^"]*[<>][^"]*"/);
    expect(all).not.toMatch(/<script type="application\/ld\+json">[^<]*<(?!\/script>)/);
  });

  it('lists every page in the sitemap, which robots.txt points to', () => {
    const sitemap = html('sitemap.xml');
    expect(sitemap.match(/<loc>/g)).toHaveLength(SITE_PAGES.length);
    expect(sitemap).toContain('<loc>https://coriace.app/trail-ultra/</loc>');
    expect(sitemap).toContain('<loc>https://coriace.app/exercices/copenhagen-plank/</loc>');
    expect(html('robots.txt')).toContain('Sitemap: https://coriace.app/sitemap.xml');
  });

  it('serves the pages under a sub-path', () => {
    const page = staticPages(template, '/coriace/').find(f => f.fileName === 'marathon/index.html');
    const source = page && 'source' in page ? page.source : '';
    expect(source).toContain('href="https://coriace.app/coriace/marathon/"');
    expect(source).toContain('href="/coriace/semi-marathon/"');
  });

  it('fails rather than publish a page without its text', () => {
    expect(() => staticPages(template.replace('<div id="root"></div>', '<div id="app"></div>'))).toThrow();
  });
});
