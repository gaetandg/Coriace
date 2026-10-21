import { EXERCISE_DATABASE } from './exercises';
import { EQUIPMENT_LABELS, EXERCISE_GROUPS } from './lib/groups';
import { SCENES, sceneFrame, sceneThumb, sceneTop } from './illustrations/scenes';
import {
  ARTICLES_PAGE, CATEGORY_PAGES, EXERCISES_PAGE, HOME, HOME_PAGE, PLAY_STORE_URL, PageText, SITE_URL, SitePage, articleBySlug, exerciseSlug, pagePath, pageText,
} from './pages';
import {
  AUTHOR, AUTHOR_PAGE, Article, ArticleBlock, HEALTH_NOTICE, Inline, articleDate, authorPageVisible, parseInline, readingMinutes, visibleArticles,
} from './articles';
import { ARTICLE_FEED } from './lib/articleFeed';
import {
  LEVELS, OBJECTIVES, PRESET_CATEGORIES, PRESET_EQUIPMENT_LABELS, PresetCategory, PresetSession, RACE_SESSIONS,
  TARGETED_HINT, TARGETED_INTRO, TARGETED_SESSIONS, categoriesWithExercise, categoryLabel, presetEquipment, presetExercises,
} from './sessions';
import { Exercise } from './types';

// Written by the build (see vite.config.ts): the HTML of every page, its share image, the sitemap
// and robots.txt. Each page has its own title, description, address, structured data and text
// inside the app's root element, so search engines, AI assistants and link previews read it without
// running the app. The app replaces that text as soon as it starts; the classes match its screens
// so the switch is quiet.

// What a share image shows (drawn by ogImage.ts).
export interface ShareCard {
  title: string;
  subtitle: string;
  exerciseId?: string;
}

export type BuiltFile = { fileName: string; source: string } | { fileName: string; card: ShareCard };

const esc = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const exerciseOf = (id: string) => EXERCISE_DATABASE.find(ex => ex.id === id)!;

// Where each page's share image is published.
function cardPath(page: SitePage): string {
  switch (page.kind) {
    case 'home': return 'og/accueil.png';
    case 'category': return `og/${CATEGORY_PAGES[page.category].slug}.png`;
    case 'exercises': return 'og/exercices.png';
    case 'exercise': return `og/exercices/${exerciseSlug(exerciseOf(page.exerciseId))}.png`;
    case 'articles': return 'og/articles.png';
    case 'article': return `og/articles/${page.slug}.png`;
    case 'author': return `og/articles/${AUTHOR.slug}.png`;
  }
}

function card(page: SitePage): ShareCard {
  switch (page.kind) {
    case 'home':
      return { title: 'Séances de renfo guidées pour les coureurs', subtitle: '10 km, semi, marathon, trail · Gratuit' };
    case 'category': {
      const count = page.category === 'ciblees' ? TARGETED_SESSIONS.length : RACE_SESSIONS.filter(p => p.objective === page.category).length;
      const minutes = page.category === 'ciblees' ? 'Une zone précise, 10 à 20 min' : '20, 30 ou 45 min';
      return { title: CATEGORY_PAGES[page.category].heading, subtitle: `${count} séances guidées · ${minutes}` };
    }
    case 'exercises':
      return { title: EXERCISES_PAGE.heading, subtitle: `${EXERCISE_DATABASE.length} fiches expliquées et animées` };
    case 'exercise': {
      const exercise = exerciseOf(page.exerciseId);
      return { title: exercise.name, subtitle: exercise.target, exerciseId: exercise.id };
    }
    case 'articles':
      return { title: ARTICLES_PAGE.heading, subtitle: `Le renfo raconté par ${AUTHOR.name}` };
    case 'article': {
      const article = articleBySlug(page.slug)!;
      return { title: article.title, subtitle: `${article.kind} · ${AUTHOR.name}`, exerciseId: article.coverExerciseId };
    }
    case 'author':
      return { title: AUTHOR_PAGE.title, subtitle: AUTHOR.name };
  }
}

// --- Structured data (schema.org) ---

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const AUTHOR_ID = `${SITE_URL}/#author`;

