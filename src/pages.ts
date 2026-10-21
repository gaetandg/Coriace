import { EXERCISE_DATABASE } from './exercises';
import { Objective, PRESET_CATEGORIES, PresetCategory, RACE_SESSIONS, TARGETED_SESSIONS } from './sessions';
import { Exercise } from './types';
import { AUTHOR, AUTHOR_PAGE, authorPageVisible, visibleArticles } from './articles';

// The site's pages: the home page, one page per race distance, one for the targeted sessions, the
// list of exercises and one page per exercise. Each has its own address (coriace.app/marathon/…)
// and its own title and description for search engines. The app keeps the address bar on the page
// shown; the build writes each page's HTML (see staticPages.ts).

export const SITE_URL = 'https://coriace.app';
// The Android app's page on Google Play.
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=app.coriace';

export type SitePage =
  | { kind: 'home' }
  | { kind: 'category'; category: PresetCategory }
  | { kind: 'exercises' }
  | { kind: 'exercise'; exerciseId: string }
  | { kind: 'articles' }
  | { kind: 'article'; slug: string }
  | { kind: 'author' };

export const HOME: SitePage = { kind: 'home' };

export interface PageText {
  title: string; // tab and search result title
  description: string; // search result snippet
}

export interface CategoryPage extends PageText {
  slug: string;
  heading: string;
}

const raceCount = (objective: Objective) => RACE_SESSIONS.filter(p => p.objective === objective).length;
const targetedMinutes = TARGETED_SESSIONS.map(p => p.durationMinutes);

export const HOME_PAGE: PageText = {
  title: 'Coriace · Renfo pour coureurs, séances guidées',
  description: 'Séances de renforcement musculaire guidées pour les coureurs : 10 km, semi, marathon, trail. Minuteur et voix, sans matériel ou presque. Gratuit, sans inscription.',
};

export const CATEGORY_PAGES: Record<PresetCategory, CategoryPage> = {
  '10k': {
    slug: '10-km',
    heading: 'Renfo pour le 10 km',
    title: `Renfo pour le 10 km : ${raceCount('10k')} séances guidées · Coriace`,
    description: `${raceCount('10k')} séances de renfo pour préparer un 10 km : rebond, poussée sur une jambe et gainage. 20, 30 ou 45 minutes, guidées au minuteur et à la voix. Gratuit.`,
  },
  semi: {
    slug: 'semi-marathon',
    heading: 'Renfo pour le semi-marathon',
    title: `Renfo pour le semi-marathon : ${raceCount('semi')} séances guidées · Coriace`,
    description: `${raceCount('semi')} séances de renfo pour préparer un semi-marathon : mollets, hanches, rebond et gainage. 20, 30 ou 45 minutes, guidées au minuteur et à la voix. Gratuit.`,
  },
  marathon: {
    slug: 'marathon',
    heading: 'Renfo pour le marathon',
    title: `Renfo pour le marathon : ${raceCount('marathon')} séances guidées · Coriace`,
    description: `${raceCount('marathon')} séances de renfo pour préparer un marathon : mollets, adducteurs, fessiers et gainage pour tenir les derniers kilomètres. 20, 30 ou 45 minutes, guidées. Gratuit.`,
  },
  ultra: {
    slug: 'trail-ultra',
    heading: 'Renfo pour le trail et l\'ultra',
    title: `Renfo pour le trail et l'ultra : ${raceCount('ultra')} séances guidées · Coriace`,
    description: `${raceCount('ultra')} séances de renfo pour le trail et les courses de plus de 50 km : descentes, chevilles, équilibre et endurance des muscles. 20, 30 ou 45 minutes, guidées. Gratuit.`,
  },
  ciblees: {
    slug: 'seances-ciblees',
    heading: 'Séances de renfo ciblées',
    title: 'Renfo ciblé pour coureurs : mollets, genoux, gainage · Coriace',
    description: `${TARGETED_SESSIONS.length} séances de renfo ciblées pour coureurs : mollets, tendon d'Achille, genoux, hanches, gainage, côtes, descentes. ${Math.min(...targetedMinutes)} à ${Math.max(...targetedMinutes)} minutes, guidées. Gratuit.`,
  },
};

export const EXERCISES_SLUG = 'exercices';

