import { CATEGORY_PAGES, HOME_PAGE, PageText, SITE_URL, pagePath } from './pages';
import {
  LEVELS, OBJECTIVES, PRESET_CATEGORIES, PRESET_EQUIPMENT_LABELS, PresetCategory, PresetSession, RACE_SESSIONS,
  TARGETED_HINT, TARGETED_INTRO, TARGETED_SESSIONS, categoryLabel, presetEquipment, presetExercises,
} from './sessions';

// Written by the build (see vite.config.ts): the HTML of every page, the sitemap and robots.txt.
// Each page has its own title, description and address, and its text inside the app's root
// element, so search engines and link previews read it without running the app. The app
// replaces that text as soon as it starts; the classes match its screens so the switch is quiet.

export interface BuiltFile {
  fileName: string;
  source: string;
}

const esc = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Fails the build rather than publish a page without its text if index.html changes shape.
function replaceOnce(html: string, pattern: RegExp | string, replacement: string) {
  const found = typeof pattern === 'string' ? html.includes(pattern) : pattern.test(html);
  if (!found) throw new Error(`index.html: ${pattern} not found`);
  return html.replace(pattern, () => replacement);
}

function withPage(template: string, page: PageText, url: string, body: string) {
  const tags = [
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Coriace" />',
    '<meta property="og:locale" content="fr_FR" />',
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/pwa-512x512.png" />`,
    '<meta name="twitter:card" content="summary" />',
  ].join('\n    ');
  let html = replaceOnce(template, /<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`);
  html = replaceOnce(html, /<meta name="description"[^>]*>/, tags);
  return replaceOnce(html, '<div id="root"></div>', `<div id="root">${body}</div>`);
}

const logo = '<svg width="42" height="42" viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4"><path d="M26.5 7.5A13 13 0 1 0 26.5 24.5"/><path d="M22.6 10.4A8.2 8.2 0 1 0 22.6 21.6"/><path d="M18.8 13.3A3.4 3.4 0 1 0 18.8 18.7"/></g></svg>';

const about = 'Coriace guide chaque séance : chrono lisible de loin, bips et voix qui annoncent les exercices, échauffement et retour au calme. Gratuit, sans inscription, fonctionne hors ligne.';

function layout(base: string, main: string, footer: string) {
  return `<div class="min-h-dvh overflow-x-clip text-white bg-brick">
<div class="relative w-full max-w-md min-h-dvh mx-auto px-5 pt-5 pb-6 flex flex-col gap-[22px]">
<header><a href="${base}" class="flex items-center gap-2">${logo}<span class="flex flex-col"><span class="font-display font-extrabold text-[23px] leading-tight tracking-tight">Coriace</span><span class="text-[13px] leading-tight text-sand">Le renfo pour les coureurs</span></span></a></header>
<main class="flex-1 flex flex-col gap-5">
${main}
</main>
<footer class="flex flex-col gap-4 mt-4">
${footer}
<p class="text-sm text-sand">${esc(about)}</p>
<p class="text-sm text-sand"><a href="${base}conditions.html" class="underline">Conditions d'utilisation</a> · <a href="${base}confidentialite.html" class="underline">Confidentialité</a></p>
</footer>
</div>
</div>`;
}

const chip = 'px-2.5 py-0.5 rounded-full bg-ink/10 text-[13px] font-semibold';

function sessionCard(preset: PresetSession) {
  const equipment = presetEquipment(preset).map(eq => PRESET_EQUIPMENT_LABELS[eq]);
  const exercises = presetExercises(preset).map(ex => ex.name).join(' · ');
  return `<li class="bg-cream text-ink rounded-[18px] px-4 py-3.5 flex flex-col gap-1">
<h3 class="flex items-baseline justify-between gap-3"><span class="font-display font-bold text-[21px] leading-tight">${esc(preset.formula ?? preset.name)}</span><span class="font-display font-extrabold text-[17px] shrink-0">${preset.durationMinutes} min</span></h3>
<p class="text-[15px] leading-snug text-clay">${esc(preset.description)}</p>
<p class="text-sm leading-snug text-clay">Exercices : ${esc(exercises)}</p>
<p class="flex flex-wrap gap-1.5 pt-1">${(equipment.length > 0 ? equipment : ['Sans matériel']).map(label => `<span class="${chip}">${esc(label)}</span>`).join('')}</p>
</li>`;
}

const sessionList = (sessions: PresetSession[]) =>
  `<ul class="flex flex-col gap-2.5">\n${sessions.map(sessionCard).join('\n')}\n</ul>`;

function categoryMain(category: PresetCategory) {
  const page = CATEGORY_PAGES[category];
  const intro = category === 'ciblees' ? TARGETED_INTRO : OBJECTIVES.find(o => o.id === category)!.intro;
  const parts = [
    `<h1 class="font-display font-extrabold text-[40px] leading-none tracking-[-0.03em]">${esc(page.heading)}</h1>`,
    `<p class="text-base leading-snug">${esc(intro)}</p>`,
  ];
  if (category === 'ciblees') {
    parts.push(sessionList(TARGETED_SESSIONS));
  } else {
    const sessions = RACE_SESSIONS.filter(p => p.objective === category);
    parts.push(`<p class="text-base font-semibold">${sessions.length} séances, en trois durées : 20, 30 et 45 minutes.</p>`);
    for (const level of LEVELS) {
      parts.push(`<section class="flex flex-col gap-2.5 mt-2">
<div class="flex flex-col gap-0.5"><h2 class="font-display font-extrabold text-[26px] leading-tight">${esc(level.heading)}</h2><p class="text-sm text-sand">${esc(level.hint)}</p></div>
${sessionList(sessions.filter(p => p.level === level.id))}
</section>`);
    }
  }
  return parts.join('\n');
}

function otherPages(category: PresetCategory, base: string) {
  const links = [
    `<li><a href="${base}" class="h-11 px-4 rounded-full border-[1.5px] border-white/55 font-semibold text-[15px] flex items-center">Accueil</a></li>`,
    ...PRESET_CATEGORIES.filter(c => c !== category).map(c =>
      `<li><a href="${pagePath(c, base)}" class="h-11 px-4 rounded-full border-[1.5px] border-white/55 font-semibold text-[15px] flex items-center">${esc(categoryLabel(c))}</a></li>`),
  ];
  return `<nav class="flex flex-col gap-2.5" aria-label="Autres pages">
<h2 class="font-display font-extrabold text-[26px] leading-tight">Les autres séances</h2>
<ul class="flex flex-wrap gap-2">${links.join('')}</ul>
</nav>`;
}

function homeMain(base: string) {
  const rows = PRESET_CATEGORIES.map(category => {
    const objective = OBJECTIVES.find(o => o.id === category);
    const count = objective ? RACE_SESSIONS.filter(p => p.objective === category).length : TARGETED_SESSIONS.length;
    return `<li><a href="${pagePath(category, base)}" class="w-full bg-cream text-ink rounded-[18px] px-4 py-3.5 flex items-center gap-3"><span class="flex-1 flex flex-col gap-0.5"><span class="font-display font-bold text-[22px] leading-tight">${esc(categoryLabel(category))}</span><span class="text-[15px] leading-snug text-clay">${esc(objective?.hint ?? TARGETED_HINT)}</span></span><span class="text-sm font-semibold text-clay shrink-0">${count} séances</span></a></li>`;
  });
  return `<h1 class="font-display font-extrabold text-[44px] leading-none tracking-[-0.03em]">Le renfo pour les coureurs</h1>
<p class="text-base leading-snug">Des séances de renforcement musculaire guidées, pensées pour la course à pied : mollets, adducteurs, fessiers, gainage. Prêtes pour ton objectif, ou composées selon ton matériel et ton temps.</p>
<section class="flex flex-col gap-2.5">
<h2 class="font-display font-extrabold text-[26px] leading-tight">Tu prépares quoi ?</h2>
<ul class="flex flex-col gap-2.5">${rows.join('')}</ul>
</section>`;
}

// `template` is the built index.html, `base` where the site is served from ('/' on coriace.app).
export function staticPages(template: string, base = '/'): BuiltFile[] {
  const url = (path: string) => `${SITE_URL}${path}`;
  const pages: BuiltFile[] = [
    { fileName: 'index.html', source: withPage(template, HOME_PAGE, url(base), layout(base, homeMain(base), '')) },
    ...PRESET_CATEGORIES.map(category => ({
      fileName: `${CATEGORY_PAGES[category].slug}/index.html`,
      source: withPage(template, CATEGORY_PAGES[category], url(pagePath(category, base)),
        layout(base, categoryMain(category), otherPages(category, base))),
    })),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[null, ...PRESET_CATEGORIES].map(category => `  <url><loc>${url(pagePath(category, base))}</loc></url>`).join('\n')}
</urlset>
`;
  const robots = `User-agent: *
Allow: /

Sitemap: ${url(`${base}sitemap.xml`)}
`;
  return [...pages, { fileName: 'sitemap.xml', source: sitemap }, { fileName: 'robots.txt', source: robots }];
}