function breadcrumb(url: string, trail: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: trail.map((step, i) => ({ '@type': 'ListItem', position: i + 1, name: step.name, item: step.url })),
  };
}

function structuredData(page: SitePage, base: string, includeDrafts: boolean): object[] {
  const url = (p: SitePage) => `${SITE_URL}${pagePath(p, base)}`;
  const text = pageText(page);
  const home = { name: 'Accueil', url: url(HOME) };
  const webPage = (type: string, name: string, trail: { name: string; url: string }[], extra: object = {}) => [
    {
      '@type': type, '@id': `${url(page)}#page`, url: url(page), name, description: text.description, inLanguage: 'fr-FR',
      isPartOf: { '@id': WEBSITE_ID }, breadcrumb: { '@id': `${url(page)}#breadcrumb` },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}${base}${cardPath(page)}`, width: 1200, height: 630 },
      ...extra,
    },
    breadcrumb(url(page), trail),
  ];

  switch (page.kind) {
    case 'home':
      return [
        {
          '@type': 'Organization', '@id': ORGANIZATION_ID, name: 'Coriace', url: url(HOME), email: 'contact@coriace.app',
          logo: { '@type': 'ImageObject', url: `${SITE_URL}${base}pwa-512x512.png`, width: 512, height: 512 },
        },
        {
          '@type': 'WebSite', '@id': WEBSITE_ID, url: url(HOME), name: 'Coriace', description: HOME_PAGE.description,
          inLanguage: 'fr-FR', publisher: { '@id': ORGANIZATION_ID },
        },
        {
          '@type': 'WebApplication', name: 'Coriace', url: url(HOME), description: HOME_PAGE.description,
          applicationCategory: 'HealthApplication', operatingSystem: 'Web', inLanguage: 'fr-FR', isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, publisher: { '@id': ORGANIZATION_ID },
        },
      ];
    case 'category': {
      const sessions = page.category === 'ciblees' ? TARGETED_SESSIONS : RACE_SESSIONS.filter(p => p.objective === page.category);
      return webPage('CollectionPage', CATEGORY_PAGES[page.category].heading, [home, { name: categoryLabel(page.category), url: url(page) }], {
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: sessions.length,
          itemListElement: sessions.map((preset, i) => ({
            '@type': 'ListItem', position: i + 1,
            item: {
              '@type': 'ExercisePlan', name: preset.name, description: preset.description,
              activityDuration: `PT${preset.durationMinutes}M`, exerciseType: 'Renforcement musculaire',
            },
          })),
        },
      });
    }
    case 'exercises':
      return webPage('CollectionPage', EXERCISES_PAGE.heading, [home, { name: 'Exercices', url: url(page) }], {
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: EXERCISE_DATABASE.length,
          itemListElement: EXERCISE_DATABASE.map((ex, i) => ({
            '@type': 'ListItem', position: i + 1, name: ex.name, url: url({ kind: 'exercise', exerciseId: ex.id }),
          })),
        },
      });
    case 'exercise': {
      const exercise = exerciseOf(page.exerciseId);
      return webPage('WebPage', exercise.name, [home, { name: 'Exercices', url: url({ kind: 'exercises' }) }, { name: exercise.name, url: url(page) }]);
    }
    case 'articles': {
      const articles = visibleArticles(includeDrafts);
      return webPage('CollectionPage', ARTICLES_PAGE.heading, [home, { name: 'Articles', url: url(page) }], {
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: articles.length,
          itemListElement: articles.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.title, url: url({ kind: 'article', slug: a.slug }) })),
        },
      });
    }
    case 'article': {
      const article = articleBySlug(page.slug)!;
      const articles = { name: 'Articles', url: url({ kind: 'articles' }) };
      return [
        {
          '@type': 'BlogPosting', '@id': `${url(page)}#article`, mainEntityOfPage: url(page), url: url(page),
          headline: article.title, description: article.description, inLanguage: 'fr-FR',
          datePublished: article.publishedAt, dateModified: article.updatedAt ?? article.publishedAt,
          author: { '@type': 'Person', '@id': AUTHOR_ID, name: AUTHOR.name, url: url({ kind: 'author' }) },
          publisher: { '@id': ORGANIZATION_ID },
          image: { '@type': 'ImageObject', url: `${SITE_URL}${base}${cardPath(page)}`, width: 1200, height: 630 },
          isPartOf: { '@id': WEBSITE_ID },
        },
        breadcrumb(url(page), [home, articles, { name: article.title, url: url(page) }]),
      ];
    }
    case 'author':
      return webPage('ProfilePage', AUTHOR_PAGE.title, [home, { name: 'Articles', url: url({ kind: 'articles' }) }, { name: AUTHOR_PAGE.title, url: url(page) }], {
        mainEntity: { '@type': 'Person', '@id': AUTHOR_ID, name: AUTHOR.name, description: AUTHOR_PAGE.description, url: url(page) },
      });
  }
}

