import { Objective, PRESET_CATEGORIES, PresetCategory, RACE_SESSIONS, TARGETED_SESSIONS } from './sessions';

// The site's pages: the home page, one page per race distance and one for the targeted sessions.
// Each has its own address (coriace.app/marathon/…) and its own title and description for search
// engines. The app keeps the address bar on the page shown; the build writes each page's HTML
// (see staticPages.ts).

export const SITE_URL = 'https://coriace.app';

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

// `base` is where the site is served from, with its trailing slash ('/' on coriace.app).
export const pagePath = (category: PresetCategory | null, base = '/') =>
  category ? `${base}${CATEGORY_PAGES[category].slug}/` : base;

// The page at an address, also without its trailing slash or with index.html; null for the home page.
export function pageAt(pathname: string, base = '/'): PresetCategory | null {
  if (!pathname.startsWith(base)) return null;
  const slug = pathname.slice(base.length).replace(/\/(index\.html)?$/, '');
  return PRESET_CATEGORIES.find(category => CATEGORY_PAGES[category].slug === slug) ?? null;
}

export const pageTitle = (category: PresetCategory | null) => (category ? CATEGORY_PAGES[category] : HOME_PAGE).title;
