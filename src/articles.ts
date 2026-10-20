// The articles (coriace.app/articles/…) and the author's page, written following the editorial
// charter: real experience, nothing invented, home-made illustrations, health notice. Drafts are
// only shown by the development server until the author has proofread them.

// Paragraph text with **bold** and [links](/marathon/).
export type Inline = string;

export type ArticleBlock =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: Inline }
  | { type: 'list'; items: Inline[]; ordered?: boolean }
  // Animated exercises from the app, side by side, with a caption.
  | { type: 'exercises'; ids: string[]; caption: string }
  // A chart or photo from public/articles/, as wide as the text.
  | { type: 'image'; src: string; alt: string; caption: string; width: number; height: number }
  // "À essayer": the app's sessions or pages that go with the article.
  | { type: 'try'; items: Inline[] };

export interface Article {
  slug: string; // coriace.app/articles/<slug>/
  title: string; // the heading, under 60 characters
  description: string; // search result snippet
  kind: string; // Journal, Guide, Auto-test…
  lead: string; // the opening paragraph, in bold
  blocks: ArticleBlock[];
  sources: string[];
  publishedAt: string; // YYYY-MM-DD
  updatedAt?: string;
  reviewedByPhysio: boolean;
  healthNotice: boolean;
  draft: boolean;
  // A still of this exercise on the share image.
  coverExerciseId?: string;
}

export const AUTHOR = { name: 'Le Coureur Coriace', slug: 'qui-ecrit' };

export const HEALTH_NOTICE = 'Cet article partage une expérience et des repères généraux. Il ne remplace pas l\'avis d\'un médecin ou d\'un kinésithérapeute, surtout en cas de douleur.';

// "Qui écrit ?": the author, without name or photo.
export const AUTHOR_PAGE = {
  title: 'Qui écrit ?',
  description: 'Le Coureur Coriace court depuis douze ans, prépare le marathon de Bordeaux et a créé Coriace pour faire son renfo.',
  draft: false,
  blocks: [
    { type: 'p', text: 'Je signe Le Coureur Coriace. Je cours depuis douze ans : d\'abord le 10 km du dimanche, puis deux sorties par semaine, puis trois.' },
    { type: 'p', text: 'Ma première course, c\'était les 23 km de Saint-Émilion, en mars 2023. Ensuite le semi-marathon de Bordeaux, trois années de suite, puis deux marathons : le marathon trail de Saint-Émilion en 2025 et le Marathon des 2 Rives en 2026. Je prépare maintenant le marathon de Bordeaux, le 8 novembre 2026, avec un objectif de 3 h 20.' },
    { type: 'p', text: 'Sur mes deux marathons, la même chose s\'est produite : des crampes vers le 30e kilomètre. C\'est pour ça que je me suis mis sérieusement au renforcement musculaire. Et comme je perdais un quart d\'heure à chercher des exercices avant chaque séance, pour finir par refaire toujours les mêmes, j\'ai créé Coriace.' },
    { type: 'p', text: 'Ici, je raconte ce que je vis et ce que je teste, avec mes vrais chiffres, y compris quand ça ne marche pas. Je ne suis ni coach ni médecin : les articles qui parlent du corps et des blessures sont relus par un kinésithérapeute.' },
    { type: 'p', text: 'Une question, une remarque, une expérience à partager : [contact@coriace.app](mailto:contact@coriace.app).' },
  ] as ArticleBlock[],
};