// --- Page shell ---

// Fails the build rather than publish a page without its text if index.html changes shape.
function replaceOnce(html: string, pattern: RegExp | string, replacement: string) {
  const found = typeof pattern === 'string' ? html.includes(pattern) : pattern.test(html);
  if (!found) throw new Error(`index.html: ${pattern} not found`);
  return html.replace(pattern, () => replacement);
}

function withPage(template: string, text: PageText, url: string, image: string, data: object[], body: string) {
  // "<" can't close the script early once escaped; JSON stays valid.
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': data }).replace(/</g, '\\u003c');
  const tags = [
    `<meta name="description" content="${esc(text.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Coriace" />',
    '<meta property="og:locale" content="fr_FR" />',
    `<meta property="og:title" content="${esc(text.title)}" />`,
    `<meta property="og:description" content="${esc(text.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<script type="application/ld+json">${json}</script>`,
  ].join('\n    ');
  let html = replaceOnce(template, /<title>[^<]*<\/title>/, `<title>${esc(text.title)}</title>`);
  html = replaceOnce(html, /<meta name="description"[^>]*>/, tags);
  return replaceOnce(html, '<div id="root"></div>', `<div id="root">${body}</div>`);
}

const logo = '<svg width="42" height="42" viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4"><path d="M26.5 7.5A13 13 0 1 0 26.5 24.5"/><path d="M22.6 10.4A8.2 8.2 0 1 0 22.6 21.6"/><path d="M18.8 13.3A3.4 3.4 0 1 0 18.8 18.7"/></g></svg>';
const arrowLeft = '<svg class="w-[22px] h-[22px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';

const about = 'Coriace guide chaque séance : chrono lisible de loin, bips et voix qui annoncent les exercices, échauffement et retour au calme. Gratuit, sans inscription, fonctionne hors ligne.';

function layout(base: string, main: string, footer = '') {
  return `<div class="min-h-dvh overflow-x-clip text-white bg-brick">
<div class="relative w-full max-w-md min-h-dvh mx-auto px-5 pt-5 pb-6 flex flex-col gap-[22px]">
<header><a href="${base}" class="flex items-center gap-2">${logo}<span class="flex flex-col"><span class="font-display font-extrabold text-[23px] leading-tight tracking-tight">Coriace</span><span class="text-[13px] leading-tight text-sand">Le renfo pour les coureurs</span></span></a></header>
<main class="flex-1 flex flex-col gap-5">
${main}
</main>
<footer class="flex flex-col gap-4 mt-4">
${footer}
<p class="text-sm text-sand">${esc(about)}</p>
<p class="text-sm text-sand"><a href="${PLAY_STORE_URL}" class="underline">L'app Android sur Google Play</a></p>
<p class="text-sm text-sand"><a href="${base}conditions.html" class="underline">Conditions d'utilisation</a> · <a href="${base}confidentialite.html" class="underline">Confidentialité</a></p>
</footer>
</div>
</div>`;
}

const backLink = (href: string, label: string) =>
  `<a href="${href}" class="-ml-2.5 self-start h-11 pr-3 flex items-center gap-2 text-sand font-semibold text-[15px]">${arrowLeft}${esc(label)}</a>`;

const chip = 'px-2.5 py-0.5 rounded-full bg-ink/10 text-[13px] font-semibold';
const pill = 'h-11 px-4 rounded-full border-[1.5px] border-white/55 font-semibold text-[15px] flex items-center';

