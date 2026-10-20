import { describe, expect, it } from 'vitest';
import { Article, visibleArticles } from '../articles';
import { staticPages } from '../staticPages';
import { ARTICLE_FEED, mergeArticles, readArticleFeed } from './articleFeed';

const article = (slug: string, publishedAt: string, blocks: unknown[] = []) =>
  ({ slug, title: slug, lead: '', publishedAt, draft: false, blocks, sources: [] }) as unknown as Article;

describe('article feed', () => {
  it('is written with the published articles', () => {
    const feed = staticPages('<html><head><title>x</title><meta name="description" content="x" /></head><body><div id="root"></div></body></html>')
      .find(f => f.fileName === ARTICLE_FEED);
    expect(feed && 'source' in feed && readArticleFeed(JSON.parse(feed.source))).toEqual(visibleArticles(false));
  });

  it('keeps what the app can show', () => {
    expect(readArticleFeed({ articles: [] })).toBeNull();
    const read = readArticleFeed([
      article('a', '2026-10-20', [
        { type: 'p', text: 'ok' },
        { type: 'video', src: '/x.mp4' },
        { type: 'exercises', ids: ['unknown_exercise'], caption: '' },
        { type: 'exercises', ids: ['copenhagen_plank'], caption: '' },
      ]),
      { slug: 'broken' },
    ])!;
    expect(read.map(a => a.slug)).toEqual(['a']);
    expect(read[0].blocks.map(b => b.type)).toEqual(['p', 'exercises']);
  });

  it('adds the articles the app shipped with, published ones only, newest first', () => {
    const feed = [article('b', '2026-10-27'), article('a', '2026-10-20')];
    const shipped = [article('a', '2026-10-20'), article('old', '2026-10-01'), article('later', '2026-11-03')];
    expect(mergeArticles(feed, shipped, '2026-10-28').map(a => a.slug)).toEqual(['b', 'a', 'old']);
  });
});
