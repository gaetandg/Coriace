import { useEffect, useState } from 'react';
import { Article, visibleArticles } from '../articles';
import { ARTICLE_FEED, mergeArticles, readArticleFeed } from '../lib/articleFeed';
import { isNativeApp } from '../lib/native';
import { SITE_URL } from '../pages';

const STORAGE_KEY = 'coriace.articles';

function storedFeed(): Article[] {
  try {
    return readArticleFeed(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')) ?? [];
  } catch {
    return [];
  }
}

// The articles to show. On the site, those it was built with: it is rebuilt every morning. The
// Android app also reads the site's feed, and keeps it for when it is offline.
export function useArticles(includeDrafts: boolean): Article[] {
  const [articles, setArticles] = useState(() =>
    isNativeApp ? mergeArticles(storedFeed(), visibleArticles(includeDrafts)) : visibleArticles(includeDrafts));

  useEffect(() => {
    if (!isNativeApp) return;
    fetch(`${SITE_URL}/${ARTICLE_FEED}`)
      .then(response => (response.ok ? response.json() : null))
      .then(data => {
        const feed = readArticleFeed(data);
        if (!feed) return;
        setArticles(mergeArticles(feed, visibleArticles(includeDrafts)));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(feed));
        } catch { /* storage full or blocked: read again next time */ }
      })
      .catch(() => {});
  }, [includeDrafts]);

  return articles;
}