// Links to every page but this one, at the foot of the pages.
function otherPages(page: SitePage, base: string, includeDrafts: boolean) {
  const pages: { page: SitePage; label: string }[] = [
    { page: HOME, label: 'Accueil' },
    ...PRESET_CATEGORIES.map(category => ({ page: { kind: 'category', category } as SitePage, label: categoryLabel(category) })),
    { page: { kind: 'exercises' }, label: 'Les exercices' },
    ...(visibleArticles(includeDrafts).length > 0 ? [{ page: { kind: 'articles' } as SitePage, label: 'Les articles' }] : []),
  ];
  const links = pages
    .filter(p => pagePath(p.page, base) !== pagePath(page, base))
    .map(p => `<li><a href="${pagePath(p.page, base)}" class="${pill}">${esc(p.label)}</a></li>`);
  return `<nav class="flex flex-col gap-2.5" aria-label="Autres pages">
<h2 class="font-display font-extrabold text-[26px] leading-tight">Les autres pages</h2>
<ul class="flex flex-wrap gap-2">${links.join('')}</ul>
</nav>`;
}

// --- Pages of ready-made sessions ---

function sessionCard(preset: PresetSession, base: string) {
  const equipment = presetEquipment(preset).map(eq => PRESET_EQUIPMENT_LABELS[eq]);
  const exercises = presetExercises(preset)
    .map(ex => `<a href="${pagePath({ kind: 'exercise', exerciseId: ex.id }, base)}" class="underline underline-offset-2">${esc(ex.name)}</a>`)
    .join(' · ');
  return `<li class="bg-cream text-ink rounded-[18px] px-4 py-3.5 flex flex-col gap-1">
<h3 class="flex items-baseline justify-between gap-3"><span class="font-display font-bold text-[21px] leading-tight">${esc(preset.formula ?? preset.name)}</span><span class="font-display font-extrabold text-[17px] shrink-0">${preset.durationMinutes} min</span></h3>
<p class="text-[15px] leading-snug text-clay">${esc(preset.description)}</p>
<p class="text-sm leading-snug text-clay">Exercices : ${exercises}</p>
<p class="flex flex-wrap gap-1.5 pt-1">${(equipment.length > 0 ? equipment : ['Sans matériel']).map(label => `<span class="${chip}">${esc(label)}</span>`).join('')}</p>
</li>`;
}

const sessionList = (sessions: PresetSession[], base: string) =>
  `<ul class="flex flex-col gap-2.5">\n${sessions.map(p => sessionCard(p, base)).join('\n')}\n</ul>`;

function categoryMain(category: PresetCategory, base: string) {
  const intro = category === 'ciblees' ? TARGETED_INTRO : OBJECTIVES.find(o => o.id === category)!.intro;
  const parts = [
    `<h1 class="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">${esc(CATEGORY_PAGES[category].heading)}</h1>`,
    `<p class="text-base leading-snug">${esc(intro)}</p>`,
  ];
  if (category === 'ciblees') {
    parts.push(sessionList(TARGETED_SESSIONS, base));
  } else {
    const sessions = RACE_SESSIONS.filter(p => p.objective === category);
    parts.push(`<p class="text-base font-semibold">${sessions.length} séances, en trois durées : 20, 30 et 45 minutes.</p>`);
    for (const level of LEVELS) {
      parts.push(`<section class="flex flex-col gap-2.5 mt-2">
<div class="flex flex-col gap-0.5"><h2 class="font-display font-extrabold text-[26px] leading-tight">${esc(level.heading)}</h2><p class="text-sm text-sand">${esc(level.hint)}</p></div>
${sessionList(sessions.filter(p => p.level === level.id), base)}
</section>`);
    }
  }
  return parts.join('\n');
}

const cardRow = (href: string, label: string, hint: string, count: string) =>
  `<li><a href="${href}" class="w-full bg-cream text-ink rounded-[18px] px-4 py-3.5 flex items-center gap-3"><span class="flex-1 flex flex-col gap-0.5"><span class="font-display font-bold text-[22px] leading-tight">${esc(label)}</span><span class="text-[15px] leading-snug text-clay">${esc(hint)}</span></span><span class="text-sm font-semibold text-clay shrink-0">${esc(count)}</span></a></li>`;

