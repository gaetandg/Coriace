import { describe, expect, it } from 'vitest';
import { ARTICLES, AUTHOR, AUTHOR_PAGE, parseInline, visibleArticles } from './articles';
import { EXERCISE_DATABASE } from './exercises';
import { pageAt } from './pages';
import { sitePages, staticPages } from './staticPages';

const template = '<html><head><title>Coriace</title><meta name="description" content="x" /></head><body><div id="root"></div></body></html>';

describe('articles', () => {
  it('reads bold text and links', () => {
    expect(parseInline('Les **séances** et [la fiche](/exercices/).')).toEqual([
      { kind: 'text', text: 'Les ' },
      { kind: 'bold', text: 'séances' },
      { kind: 'text', text: ' et ' },
      { kind: 'link', text: 'la fiche', href: '/exercices/' },
      { kind: 'text', text: '.' },
    ]);
  });

  it('only shows drafts on request', () => {
    const drafts = ARTICLES.filter(a => a.draft);
    expect(visibleArticles(false).some(a => a.draft)).toBe(false);
    expect(visibleArticles(true)).toHaveLength(ARTICLES.length);
    for (const draft of drafts) {
      expect(pageAt(`/articles/${draft.slug}/`)).toEqual({ kind: 'home' });
      expect(pageAt(`/articles/${draft.slug}/`, '/', true)).toEqual({ kind: 'article', slug: draft.slug });
    }
  });

  it('leaves drafts out of the published site and its sitemap', () => {
    const published = staticPages(template);
    const sitemap = published.find(f => f.fileName === 'sitemap.xml')!;
    for (const draft of ARTICLES.filter(a => a.draft)) {
      expect(published.some(f => f.fileName === `articles/${draft.slug}/index.html`)).toBe(false);
      expect('source' in sitemap && sitemap.source.includes(draft.slug)).toBe(false);
    }
  });

  it('writes every article, the list and the author page in a preview', () => {
    const preview = staticPages(template, '/', true);
    expect(sitePages(true).length).toBe(sitePages(false).length + (visibleArticles(false).length === 0 ? ARTICLES.length + 2 : ARTICLES.filter(a => a.draft).length));
    for (const article of ARTICLES) {
      const page = preview.find(f => f.fileName === `articles/${article.slug}/index.html`);
      expect(page && 'source' in page && page.source).toContain('"BlogPosting"');
    }
    expect(preview.some(f => f.fileName === `articles/${AUTHOR.slug}/index.html`)).toBe(true);
  });

  it('uses unique addresses and existing exercises', () => {
    expect(new Set(ARTICLES.map(a => a.slug)).size).toBe(ARTICLES.length);
    expect(ARTICLES.some(a => a.slug === AUTHOR.slug)).toBe(false);
    const ids = ARTICLES.flatMap(a => [...a.blocks.flatMap(b => (b.type === 'exercises' ? b.ids : [])), ...(a.coverExerciseId ? [a.coverExerciseId] : [])]);
    for (const id of ids) expect(EXERCISE_DATABASE.some(ex => ex.id === id), id).toBe(true);
  });

  it('keeps titles short enough for search results', () => {
    for (const article of ARTICLES) expect(article.title.length, article.title).toBeLessThanOrEqual(60);
  });
});

describe('article images', () => {
  it('point to files that exist', async () => {
    const { existsSync } = await import('node:fs');
    for (const article of ARTICLES) {
      for (const block of article.blocks) {
        if (block.type === 'image') expect(existsSync(`public${block.src}`), block.src).toBe(true);
      }
    }
  });
});

describe('published articles', () => {
  // "[À compléter …]" left in a draft; "[texte](lien)" is a link and is fine.
  const gap = /\[[^\]]*\](?!\()/;
  it('have no gap left to fill', () => {
    for (const article of visibleArticles(false)) {
      const texts = [article.title, article.lead, ...article.blocks.flatMap(b => ('text' in b ? [b.text] : 'items' in b ? b.items : [b.caption]))];
      for (const text of texts) expect(gap.test(text), `${article.slug}: ${text}`).toBe(false);
    }
    if (!AUTHOR_PAGE.draft) for (const block of AUTHOR_PAGE.blocks) expect(gap.test('text' in block ? block.text : ''), JSON.stringify(block)).toBe(false);
  });
});