export const ARTICLES: Article[] = [
  {
    slug: 'crampes-30e-kilometre-marathon',
    title: 'Des crampes au 30e kilomètre, à chaque marathon',
    description: "Deux marathons, deux fois des crampes au 30e kilomètre. Ce que montre ma montre, une étude sur 210 triathlètes, et ce que je change pour Bordeaux.",
    kind: 'Journal',
    lead: "Deux marathons, et deux fois le même scénario : vers le 30e kilomètre, mes mollets se bloquent et je finis en alternant marche et course. Avant Bordeaux, j'ai voulu comprendre pourquoi.",
    publishedAt: '2026-10-20',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: false,
    coverExerciseId: 'calves_standing_slow',
    blocks: [
      { type: 'h2', text: 'Le 30e kilomètre, toujours' },
      { type: 'p', text: "Je cours depuis douze ans. Le 10 km du dimanche pendant longtemps, puis deux sorties par semaine, puis trois. Ma première course, je l'ai faite en mars 2023 : les 23 km de Saint-Émilion. Ensuite trois semis de Bordeaux d'affilée (1 h 28, 1 h 27, 1 h 26), et deux marathons : le trail de Saint-Émilion en 2025, les 2 Rives en mai dernier." },
      { type: 'p', text: "Les deux fois, ça a lâché au même endroit. Les mollets surtout, un peu les adducteurs. Je m'arrête, j'étire, je marche, et je repars dès que je peux. Résultat : 3 h 40 à Saint-Émilion, avec 470 mètres de dénivelé, et 3 h 37 aux 2 Rives." },
      { type: 'h2', text: 'Ce que montre ma montre' },
      { type: 'p', text: "Aux 2 Rives, j'ai couru les 22 premiers kilomètres à 4 min 34 de moyenne. C'est l'allure d'un marathon en 3 h 13. Mon cardio, lui, est passé de 155 à 167. Ça a commencé à ralentir au 23e, j'ai marché une première fois au 27e, et à partir du 31e, je n'ai plus fait qu'alterner. Le 36e kilomètre m'a pris 8 min 35. Première moitié en 1 h 37, deuxième en 2 h 01." },
      { type: 'image', src: '/articles/marathon-2-rives-allure.svg', width: 440, height: 500, alt: "Graphique de l'allure au kilomètre sur le Marathon des 2 Rives : stable autour de 4 min 34 jusqu'au 22e kilomètre, puis de plus en plus lente, avec des passages en marche à partir du 27e.", caption: "Mon allure au kilomètre aux 2 Rives. En bas, le temps passé à marcher dans chaque kilomètre." },
      { type: 'p', text: "À Saint-Émilion, sur un parcours plus vallonné, ça a lâché plus tard mais plus fort : 29 minutes de plus sur la deuxième moitié, et entre le 38e et le 40e, je marchais plus que je ne courais." },
      { type: 'p', text: "Sur semi, en revanche, aucun problème. En 2025, j'ai tenu entre 3 min 54 et 4 min 08 du premier au dernier kilomètre. Tout se joue au-delà de 25." },
      { type: 'h2', text: "Pas une histoire d'eau" },
      { type: 'p', text: "J'ai longtemps cru que les crampes venaient d'un manque d'eau ou de sels minéraux. En lisant un peu, j'ai trouvé une étude qui m'a fait changer d'avis." },
      { type: 'p', text: "Des chercheurs ont suivi 210 triathlètes sur un Ironman. Ceux qui ont eu des crampes n'étaient pas plus déshydratés que les autres, ni plus pauvres en sodium. Par contre, ils étaient partis plus vite que prévu, et ils avaient déjà eu des crampes avant (Schwellnus, 2011)." },
      { type: 'p', text: "Partir trop vite et avoir déjà eu des crampes : c'est exactement mon cas aux 2 Rives." },
      { type: 'p', text: "Aujourd'hui, l'explication qui tient le mieux, c'est la fatigue. Un muscle épuisé reçoit des signaux nerveux qui se dérèglent : il se contracte et ne se relâche plus (Schwellnus, 2009 ; Miller, 2022). Personne n'a de méthode qui marche à tous les coups, et boire et manger pendant la course reste utile pour d'autres raisons." },
      { type: 'p', text: "Pour Bordeaux, j'en retiens deux choses. Partir à une allure que je tiendrai jusqu'au bout. Et arriver au 30e avec des mollets qui encaissent mieux, ce qui passe par le renfo. Est-ce que ça suffira ? Je le saurai le 8 novembre." },
      { type: 'h2', text: 'Le renfo, enfin régulier' },
      { type: 'p', text: "Avant, chaque séance de renfo commençait par un quart d'heure sur YouTube ou dans une appli, à chercher des exercices. Rien ne me convenait, et je finissais par refaire les mêmes. J'ai aussi nagé un peu pour me renforcer." },
      { type: 'p', text: "J'ai fait Coriace pour ne plus perdre ce temps : je choisis une séance, elle est guidée au chrono et à la voix, et elle change d'une fois sur l'autre. Ça se voit sur Strava : 10 séances de renfo en 2025, 18 depuis le début de 2026, dont une par semaine depuis septembre." },
      { type: 'exercises', ids: ['calves_standing_slow', 'copenhagen_plank'], caption: "Deux exercices que je fais pour les mollets et les adducteurs : les mollets en descente lente et la Copenhagen plank." },
      { type: 'h2', text: 'Trois semaines avant Bordeaux' },
      { type: 'p', text: "Le 14 octobre, séance test de 30 km. Du 17e au 26e kilomètre, j'étais autour de 4 min 45, l'allure prévue pour 3 h 20, avec un cardio entre 150 et 157, et sans marcher. Les trois kilomètres d'après ont été plus durs, entre 5 min 10 et 5 min 33. Pas parfait, mais rien à voir avec le départ des 2 Rives." },
      { type: 'p', text: "D'ici la course : fractionné, endurance, côtes et sortie longue chaque semaine, plus une ou deux séances de renfo. Le 8 novembre, je vise 3 h 20, et surtout un 30e kilomètre sans crampe. Je raconterai ici comment ça s'est passé, crampes comprises." },
      { type: 'try', items: ["Les [séances Marathon](/marathon/) de Coriace. Si tu débutes le renfo, commence par une séance courte de 20 minutes, sans matériel."] },
    ],
    sources: [
      'Schwellnus MP et al. Increased running speed and previous cramps rather than dehydration or serum sodium changes predict exercise-associated muscle cramping: a prospective cohort study in 210 Ironman triathletes. British Journal of Sports Medicine, 2011.',
      'Schwellnus MP. Cause of exercise associated muscle cramps (EAMC): altered neuromuscular control, dehydration or electrolyte depletion? British Journal of Sports Medicine, 2009.',
      'Miller KC et al. An evidence-based review of the pathophysiology, treatment, and prevention of exercise-associated muscle cramps. Journal of Athletic Training, 2022.',
    ],
  },
  {
    slug: 'renfo-marathon-plan-bordeaux',
    title: 'Renfo et marathon : mon plan pour Bordeaux',
    description: "Ce que je renforce pour le marathon de Bordeaux, combien de séances par semaine, et où je les place entre fractionné, côtes et sortie longue.",
    kind: 'Guide',
    lead: "Trois sorties par semaine, je sais faire depuis longtemps. Le renfo, je le sautais. Pour Bordeaux, je m'y suis mis pour de bon : ce que je travaille, combien de fois, et où je le cale dans la semaine.",
    publishedAt: '2026-10-20',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: false,
    coverExerciseId: 'copenhagen_plank',
    blocks: [
      { type: 'h2', text: '37 000 appuis' },
      { type: 'p', text: "Aux 2 Rives, ma montre a compté 170 pas par minute en moyenne. Sur 3 h 37, ça fait environ 37 000 appuis. À chacun, les mollets, les cuisses et les hanches amortissent puis relancent. Au 30e kilomètre, c'est eux qui ont lâché, pas le souffle." },
      { type: 'p', text: "Je ne suis pas le seul à le constater. Une revue de 24 études sur les coureurs de fond conclut que le renfo améliore l'économie de course, autrement dit l'énergie qu'on dépense à une allure donnée (Blagrove, 2018). Une autre, tous sports confondus, montre qu'il réduit nettement les blessures (Lauersen, 2014)." },
      { type: 'h2', text: 'Ce que je travaille' },
      { type: 'p', text: "Quatre zones, celles qui lâchent en fin de marathon. D'abord les mollets, qui amortissent chaque appui. Je les fais jambes tendues, et genoux pliés pour toucher aussi le soléaire, le muscle profond du mollet." },
      { type: 'exercises', ids: ['calves_standing_slow', 'calf_raise_isometric_low'], caption: 'Mollets debout en descente lente, et mollets en squat profond pour le soléaire.' },
      { type: 'p', text: "Ensuite les adducteurs, à l'intérieur des cuisses. Ils tiennent le bassin et le genou à chaque foulée, et chez moi, ils crampent aussi." },
      { type: 'exercises', ids: ['copenhagen_plank', 'squat_sumo'], caption: 'Copenhagen plank et squat sumo.' },
      { type: 'p', text: "Les fessiers, qui poussent et empêchent le genou de rentrer vers l'intérieur quand la fatigue arrive." },
      { type: 'exercises', ids: ['single_leg_bridge', 'side_lying_abduction'], caption: 'Pont fessier sur une jambe et abduction couché sur le côté.' },
      { type: 'p', text: "Et le gainage, pour garder une posture correcte quand ça devient dur." },
      { type: 'exercises', ids: ['side_plank', 'dead_bug'], caption: 'Gainage latéral et dead bug.' },
      { type: 'p', text: "Chaque exercice a sa fiche dans [les exercices](/exercices/), avec le mouvement animé, un conseil, une version plus facile et une plus dure." },
      { type: 'h2', text: 'Combien de fois' },
      { type: 'p', text: "Une séance par semaine, parfois deux, et j'aimerais monter à trois. Les programmes étudiés chez les coureurs tournent autour de deux à trois séances par semaine (Blagrove, 2018). Mais une séance tenue chaque semaine vaut mieux que trois pendant un mois, puis plus rien." },
      { type: 'h2', text: 'Où je le place' },
      { type: 'p', text: "Ma semaine : fractionné le lundi, endurance le mardi, côtes le mercredi, sortie longue le vendredi, et une endurance de plus quand je peux. En septembre, je faisais le renfo le mercredi. En octobre, plutôt le soir en début de semaine, ou le dimanche. Une seule règle : jamais la veille de la sortie longue, pour ne pas la courir avec les jambes lourdes." },
      { type: 'p', text: "Dans les dix derniers jours avant Bordeaux, je compte garder une séance courte et légère, juste pour entretenir." },
      { type: 'h2', text: 'Par où commencer' },
      { type: 'p', text: "Si tu débutes, prends les séances courtes de Coriace : 20 minutes, sans matériel, au rythme doux (20 secondes d'effort, 40 de récup). Passe ensuite aux séances de 30, puis de 45 minutes, et au rythme équilibré. Les Complètes A, B et C font travailler tout le corps avec des exercices différents. Mollets, Gainage et Cardio insistent sur un point." },
      { type: 'p', text: "Moi, j'en suis à une séance par semaine depuis septembre, et quatre sur les trois premières semaines d'octobre. Le marathon, c'est le 8 novembre." },
      { type: 'try', items: ['Les 18 [séances Marathon](/marathon/) de Coriace.'] },
    ],
    sources: [
      'Blagrove RC, Howatson G, Hayes PR. Effects of strength training on the physiological determinants of middle- and long-distance running performance: a systematic review. Sports Medicine, 2018.',
      'Lauersen JB, Bertelsen DM, Andersen LB. The effectiveness of exercise interventions to prevent sports injuries: a systematic review and meta-analysis of randomised controlled trials. British Journal of Sports Medicine, 2014.',
    ],
  },
  {
    slug: 'test-mollets-coureur',
    title: 'Teste tes mollets en 2 minutes',
    description: 'Un test simple, contre un mur, pour savoir où en sont tes mollets et suivre tes progrès : le protocole, les repères chiffrés et la séance qui va avec.',
    kind: 'Auto-test',
    lead: 'Au marathon, mes mollets lâchent avant mon souffle. Un test simple, contre un mur, permet de savoir où on en est et de suivre ses progrès. Voici comment le faire, les repères pour se situer, et mon propre résultat.',
    publishedAt: '2026-10-20',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: true,
    coverExerciseId: 'calves_standing_slow',
    blocks: [
      { type: 'h2', text: 'Le test' },
      { type: 'p', text: '**Ce qu\'il faut** : un mur, un sol plat, et un métronome réglé à 60 battements par minute (il existe des applis gratuites).' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Pieds nus, tiens-toi debout sur une jambe, l\'autre pied décollé du sol. Pose le bout des doigts contre le mur pour l\'équilibre, sans t\'y appuyer.',
          'Monte sur la pointe du pied le plus haut possible en un battement, redescends en un battement.',
          'Compte les montées jusqu\'à ce que tu ne montes plus aussi haut, que tu perdes le rythme, ou que tu doives t\'appuyer sur le mur.',
          'Repose-toi une minute, puis fais l\'autre jambe.',
        ],
      },
      { type: 'exercises', ids: ['calves_standing_slow'], caption: 'Le mouvement : monter le plus haut possible sur la pointe, redescendre en contrôlant.' },
      { type: 'h2', text: 'Les repères' },
      { type: 'p', text: 'Le chiffre le plus souvent cité : **25 montées**, considéré comme normal chez l\'adulte (Lunsford et Perry, 1995). Les façons de faire le test varient beaucoup d\'une étude à l\'autre (Hébert-Losier, 2009). Le plus utile reste donc de **te comparer à toi-même**, d\'une fois sur l\'autre, avec le même protocole.' },
      { type: 'p', text: '[À valider par le kiné : le repère visé chez les coureurs, et à partir de quel écart entre les deux jambes il faut s\'en occuper.]' },
      { type: 'h2', text: 'Mon résultat' },
      { type: 'p', text: '[À compléter : jambe droite … montées, jambe gauche … montées. Ce que tu as ressenti, où ça brûlait.]' },
      { type: 'h2', text: 'Et après' },
      {
        type: 'list',
        items: [
          '**Si tu es loin du repère, ou s\'il y a un gros écart entre tes deux jambes** : deux séances par semaine qui insistent sur les mollets. Dans Coriace, la séance ciblée « Mollets express » (15 minutes) et les séances « Mollets » de chaque distance.',
          '**Refais le test toutes les quatre à six semaines**, toujours de la même façon, et note tes résultats.',
          '**Si le test réveille une douleur au tendon d\'Achille**, arrête et demande l\'avis d\'un kiné.',
        ],
      },
      {
        type: 'try',
        items: [
          'Les [séances ciblées](/seances-ciblees/), dont « Mollets express » et « Tendon d\'Achille ».',
          'La fiche de l\'exercice [Mollets debout, descente lente](/exercices/mollets-debout-descente-lente/).',
        ],
      },
    ],
    sources: [
      'Lunsford BR, Perry J. The standing heel-rise test for ankle plantar flexion: criterion for normal. Physical Therapy, 1995.',
      'Hébert-Losier K, Newsham-West RJ, Schneiders AG, Sullivan SJ. Raising the standards of the calf-raise test: a systematic review. Journal of Science and Medicine in Sport, 2009.',
    ],
  },
];

// Articles to show: published ones, plus drafts on the development server.
export const visibleArticles = (includeDrafts: boolean) =>
  ARTICLES.filter(a => includeDrafts || !a.draft).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const authorPageVisible = (includeDrafts: boolean) => includeDrafts || !AUTHOR_PAGE.draft;

// --- Inline text ---

export type InlinePart = { kind: 'text' | 'bold'; text: string } | { kind: 'link'; text: string; href: string };

// "**gras** et [lien](/x/)" → text, bold and link parts. No nesting.
export function parseInline(text: Inline): InlinePart[] {
  const parts: InlinePart[] = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
    if (match.index > last) parts.push({ kind: 'text', text: text.slice(last, match.index) });
    parts.push(match[1] !== undefined ? { kind: 'bold', text: match[1] } : { kind: 'link', text: match[2], href: match[3] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ kind: 'text', text: text.slice(last) });
  return parts;
}

// "20 octobre 2026"
export const articleDate = (isoDay: string) =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${isoDay}T12:00:00Z`));

// Rough reading time at 220 words a minute.
export function readingMinutes(article: Article) {
  const text = [article.lead, ...article.blocks.flatMap(b => ('text' in b ? [b.text] : 'items' in b ? b.items : [b.caption]))].join(' ');
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}