function homeMain(base: string, includeDrafts: boolean) {
  const articles = visibleArticles(includeDrafts);
  const rows = [
    ...PRESET_CATEGORIES.map(category => {
      const objective = OBJECTIVES.find(o => o.id === category);
      const count = objective ? RACE_SESSIONS.filter(p => p.objective === category).length : TARGETED_SESSIONS.length;
      return cardRow(pagePath({ kind: 'category', category }, base), categoryLabel(category), objective?.hint ?? TARGETED_HINT, `${count} séances`);
    }),
    cardRow(pagePath({ kind: 'exercises' }, base), 'Les exercices', 'Chaque mouvement expliqué et animé.', `${EXERCISE_DATABASE.length} fiches`),
    ...(articles.length > 0
      ? [cardRow(pagePath({ kind: 'articles' }, base), 'Les articles', 'Le renfo raconté par un coureur, chiffres à l\'appui.', `${articles.length} article${articles.length > 1 ? 's' : ''}`)]
      : []),
  ];
  return `<h1 class="font-display font-extrabold text-[44px] leading-none tracking-[-0.03em]">Le renfo pour les coureurs</h1>
<p class="text-base leading-snug">Des séances de renforcement musculaire guidées, pensées pour la course à pied : mollets, adducteurs, fessiers, gainage. Prêtes pour ton objectif, ou composées selon ton matériel et ton temps.</p>
<section class="flex flex-col gap-2.5">
<h2 class="font-display font-extrabold text-[26px] leading-tight">Tu prépares quoi ?</h2>
<ul class="flex flex-col gap-2.5">${rows.join('')}</ul>
</section>`;
}

// --- Exercise pages ---

// Still frame of the exercise's animation, as the app shows it before it moves.
function exerciseFigure(exercise: Exercise) {
  const scene = SCENES[exercise.id];
  if (!scene) return '';
  const top = sceneTop(scene);
  return `<div class="-mx-2 flex justify-center"><svg viewBox="0 ${top} 200 ${160 - top}" role="img" aria-label="${esc(`Position de l'exercice : ${exercise.name}`)}" class="block w-full max-w-[320px]">${sceneFrame(scene, scene.motion.still ?? 0, {})}</svg></div>`;
}

function exerciseThumb(exercise: Exercise) {
  const scene = SCENES[exercise.id];
  if (!scene) return '<span class="bg-cream rounded-xl shrink-0 w-[60px] h-12" aria-hidden="true"></span>';
  const { viewBox, svg } = sceneThumb(scene);
  return `<svg viewBox="${viewBox}" aria-hidden="true" class="bg-cream rounded-xl shrink-0 w-[60px] h-12">${svg}</svg>`;
}

const exerciseRow = (exercise: Exercise, base: string) =>
  `<li class="border-b border-white/20"><a href="${pagePath({ kind: 'exercise', exerciseId: exercise.id }, base)}" class="py-3 flex items-center gap-3.5">${exerciseThumb(exercise)}<span class="flex-1 flex flex-col"><span class="font-semibold text-base">${esc(exercise.name)}</span><span class="text-sm text-sand">${esc(exercise.target)}</span></span></a></li>`;

function exercisesMain(base: string) {
  const groups = EXERCISE_GROUPS.map(group => {
    const exercises = EXERCISE_DATABASE.filter(ex => ex.group === group.id);
    if (exercises.length === 0) return '';
    return `<section class="flex flex-col">
<h2 class="font-display font-bold text-lg pb-1 border-b border-white/30">${esc(group.label)}</h2>
<ul class="flex flex-col">${exercises.map(ex => exerciseRow(ex, base)).join('')}</ul>
</section>`;
  });
  return [
    backLink(base, 'Accueil'),
    `<h1 class="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">${esc(EXERCISES_PAGE.heading)}</h1>`,
    `<p class="text-base leading-snug">${esc(EXERCISES_PAGE.intro)}</p>`,
    ...groups,
  ].join('\n');
}

