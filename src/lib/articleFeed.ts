import { Article, ArticleBlock, isPublished } from '../articles';
import { EXERCISE_DATABASE } from '../exercises';

// The published articles as the site serves them (coriace.app/articles.json). The Android app
// reads them from there, so a new article reaches it without an update from the Play Store.
export const ARTICLE_FEED = 'articles.json';

const BLOCK_TYPES: ArticleBlock['type'][] = ['h2', 'p', 'list', 'exercises', 'image', 'try'];

// A block this version of the app can show: a type it knows, exercises it has.
const shown = (block: ArticleBlock) =>
  BLOCK_TYPES.includes(block?.type) &&
  (block.type !== 'exercises' || block.ids.every(id => EXERCISE_DATABASE.some(ex => ex.id === id)));

const isArticle = (value: unknown): value is Article => {
  const a = value as Article;
  return !!a && typeof a.slug === 'string' && typeof a.title === 'string' && typeof a.lead === 'string' &&
    typeof a.publishedAt === 'string' && Array.isArray(a.blocks) && Array.isArray(a.sources);
};

// The feed's articles, with what the app can show of them; null when it isn't a feed.
export function readArticleFeed(data: unknown): Article[] | null {
  if (!Array.isArray(data)) return null;
  return data.filter(isArticle).map(article => ({ ...article, blocks: article.blocks.filter(shown) }));
}

// The articles to list: the feed's, then those the app shipped with that the feed doesn't have,
// published ones only, most recent first.
export const mergeArticles = (feed: Article[], shipped: Article[], day?: string) =>
  [...feed, ...shipped.filter(a => !feed.some(f => f.slug === a.slug))]
    .filter(a => isPublished(a, day))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
