import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  AUTHOR, AUTHOR_PAGE, Article, ArticleBlock, HEALTH_NOTICE, Inline, articleDate, articleStatus, authorPageVisible, parseInline, readingMinutes,
} from '../../articles';
import { EXERCISE_DATABASE } from '../../exercises';
import { inApp } from '../../lib/links';
import { isNativeApp } from '../../lib/native';
import { ARTICLES_PAGE, HOME, SITE_URL, pagePath } from '../../pages';
import { BackLink } from '../BackLink';
import { ExerciseAnimation } from '../ExerciseAnimation';

const base = import.meta.env.BASE_URL;
// Drafts show on the development server only, until the author has proofread them.
export const SHOW_DRAFTS = import.meta.env.DEV;

// Links inside the site ("/marathon/") follow the base the site is served from; they reload the
// app on that page.
const siteHref = (href: string) => (href.startsWith('/') ? `${base}${href.slice(1)}` : href);
// The charts: the Android app takes them from the site, which also has those of articles newer
// than the app.
const imageSrc = (src: string) => (isNativeApp ? `${SITE_URL}${src}` : siteHref(src));
// A link to another article ("/articles/<slug>/") opens it in the app.
const articleLink = /^\/articles\/([^/]+)\/$/;

type OpenArticle = (slug: string) => void;

function Text({ text, onOpenArticle }: { text: Inline; onOpenArticle?: OpenArticle }) {
  return (
    <>
      {parseInline(text).map((part, i) => {
        if (part.kind !== 'link') return part.kind === 'bold' ? <strong key={i}>{part.text}</strong> : <Fragment key={i}>{part.text}</Fragment>;
        const slug = part.href.match(articleLink)?.[1];
        return (
          <a key={i} href={siteHref(part.href)} onClick={slug && onOpenArticle ? inApp(() => onOpenArticle(slug)) : undefined} className="underline underline-offset-2">
            {part.text}
          </a>
        );
      })}
    </>
  );
}