function exerciseMain(exercise: Exercise, base: string) {
  const equipment = exercise.equipmentRequired.length > 0 ? exercise.equipmentRequired.map(eq => EQUIPMENT_LABELS[eq]) : ['Sans matériel'];
  const block = (title: string, text: string) =>
    `<div class="flex flex-col gap-1"><h2 class="text-sm font-semibold text-clay">${esc(title)}</h2><p class="text-base leading-relaxed">${esc(text)}</p></div>`;
  const levels = [{ title: 'Plus facile', text: exercise.easier }, { title: 'Plus dur', text: exercise.harder }].filter(l => l.text);
  const sheet = [
    `<div class="flex flex-col gap-1.5 pr-10"><span class="text-sm font-semibold text-clay">${esc(exercise.target)}</span><h1 class="font-display font-extrabold text-[30px] leading-tight tracking-tight">${esc(exercise.name)}</h1><div class="flex flex-wrap gap-1.5 pt-1">${equipment.map(label => `<span class="px-3 py-1 rounded-full bg-ink/10 text-[13px] font-semibold">${esc(label)}</span>`).join('')}</div></div>`,
    exerciseFigure(exercise),
    block('Mouvement', exercise.description),
    exercise.tips ? block('Conseil', exercise.tips) : '',
    levels.length > 0
      ? `<div class="grid grid-cols-2 gap-2">${levels.map(l => `<div class="rounded-2xl bg-ink/[0.06] px-3.5 py-3 flex flex-col gap-0.5"><h2 class="text-sm font-semibold text-clay">${l.title}</h2><p class="text-[15px] leading-snug">${esc(l.text!)}</p></div>`).join('')}</div>`
      : '',
    exercise.caution ? `<p class="text-[15px] leading-snug"><strong>Attention :</strong> ${esc(exercise.caution)}</p>` : '',
    exercise.instructionHighlight
      ? `<div class="rounded-2xl bg-brick text-white px-4 py-3.5 flex flex-col gap-0.5"><h2 class="text-sm font-semibold text-sand">À retenir</h2><p class="text-base font-semibold">${esc(exercise.instructionHighlight)}</p></div>`
      : '',
  ].filter(Boolean).join('\n');

  const used = categoriesWithExercise(exercise.id);
  const sameGroup = EXERCISE_DATABASE.filter(ex => ex.group === exercise.group && ex.id !== exercise.id);
  const group = EXERCISE_GROUPS.find(g => g.id === exercise.group)!;
  return [
    backLink(pagePath({ kind: 'exercises' }, base), 'Tous les exercices'),
    `<article class="bg-cream text-ink rounded-3xl px-6 pt-6 pb-7 flex flex-col gap-5">\n${sheet}\n</article>`,
    used.length > 0
      ? `<section class="flex flex-col gap-2.5"><h2 class="font-display font-extrabold text-[26px] leading-tight">Dans les séances</h2><ul class="flex flex-col gap-2.5">${used.map(({ category, count }) =>
        `<li><a href="${pagePath({ kind: 'category', category }, base)}" class="w-full bg-cream text-ink rounded-[18px] px-4 py-3.5 flex items-center gap-3"><span class="flex-1 font-display font-bold text-[22px] leading-tight">${esc(categoryLabel(category))}</span><span class="text-sm font-semibold text-clay shrink-0">${count} séance${count > 1 ? 's' : ''}</span></a></li>`).join('')}</ul></section>`
      : '',
    sameGroup.length > 0
      ? `<section class="flex flex-col"><h2 class="font-display font-extrabold text-[26px] leading-tight pb-1 border-b border-white/30">${esc(group.label)}</h2><ul class="flex flex-col">${sameGroup.map(ex => exerciseRow(ex, base)).join('')}</ul></section>`
      : '',
  ].filter(Boolean).join('\n');
}

// --- Articles ---

// Links inside the site ("/marathon/") follow the base the site is served from.
const siteHref = (href: string, base: string) => (href.startsWith('/') ? `${base}${href.slice(1)}` : href);

const inline = (text: Inline, base: string) => parseInline(text).map(part =>
  part.kind === 'bold' ? `<strong>${esc(part.text)}</strong>`
    : part.kind === 'link' ? `<a href="${esc(siteHref(part.href, base))}" class="underline underline-offset-2">${esc(part.text)}</a>`
    : esc(part.text)).join('');

