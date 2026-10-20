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
  description: 'Le Coureur Coriace court depuis douze ans, prépare le marathon de Bordeaux 2027 et a créé Coriace pour faire son renfo.',
  draft: true,
  blocks: [
    { type: 'p', text: 'Je signe Le Coureur Coriace. Je cours depuis douze ans : d\'abord le 10 km du dimanche, puis deux sorties par semaine, puis trois.' },
    { type: 'p', text: 'Ma première course, c\'était les 24 km de Saint-Émilion, il y a trois ans. Ensuite le semi-marathon de Bordeaux, en 2024 et en 2025, puis deux marathons : Saint-Émilion en 2025, [nom à confirmer] en 2026. Je prépare maintenant le marathon de Bordeaux 2027.' },
    { type: 'p', text: 'Sur mes deux marathons, la même chose s\'est produite : des crampes vers le 30e kilomètre. C\'est pour ça que je me suis mis sérieusement au renforcement musculaire. Et comme je perdais un quart d\'heure à chercher des exercices avant chaque séance, pour finir par refaire toujours les mêmes, j\'ai créé Coriace.' },
    { type: 'p', text: 'Ici, je raconte ce que je vis et ce que je teste, avec mes vrais chiffres, y compris quand ça ne marche pas. Je ne suis ni coach ni médecin : les articles qui parlent du corps et des blessures sont relus par un kinésithérapeute.' },
    { type: 'p', text: 'Une question, une remarque, une expérience à partager : [contact@coriace.app](mailto:contact@coriace.app).' },
  ] as ArticleBlock[],
};