export const EXERCISES_PAGE: PageText & { heading: string; intro: string } = {
  heading: 'Les exercices de renfo pour coureurs',
  intro: 'Chaque exercice des séances, expliqué et animé : le mouvement, un conseil, une version plus facile et une plus dure.',
  title: `Exercices de renfo pour coureurs : ${EXERCISE_DATABASE.length} fiches · Coriace`,
  description: `${EXERCISE_DATABASE.length} exercices de renforcement pour coureurs, expliqués et animés : mollets, adducteurs, fessiers, cuisses, gainage. Mouvement, conseil, version plus facile et plus dure.`,
};

export const ARTICLES_SLUG = 'articles';

export const ARTICLES_PAGE: PageText & { heading: string; intro: string } = {
  heading: 'Les articles',
  intro: 'Ce que je vis et teste en préparant mes courses : le renfo, les crampes, les blessures, avec mes vrais chiffres.',
  title: 'Articles sur le renfo et la course à pied · Coriace',
  description: 'Le renfo pour les coureurs, raconté par un marathonien amateur : préparation, crampes, tests, avec de vrais chiffres.',
};

// From the exercise's name, without accents: "Mollets debout, descente lente" → mollets-debout-descente-lente.
// Renaming an exercise changes its address.
export const exerciseSlug = (exercise: Exercise) =>
  exercise.name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const exerciseById = (id: string) => EXERCISE_DATABASE.find(ex => ex.id === id);

// The search snippet: the target, then the movement, cut at a word near 160 characters.
function snippet(text: string, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.]+$/, '')}…`;
}

// `base` is where the site is served from, with its trailing slash ('/' on coriace.app).
export function pagePath(page: SitePage, base = '/'): string {
  switch (page.kind) {
    case 'home': return base;
    case 'category': return `${base}${CATEGORY_PAGES[page.category].slug}/`;
    case 'exercises': return `${base}${EXERCISES_SLUG}/`;
    case 'exercise': return `${base}${EXERCISES_SLUG}/${exerciseSlug(exerciseById(page.exerciseId)!)}/`;
    case 'articles': return `${base}${ARTICLES_SLUG}/`;
    case 'article': return `${base}${ARTICLES_SLUG}/${page.slug}/`;
    case 'author': return `${base}${ARTICLES_SLUG}/${AUTHOR.slug}/`;
  }
}

// The page at an address, also without its trailing slash or with index.html; the home page for any
// address the site doesn't have. Drafts of articles only have an address on the development server.
export function pageAt(pathname: string, base = '/', includeDrafts = false): SitePage {
  if (!pathname.startsWith(base)) return HOME;
  const [first, second, ...rest] = pathname.slice(base.length).replace(/\/(index\.html)?$/, '').split('/');
  if (rest.length > 0) return HOME;
  if (first === ARTICLES_SLUG) {
    const articles = visibleArticles(includeDrafts);
    if (articles.length === 0) return HOME;
    if (second === undefined) return { kind: 'articles' };
    if (second === AUTHOR.slug) return authorPageVisible(includeDrafts) ? { kind: 'author' } : HOME;
    return articles.some(a => a.slug === second) ? { kind: 'article', slug: second } : HOME;
  }
  if (first === EXERCISES_SLUG) {
    if (second === undefined) return { kind: 'exercises' };
    const exercise = EXERCISE_DATABASE.find(ex => exerciseSlug(ex) === second);
    return exercise ? { kind: 'exercise', exerciseId: exercise.id } : HOME;
  }
  const category = second === undefined ? PRESET_CATEGORIES.find(c => CATEGORY_PAGES[c].slug === first) : undefined;
  return category ? { kind: 'category', category } : HOME;
}

export function pageText(page: SitePage): PageText {
  switch (page.kind) {
    case 'home': return HOME_PAGE;
    case 'category': return CATEGORY_PAGES[page.category];
    case 'exercises': return EXERCISES_PAGE;
    case 'exercise': {
      const exercise = exerciseById(page.exerciseId)!;
      return {
        title: `${exercise.name} : exercice de renfo pour coureurs · Coriace`,
        description: snippet(`${exercise.target}. ${exercise.description}`),
      };
    }
    case 'articles': return ARTICLES_PAGE;
    case 'article': {
      // The Android app can show an article newer than itself, read from the site.
      const article = articleBySlug(page.slug);
      return article ? { title: `${article.title} · Coriace`, description: article.description } : ARTICLES_PAGE;
    }
    case 'author': return { title: `${AUTHOR_PAGE.title} ${AUTHOR.name} · Coriace`, description: AUTHOR_PAGE.description };
  }
}

export const articleBySlug = (slug: string) => visibleArticles(true).find(a => a.slug === slug);