function articleBlock(block: ArticleBlock, base: string) {
  switch (block.type) {
    case 'h2': return `<h2 class="font-display font-extrabold text-[26px] leading-tight mt-2">${esc(block.text)}</h2>`;
    case 'p': return `<p class="text-[17px] leading-relaxed">${inline(block.text, base)}</p>`;
    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul';
      return `<${tag} class="flex flex-col gap-1.5 pl-5 text-[17px] leading-relaxed ${block.ordered ? 'list-decimal' : 'list-disc'}">${block.items.map(item => `<li>${inline(item, base)}</li>`).join('')}</${tag}>`;
    }
    case 'exercises': {
      const figures = block.ids.map(id => {
        const exercise = exerciseOf(id);
        const scene = SCENES[id];
        const svg = scene
          ? `<svg viewBox="0 ${sceneTop(scene)} 200 ${160 - sceneTop(scene)}" role="img" aria-label="${esc(exercise.name)}" class="block w-full h-28">${sceneFrame(scene, scene.motion.still ?? 0, {})}</svg>`
          : '';
        return `<a href="${pagePath({ kind: 'exercise', exerciseId: id }, base)}" class="flex-1 min-w-0 bg-cream text-ink rounded-2xl p-2 flex flex-col gap-1">${svg}<span class="px-1 pb-1 text-sm font-semibold leading-tight">${esc(exercise.name)}</span></a>`;
      });
      return `<figure class="flex flex-col gap-2"><div class="flex gap-2">${figures.join('')}</div><figcaption class="text-sm text-sand">${esc(block.caption)}</figcaption></figure>`;
    }
    case 'image':
      return `<figure class="flex flex-col gap-2"><img src="${esc(siteHref(block.src, base))}" alt="${esc(block.alt)}" width="${block.width}" height="${block.height}" loading="lazy" class="w-full h-auto rounded-2xl" /><figcaption class="text-sm text-sand">${esc(block.caption)}</figcaption></figure>`;
    case 'try':
      return `<aside class="bg-cream text-ink rounded-[18px] px-4 py-3.5 flex flex-col gap-1.5"><h2 class="font-display font-bold text-[21px] leading-tight">À essayer</h2>${block.items.map(item => `<p class="text-[15px] leading-snug">${inline(item, base)}</p>`).join('')}</aside>`;
  }
}

const articleMeta = (article: Article, base: string) =>
  `<p class="text-sm text-sand">Par <a href="${pagePath({ kind: 'author' }, base)}" class="underline underline-offset-2">${esc(AUTHOR.name)}</a> · ${esc(articleDate(article.publishedAt))} · ${readingMinutes(article)} min de lecture</p>`;

function articleMain(article: Article, base: string) {
  const footer = [
    article.updatedAt ? `Mis à jour le ${articleDate(article.updatedAt)}.` : '',
    article.reviewedByPhysio ? 'Relu par un kinésithérapeute.' : '',
  ].filter(Boolean).join(' ');
  return [
    backLink(pagePath({ kind: 'articles' }, base), 'Les articles'),
    `<header class="flex flex-col gap-2"><span class="text-sm font-semibold text-sand">${esc(article.kind)}</span><h1 class="font-display font-extrabold text-[36px] leading-[1.05] tracking-[-0.02em]">${esc(article.title)}</h1>${articleMeta(article, base)}</header>`,
    `<p class="text-[18px] leading-relaxed font-semibold">${esc(article.lead)}</p>`,
    ...article.blocks.map(block => articleBlock(block, base)),
    article.sources.length > 0
      ? `<section class="flex flex-col gap-1.5 mt-2"><h2 class="text-sm font-semibold text-sand">Sources</h2><ol class="flex flex-col gap-1 pl-5 list-decimal text-sm text-sand leading-snug">${article.sources.map(s => `<li>${esc(s)}</li>`).join('')}</ol></section>`
      : '',
    footer ? `<p class="text-sm font-semibold">${esc(footer)}</p>` : '',
    article.healthNotice ? `<p class="text-sm text-sand italic">${esc(HEALTH_NOTICE)}</p>` : '',
  ].filter(Boolean).join('\n');
}

