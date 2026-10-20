import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  AUTHOR, AUTHOR_PAGE, Article, ArticleBlock, HEALTH_NOTICE, Inline, articleDate, authorPageVisible, parseInline, readingMinutes, visibleArticles,
} from '../../articles';
import { EXERCISE_DATABASE } from '../../exercises';
import { inApp } from '../../lib/links';
import { ARTICLES_PAGE, HOME, articleBySlug, pagePath } from '../../pages';
import { BackLink } from '../BackLink';
import { ExerciseAnimation } from '../ExerciseAnimation';

const base = import.meta.env.BASE_URL;
// Drafts show on the development server only, until the author has proofread them.
export const SHOW_DRAFTS = import.meta.env.DEV;

// Links inside the site ("/marathon/") follow the base the site is served from; they reload the
// app on that page.
const siteHref = (href: string) => (href.startsWith('/') ? `${base}${href.slice(1)}` : href);

function Text({ text }: { text: Inline }) {
  return (
    <>
      {parseInline(text).map((part, i) =>
        part.kind === 'bold' ? <strong key={i}>{part.text}</strong>
          : part.kind === 'link' ? <a key={i} href={siteHref(part.href)} className="underline underline-offset-2">{part.text}</a>
          : <Fragment key={i}>{part.text}</Fragment>)}
    </>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="font-display font-extrabold text-[26px] leading-tight mt-2">{block.text}</h2>;
    case 'p':
      return <p className="text-[17px] leading-relaxed"><Text text={block.text} /></p>;
    case 'list': {
      const List = block.ordered ? 'ol' : 'ul';
      return (
        <List className={`flex flex-col gap-1.5 pl-5 text-[17px] leading-relaxed ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
          {block.items.map((item, i) => <li key={i}><Text text={item} /></li>)}
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
    case 'try':
      return (
        <aside className="bg-cream text-ink rounded-[18px] px-4 py-3.5 flex flex-col gap-1.5">
          <h2 className="font-display font-bold text-[21px] leading-tight">À essayer</h2>
          {block.items.map((item, i) => <p key={i} className="text-[15px] leading-snug"><Text text={item} /></p>)}
        </aside>
      );
  }
}

// Every article, most recent first, and the author's page.
export function ArticleList({ onBack, onOpen, onOpenAuthor }: {
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
        {visibleArticles(SHOW_DRAFTS).map(article => (
          <li key={article.slug}>
            <a
              id={`article-${article.slug}`}
              href={pagePath({ kind: 'article', slug: article.slug }, base)}
              onClick={inApp(() => onOpen(article.slug))}
              className="w-full bg-cream text-ink rounded-[18px] px-4 py-3.5 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform"
            >
              <span className="flex-1 flex flex-col gap-1">
                <span className="text-[13px] font-semibold text-clay">
                  {article.draft && 'Brouillon · '}{article.kind} · {articleDate(article.publishedAt)} · {readingMinutes(article)} min
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

export function ArticlePage({ slug, onBack, onOpenAuthor }: { slug: string; onBack: () => void; onOpenAuthor: () => void }) {
  const article = articleBySlug(slug)!;
  return (
    <article id="article-page" className="flex-1 flex flex-col gap-5">
      <BackLink href={pagePath({ kind: 'articles' }, base)} label="Les articles" onBack={onBack} />
      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-sand">{article.draft && 'Brouillon · '}{article.kind}</span>
        <h1 className="font-display font-extrabold text-[36px] leading-[1.05] tracking-[-0.02em]">{article.title}</h1>
        <p className="text-sm text-sand">
          Par{' '}
          <a href={pagePath({ kind: 'author' }, base)} onClick={inApp(onOpenAuthor)} className="underline underline-offset-2 cursor-pointer">{AUTHOR.name}</a>
          {' · '}{articleDate(article.publishedAt)} · {readingMinutes(article)} min de lecture
        </p>
      </header>
      <p className="text-[18px] leading-relaxed font-semibold">{article.lead}</p>
      {article.blocks.map((block, i) => <Block key={i} block={block} />)}
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