function Block({ block, onOpenArticle }: { block: ArticleBlock; onOpenArticle?: OpenArticle }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="font-display font-extrabold text-[26px] leading-tight mt-2">{block.text}</h2>;
    case 'p':
      return <p className="text-[17px] leading-relaxed"><Text text={block.text} onOpenArticle={onOpenArticle} /></p>;
    case 'list': {
      const List = block.ordered ? 'ol' : 'ul';
      return (
        <List className={`flex flex-col gap-1.5 pl-5 text-[17px] leading-relaxed ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
          {block.items.map((item, i) => <li key={i}><Text text={item} onOpenArticle={onOpenArticle} /></li>)}
        </List>
      );
    }
    case 'exercises':
      return (
        <figure className="flex flex-col gap-2">
          <div className="flex gap-2">
            {block.ids.map(id => {
              const exercise = EXERCISE_DATABASE.find(ex => ex.id === id)!;
              return (
                <a key={id} href={pagePath({ kind: 'exercise', exerciseId: id }, base)} className="flex-1 min-w-0 bg-cream text-ink rounded-2xl p-2 flex flex-col gap-1">
                  <ExerciseAnimation exerciseId={id} className="w-full h-28" />
                  <span className="px-1 pb-1 text-sm font-semibold leading-tight">{exercise.name}</span>
                </a>
              );
            })}
          </div>
          <figcaption className="text-sm text-sand">{block.caption}</figcaption>
        </figure>
      );
    case 'image':
      return (
        <figure className="flex flex-col gap-2">
          <img src={imageSrc(block.src)} alt={block.alt} width={block.width} height={block.height} loading="lazy" className="w-full h-auto rounded-2xl" />
          <figcaption className="text-sm text-sand">{block.caption}</figcaption>
        </figure>
      );
    case 'try':
      return (
        <aside className="bg-cream text-ink rounded-[18px] px-4 py-3.5 flex flex-col gap-1.5">
          <h2 className="font-display font-bold text-[21px] leading-tight">À essayer</h2>
          {block.items.map((item, i) => <p key={i} className="text-[15px] leading-snug"><Text text={item} onOpenArticle={onOpenArticle} /></p>)}
        </aside>
      );
  }
}

// Every article, most recent first, and the author's page.
export function ArticleList({ articles, onBack, onOpen, onOpenAuthor }: {
  articles: Article[];
  onBack: () => void;
  onOpen: (slug: string) => void;
  onOpenAuthor: () => void;
}) {
  return (
    <div id="article-list" className="flex-1 flex flex-col gap-5">
      <BackLink href={pagePath(HOME, base)} label="Accueil" onBack={onBack} />
      <h1 className="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">{ARTICLES_PAGE.heading}</h1>
      <p className="text-base leading-snug">{ARTICLES_PAGE.intro}</p>
      <ul className="flex flex-col gap-2.5">
        {articles.map(article => (
          <li key={article.slug}>
            <a
              id={`article-${article.slug}`}
              href={pagePath({ kind: 'article', slug: article.slug }, base)}
              onClick={inApp(() => onOpen(article.slug))}
              className="w-full bg-cream text-ink rounded-[18px] px-4 py-3.5 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform"
            >
              <span className="flex-1 flex flex-col gap-1">
                <span className="text-[13px] font-semibold text-clay">
                  {articleStatus(article)}{article.kind} · {articleDate(article.publishedAt)} · {readingMinutes(article)} min
                </span>
                <span className="font-display font-bold text-[21px] leading-tight">{article.title}</span>
                <span className="text-[15px] leading-snug text-clay">{article.description}</span>
              </span>
              <ChevronRight className="w-5 h-5 shrink-0 text-clay" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      {authorPageVisible(SHOW_DRAFTS) && (
        <a href={pagePath({ kind: 'author' }, base)} onClick={inApp(onOpenAuthor)} className="self-start text-base font-semibold underline underline-offset-2 cursor-pointer">
          Qui écrit ?
        </a>
      )}
    </div>
  );
}

function ArticleFooter({ article }: { article: Article }) {
  const notes = [
    article.updatedAt ? `Mis à jour le ${articleDate(article.updatedAt)}.` : '',
    article.reviewedByPhysio ? 'Relu par un kinésithérapeute.' : '',
  ].filter(Boolean).join(' ');
  return (
    <>
      {article.sources.length > 0 && (
        <section className="flex flex-col gap-1.5 mt-2">
          <h2 className="text-sm font-semibold text-sand">Sources</h2>
          <ol className="flex flex-col gap-1 pl-5 list-decimal text-sm text-sand leading-snug">
            {article.sources.map(source => <li key={source}>{source}</li>)}
          </ol>
        </section>
      )}
      {notes && <p className="text-sm font-semibold">{notes}</p>}
      {article.healthNotice && <p className="text-sm text-sand italic">{HEALTH_NOTICE}</p>}
    </>
  );
}

export function ArticlePage({ article, onBack, onOpen, onOpenAuthor }: {
  article: Article;
  onBack: () => void;
  onOpen: OpenArticle;
  onOpenAuthor: () => void;
}) {
  return (
    <article id="article-page" className="flex-1 flex flex-col gap-5">
      <BackLink href={pagePath({ kind: 'articles' }, base)} label="Les articles" onBack={onBack} />
      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-sand">{articleStatus(article)}{article.kind}</span>
        <h1 className="font-display font-extrabold text-[36px] leading-[1.05] tracking-[-0.02em]">{article.title}</h1>
        <p className="text-sm text-sand">
          Par{' '}
          <a href={pagePath({ kind: 'author' }, base)} onClick={inApp(onOpenAuthor)} className="underline underline-offset-2 cursor-pointer">{AUTHOR.name}</a>
          {' · '}{articleDate(article.publishedAt)} · {readingMinutes(article)} min de lecture
        </p>
      </header>
      <p className="text-[18px] leading-relaxed font-semibold">{article.lead}</p>
      {article.blocks.map((block, i) => <Block key={i} block={block} onOpenArticle={onOpen} />)}
      <ArticleFooter article={article} />
    </article>
  );
}

export function AuthorPage({ onBack }: { onBack: () => void }) {
  return (
    <div id="author-page" className="flex-1 flex flex-col gap-5">
      <BackLink href={pagePath({ kind: 'articles' }, base)} label="Les articles" onBack={onBack} />
      <h1 className="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">{AUTHOR_PAGE.title}</h1>
      {AUTHOR_PAGE.blocks.map((block, i) => <Block key={i} block={block} />)}
    </div>
  );
}