function articlesMain(base: string, includeDrafts: boolean) {
  const cards = visibleArticles(includeDrafts).map(article =>
    `<li><a href="${pagePath({ kind: 'article', slug: article.slug }, base)}" class="w-full bg-cream text-ink rounded-[18px] px-4 py-3.5 flex flex-col gap-1"><span class="text-[13px] font-semibold text-clay">${esc(article.kind)} · ${esc(articleDate(article.publishedAt))} · ${readingMinutes(article)} min</span><span class="font-display font-bold text-[21px] leading-tight">${esc(article.title)}</span><span class="text-[15px] leading-snug text-clay">${esc(article.description)}</span></a></li>`);
  return [
    backLink(base, 'Accueil'),
    `<h1 class="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">${esc(ARTICLES_PAGE.heading)}</h1>`,
    `<p class="text-base leading-snug">${esc(ARTICLES_PAGE.intro)}</p>`,
    `<ul class="flex flex-col gap-2.5">${cards.join('')}</ul>`,
    authorPageVisible(includeDrafts) ? `<p class="text-base"><a href="${pagePath({ kind: 'author' }, base)}" class="underline underline-offset-2 font-semibold">Qui écrit ?</a></p>` : '',
  ].filter(Boolean).join('\n');
}

const authorMain = (base: string) => [
  backLink(pagePath({ kind: 'articles' }, base), 'Les articles'),
  `<h1 class="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">${esc(AUTHOR_PAGE.title)}</h1>`,
  ...AUTHOR_PAGE.blocks.map(block => articleBlock(block, base)),
].join('\n');

// --- All files ---

// Article pages only once there is an article to show (drafts are left out of the published site).
export function sitePages(includeDrafts = false): SitePage[] {
  const articles = visibleArticles(includeDrafts);
  return [
    HOME,
    ...PRESET_CATEGORIES.map(category => ({ kind: 'category', category }) as SitePage),
    { kind: 'exercises' },
    ...EXERCISE_DATABASE.map(ex => ({ kind: 'exercise', exerciseId: ex.id }) as SitePage),
    ...(articles.length > 0 ? [{ kind: 'articles' } as SitePage] : []),
    ...articles.map(a => ({ kind: 'article', slug: a.slug }) as SitePage),
    ...(articles.length > 0 && authorPageVisible(includeDrafts) ? [{ kind: 'author' } as SitePage] : []),
  ];
}

export const SITE_PAGES = sitePages();

function pageBody(page: SitePage, base: string, includeDrafts: boolean) {
  const others = otherPages(page, base, includeDrafts);
  switch (page.kind) {
    case 'home': return layout(base, homeMain(base, includeDrafts));
    case 'category': return layout(base, categoryMain(page.category, base), others);
    case 'exercises': return layout(base, exercisesMain(base), others);
    case 'exercise': return layout(base, exerciseMain(exerciseOf(page.exerciseId), base), others);
    case 'articles': return layout(base, articlesMain(base, includeDrafts), others);
    case 'article': return layout(base, articleMain(articleBySlug(page.slug)!, base), others);
    case 'author': return layout(base, authorMain(base), others);
  }
}

// `template` is the built index.html, `base` where the site is served from ('/' on coriace.app).
// `includeDrafts` writes the draft articles too, for a local preview.
export function staticPages(template: string, base = '/', includeDrafts = false): BuiltFile[] {
  const url = (page: SitePage) => `${SITE_URL}${pagePath(page, base)}`;
  const pages = sitePages(includeDrafts);
  const files: BuiltFile[] = pages.flatMap(page => [
    {
      fileName: `${pagePath(page, '')}index.html`,
      source: withPage(template, pageText(page), url(page), `${SITE_URL}${base}${cardPath(page)}`, structuredData(page, base, includeDrafts), pageBody(page, base, includeDrafts)),
    },
    { fileName: cardPath(page), card: card(page) },
  ]);
  // The articles for the Android app, which reads them from the site.
  files.push({ fileName: ARTICLE_FEED, source: JSON.stringify(visibleArticles(includeDrafts)) });
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url><loc>${url(page)}</loc></url>`).join('\n')}
</urlset>
`;
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}${base}sitemap.xml
`;
  return [...files, { fileName: 'sitemap.xml', source: sitemap }, { fileName: 'robots.txt', source: robots }];
}