export const ARTICLES: Article[] = [
  {
    slug: 'crampes-30e-kilometre-marathon',
    title: 'Des crampes au 30e kilomètre, à chaque marathon',
    description: 'Deux marathons, deux fois des crampes au 30e kilomètre. Ce que disent vraiment les études sur les crampes, et pourquoi je m\'y attaque par le renfo avant Bordeaux.',
    kind: 'Journal',
    lead: 'Deux marathons, deux fois la même scène : vers le 30e kilomètre, les crampes arrivent et la course devient une survie. Voici ce que j\'ai compris de ces crampes, et pourquoi je m\'y attaque par le renfo avant le marathon de Bordeaux.',
    publishedAt: '2026-10-20',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: true,
    coverExerciseId: 'calves_standing_slow',
    blocks: [
      { type: 'h2', text: 'Douze ans de course, et un mur toujours au même endroit' },
      { type: 'p', text: 'Je cours depuis douze ans. Au début, c\'était le 10 km du dimanche. Puis deux sorties par semaine, puis trois. Ma première course remonte à trois ans : les 24 km de Saint-Émilion. Ensuite le semi de Bordeaux, en 2024 et en 2025, puis mon premier marathon, à Saint-Émilion en 2025, et un deuxième à [nom] en 2026.' },
      { type: 'p', text: 'Sur les deux marathons, le même scénario. Vers le 30e kilomètre, les crampes arrivent : surtout dans les mollets, un peu dans les adducteurs. [À compléter : ce que tu as ressenti, ce que tu as fait, ton temps final et ton objectif.]' },
      { type: 'h2', text: 'Ce qu\'on sait des crampes, et ce qu\'on ne sait pas' },
      { type: 'p', text: 'Pendant longtemps, j\'ai cru que c\'était une question d\'eau et de sels minéraux. Les études récentes nuancent beaucoup cette idée.' },
      { type: 'p', text: 'Une équipe a suivi 210 triathlètes sur un Ironman. Ceux qui ont eu des crampes n\'étaient ni plus déshydratés ni plus pauvres en sodium que les autres. Ce qui les distinguait : ils étaient allés plus vite que prévu, et ils avaient déjà eu des crampes par le passé (Schwellnus, 2011).' },
      { type: 'p', text: 'L\'explication qui tient le mieux aujourd\'hui, c\'est la fatigue du muscle. Quand il est trop fatigué pour l\'effort qu\'on lui demande, les signaux nerveux qui le commandent se dérèglent : il se contracte et n\'arrive plus à se relâcher (Schwellnus, 2009 ; Miller, 2022).' },
      { type: 'p', text: 'Pour moi, ça veut dire deux choses :' },
      {
        type: 'list',
        items: [
          '**partir à une allure que je peux tenir jusqu\'au bout**, et pas celle de mes bonnes sorties ;',
          '**arriver au 30e avec des muscles qui encaissent mieux la fatigue**. C\'est le rôle du renfo.',
        ],
      },
      { type: 'p', text: 'Ce qu\'on ne sait pas : il n\'existe pas de méthode garantie pour ne jamais avoir de crampes. Boire et s\'alimenter pendant la course reste important, pour d\'autres raisons. Je ne sais pas encore si le renfo suffira dans mon cas. C\'est justement ce que je vais tester.' },
      { type: 'h2', text: 'Avant, je faisais toujours la même séance' },
      { type: 'p', text: 'Avant chaque séance de renfo, je passais un quart d\'heure sur YouTube ou dans des applis à chercher des exercices. Rien ne me convenait vraiment, et je finissais par refaire toujours les mêmes. J\'ai aussi fait un peu de natation pour me renforcer.' },
      { type: 'p', text: 'C\'est de là qu\'est née Coriace : une séance prête en quelques secondes, guidée au minuteur et à la voix, qui change d\'une fois sur l\'autre, et pensée pour ce qui lâche en course.' },
      { type: 'h2', text: 'Le plan pour Bordeaux' },
      {
        type: 'list',
        items: [
          '**Trois sorties par semaine**, parfois quatre.',
          '**Une séance de renfo par semaine, parfois deux.** L\'objectif : trois.',
          '**Ce que je travaille** : les mollets, les adducteurs, les fessiers et le gainage, les zones qui lâchent en fin de marathon.',
        ],
      },
      { type: 'exercises', ids: ['calves_standing_slow', 'copenhagen_plank'], caption: 'Deux exercices que je fais pour les mollets et les adducteurs : les mollets en descente lente et la Copenhagen plank.' },
      { type: 'p', text: 'Je raconterai la préparation ici, avec mes chiffres, jusqu\'au jour de la course. Si les crampes reviennent au 30e kilomètre, je le dirai aussi.' },
      { type: 'try', items: ['Les [séances Marathon](/marathon/) de Coriace. Si tu débutes le renfo, commence par une séance courte de 20 minutes, sans matériel.'] },
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
    description: 'Les quatre zones à renforcer pour un marathon, combien de séances par semaine, où les placer par rapport aux sorties : ce que je fais pour préparer Bordeaux.',
    kind: 'Guide',
    lead: 'Trois sorties par semaine, c\'est ma base depuis des années. Le renfo, c\'est ce que je sautais. Voici ce que je travaille pour le marathon de Bordeaux, combien de fois par semaine, et comment je le cale avec les sorties.',
    publishedAt: '2026-10-20',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: true,
    coverExerciseId: 'copenhagen_plank',
    blocks: [
      { type: 'h2', text: 'Pourquoi le renfo compte au marathon' },
      { type: 'p', text: 'À 170 pas par minute pendant 3 h 30, un marathon représente plus de 35 000 appuis. Chacun demande aux mollets, aux cuisses et aux hanches d\'amortir puis de relancer. Au bout de 30 kilomètres, ce sont souvent eux qui lâchent avant le souffle. C\'est ce qui m\'est arrivé deux fois.' },
      { type: 'p', text: 'Les études vont dans le même sens. Une revue de 24 études sur les coureurs de demi-fond et de fond montre que le renforcement musculaire améliore l\'économie de course, c\'est-à-dire l\'énergie dépensée à une allure donnée (Blagrove, 2018). Une autre, tous sports confondus, montre que le renforcement fait nettement baisser le nombre de blessures (Lauersen, 2014).' },
      { type: 'h2', text: 'Les quatre zones que je travaille' },
      { type: 'p', text: '**1. Les mollets.** Ils amortissent chaque appui. J\'en fais deux types : jambes tendues, et genoux pliés pour le muscle profond du mollet (le soléaire).' },
      { type: 'exercises', ids: ['calves_standing_slow', 'calf_raise_isometric_low'], caption: 'Mollets debout en descente lente, et mollets en squat profond pour le soléaire.' },
      { type: 'p', text: '**2. Les adducteurs**, à l\'intérieur des cuisses. Ils stabilisent le bassin et le genou à chaque foulée.' },
      { type: 'exercises', ids: ['copenhagen_plank', 'squat_sumo'], caption: 'Copenhagen plank et squat sumo.' },
      { type: 'p', text: '**3. Les fessiers.** Ce sont eux qui poussent, et qui empêchent le genou de rentrer vers l\'intérieur quand la fatigue arrive.' },
      { type: 'exercises', ids: ['single_leg_bridge', 'side_lying_abduction'], caption: 'Pont fessier sur une jambe et abduction couché sur le côté.' },
      { type: 'p', text: '**4. Le gainage.** Un tronc solide garde une posture efficace, même au 35e kilomètre.' },
      { type: 'exercises', ids: ['side_plank', 'dead_bug'], caption: 'Gainage latéral et dead bug.' },
      { type: 'p', text: 'Chaque exercice a sa fiche dans [les exercices](/exercices/), avec le mouvement animé, un conseil, une version plus facile et une plus dure.' },
      { type: 'h2', text: 'Combien de fois par semaine' },
      { type: 'p', text: 'Aujourd\'hui, je fais une séance de renfo par semaine, parfois deux. Mon objectif : trois. Les programmes étudiés chez les coureurs tournent autour de deux à trois séances par semaine (Blagrove, 2018). Une séance régulière vaut mieux que trois séances un mois puis plus rien.' },
      { type: 'h2', text: 'Où le placer dans la semaine' },
      {
        type: 'list',
        items: [
          '**Pas la veille de la sortie longue ni d\'une séance d\'allure.** Des jambes fatiguées gâchent la séance importante.',
          '**Après une sortie facile, ou un jour sans course.**',
          '**Dans les dix derniers jours avant la course**, je compte garder une séance courte et légère, juste pour entretenir.',
        ],
      },
      { type: 'p', text: '[À compléter : ta semaine type, jour par jour.]' },
      { type: 'h2', text: 'Progresser jusqu\'à la course' },
      {
        type: 'list',
        items: [
          '**Commencer court** : les séances de 20 minutes, sans matériel, au rythme doux (20 secondes d\'effort, 40 de récupération).',
          '**Monter progressivement** : séances de 30 minutes, puis de 45, et le rythme équilibré.',
          '**Varier** : les séances Complète A, B et C font travailler tout le corps avec des exercices différents. Les séances Mollets, Gainage et Cardio insistent sur un point.',
        ],
      },
      { type: 'p', text: '[À compléter : où tu en es aujourd\'hui.]' },
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
