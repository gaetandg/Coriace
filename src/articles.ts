// The articles (coriace.app/articles/…) and the author's page, written following the editorial
// charter: real experience, nothing invented, home-made illustrations, health notice. Drafts are
// only shown by the development server until the author has proofread them. An article dated in
// the future goes out on its date: the site is rebuilt every morning.

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
  publishedAt: string; // YYYY-MM-DD, the day it goes out
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
    { type: 'p', text: 'Ici, je raconte ce que je vis et ce que je teste, avec mes vrais chiffres, y compris quand ça ne marche pas. Je ne suis ni coach ni médecin.' },
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
      { type: 'p', text: "Je cours depuis douze ans. Longtemps, c'était le 10 km du dimanche, puis deux sorties par semaine, puis trois. Je me suis mis aux courses en 2023 : un 23 km à Saint-Émilion, trois semis de Bordeaux, puis deux marathons, le trail de Saint-Émilion et les 2 Rives en mai dernier." },
      { type: 'p', text: "Les deux fois, ça a lâché au même endroit, vers le 30e km. Les mollets surtout, un peu les adducteurs. Je m'arrête, j'étire, je marche, et je repars dès que je peux. Résultat : 3 h 40 à Saint-Émilion et 3 h 37 aux 2 Rives." },
      { type: 'h2', text: 'Ce que montre ma montre' },
      { type: 'p', text: "Aux 2 Rives, j'ai couru les 22 premiers kilomètres à 4'34/km de moyenne. C'est l'allure d'un marathon en 3 h 13. Mon cardio, lui, est passé de 155 à 167 bpm. J'ai commencé à ralentir au 23e km, j'ai marché une première fois au 27e km, et à partir du 31e km, je n'ai plus fait qu'alterner marche et course. Le 36e km m'a pris 8 min 35. Première moitié du marathon en 1 h 37, deuxième en 2 h 01." },
      { type: 'image', src: '/articles/marathon-2-rives-allure.svg', width: 440, height: 500, alt: "Graphique de l'allure au kilomètre sur le Marathon des 2 Rives : stable autour de 4'34/km jusqu'au 22e km, puis de plus en plus lente, avec des passages en marche à partir du 27e km.", caption: "Mon allure au kilomètre aux 2 Rives. En bas, le temps passé à marcher dans chaque kilomètre." },
      { type: 'p', text: "À Saint-Émilion, sur un parcours plus vallonné, ça a lâché plus tard mais plus fort : 29 minutes de plus sur la deuxième moitié, et entre le 38e et le 40e km, je marchais plus que je ne courais." },
      { type: 'p', text: "En semi-marathon, en revanche, aucun problème. En 2025, tous mes kilomètres étaient entre 3'54/km et 4'08/km, du premier au dernier. Tout se joue au-delà du 25e km." },
      { type: 'h2', text: "Pas une histoire d'eau" },
      { type: 'p', text: "J'ai longtemps cru que les crampes venaient d'un manque d'eau ou de sels minéraux. En lisant un peu, j'ai trouvé une étude qui m'a fait changer d'avis." },
      { type: 'p', text: "Des chercheurs ont suivi 210 triathlètes sur un Ironman. Ceux qui ont eu des crampes n'étaient pas plus déshydratés que les autres, ni plus pauvres en sodium. Par contre, ils avaient couru plus vite que les autres, et ils avaient déjà eu des crampes sur des courses précédentes (Schwellnus, 2011)." },
      { type: 'p', text: "Un rythme élevé et des crampes passées : c'est exactement mon cas aux 2 Rives, où je suis parti sur une allure de 3 h 13." },
      { type: 'p', text: "Aujourd'hui, l'explication qui tient le mieux, c'est la fatigue. Un muscle épuisé reçoit des signaux nerveux qui se dérèglent : il se contracte et ne se relâche plus (Schwellnus, 2009 ; Miller, 2022). Personne n'a de méthode qui marche à tous les coups, et boire et manger pendant la course reste utile pour d'autres raisons." },
      { type: 'p', text: "Pour Bordeaux, j'en retiens deux choses. Partir à une allure que je tiendrai jusqu'au bout. Et arriver au 30e km avec des mollets qui encaissent mieux, ce qui passe par le renfo. Est-ce que ça suffira ? Je le saurai le 8 novembre." },
      { type: 'h2', text: 'Le renfo, enfin régulier' },
      { type: 'p', text: "Avant, chaque séance de renfo commençait par un quart d'heure sur YouTube ou dans une appli, à chercher des exercices. Rien ne me convenait, et je finissais par refaire les mêmes. J'ai aussi nagé un peu pour me renforcer." },
      { type: 'p', text: "J'ai fait Coriace pour ne plus perdre ce temps : je choisis une séance, elle est guidée au chrono et à la voix, et elle change d'une fois sur l'autre. Ça se voit sur Strava : 10 séances de renfo en 2025, 18 depuis le début de 2026, dont une par semaine depuis septembre." },
      { type: 'exercises', ids: ['calves_standing_slow', 'copenhagen_plank'], caption: "Deux exercices que je fais pour les mollets et les adducteurs : les mollets en descente lente et la Copenhagen plank." },
      { type: 'h2', text: 'Trois semaines avant Bordeaux' },
      { type: 'p', text: "Le 14 octobre, séance test de 30 km. Du 17e au 26e km, j'étais autour de 4'45/km, l'allure prévue pour 3 h 20, avec un cardio entre 150 et 157 bpm, puis 4 km de récup. Rien à voir avec le départ des 2 Rives. J'ai détaillé cette sortie dans [un article à part](/articles/sortie-longue-30-km-analyse/)." },
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
      { type: 'p', text: "Aux 2 Rives, ma montre a compté 170 pas par minute en moyenne. Sur 3 h 37, ça fait environ 37 000 appuis. À chacun, les mollets, les cuisses et les hanches amortissent puis relancent. Au 30e kilomètre, ce sont eux qui ont lâché, pas le souffle." },
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
    slug: 'sortie-longue-30-km-analyse',
    title: 'Ma sortie test de 30 km, à trois semaines de Bordeaux',
    description: "30 km dont 10 à l'allure marathon : allure, cardio et cadence, comparés à la même sortie faite en avril avant les 2 Rives.",
    kind: 'Analyse',
    lead: "Le 14 octobre, j'ai fait ma dernière grosse sortie avant Bordeaux : 30 km, dont 10 à l'allure visée pour 3 h 20. En avril, avant les 2 Rives, j'avais fait presque la même. J'ai mis les deux fichiers de ma montre côte à côte.",
    publishedAt: '2026-10-20',
    reviewedByPhysio: false,
    healthNotice: false,
    draft: false,
    blocks: [
      { type: 'h2', text: 'La séance' },
      { type: 'p', text: "Au programme : 1 h 25 d'endurance, puis 50 minutes à l'allure marathon, puis de la récup. Sur le terrain, ça donne 16 km tranquilles, 10 km à l'allure marathon et 4 km pour récupérer. 30 km en 2 h 33 min 35 s au total. L'allure visée, 4'44/km, c'est celle qui donne 3 h 20 sur 42,195 km." },
      { type: 'p', text: "Les 16 premiers kilomètres, je suis à 5'17/km de moyenne, cardio à 137 bpm. Du 17e au 26e km, 4'46/km de moyenne, pour 4'44/km visés. Le cardio monte à 153 bpm en moyenne, 157 au plus haut." },
      { type: 'image', src: '/articles/sortie-30-km-octobre-avril.svg', width: 440, height: 470, alt: "Graphique de l'allure au kilomètre sur deux sorties de 30 km. Le 14 octobre : autour de 5'15/km jusqu'au 16e km, autour de 4'45/km du 17e au 26e km, puis entre 5'08/km et 5'34/km. Le 10 avril : un peu plus rapide sur tout le parcours, avec des kilomètres à 4'30/km sur la partie rapide.", caption: "Mon allure au kilomètre sur les deux sorties. La zone colorée, ce sont les 10 km à l'allure marathon. La ligne verte, l'allure de 4'44/km qui donne 3 h 20." },
      { type: 'h2', text: 'En avril, plus vite' },
      { type: 'p', text: "Le 10 avril, trois semaines avant les 2 Rives, même schéma : 16 km à 5'11/km, puis 10 km à 4'40/km de moyenne. Mais dans ces 10 km, j'avais des kilomètres à 4'29/km et 4'32/km, et le cardio est monté jusqu'à 168 bpm. C'est à peu près l'allure à laquelle je suis parti aux 2 Rives." },
      { type: 'p', text: "Cette fois, je suis 6 secondes plus lent au kilomètre sur la partie rapide, avec 5 bpm de moins en moyenne (153 contre 158). Et le cardio n'a jamais dépassé 157 bpm." },
      { type: 'p', text: "Ça ne prouve pas que je suis en meilleure forme : la chaleur, la fatigue de la semaine ou le parcours jouent aussi. Mais c'est l'allure que je veux tenir le 8 novembre, et elle ne m'a pas mis dans le rouge." },
      { type: 'h2', text: 'La récup' },
      { type: 'p', text: "Les 4 derniers kilomètres, c'était de la récup prévue : entre 5'08/km et 5'34/km. Le cardio, lui, ne redescend pas vraiment : 152 bpm en moyenne, contre 137 bpm à la même allure en début de sortie. Les 26 premiers kilomètres se voient là." },
      { type: 'h2', text: 'La cadence suit' },
      { type: 'p', text: "Je n'avais jamais regardé ma cadence. Elle tourne autour de 169 pas par minute sur la partie tranquille, monte à 179 sur la partie rapide, et retombe vers 173 sur la fin." },
      { type: 'p', text: "En passant de 5'17/km à 4'46/km, je vais 11 % plus vite. La cadence, elle, augmente de 6 %. Le reste vient de foulées un peu plus longues. Pour accélérer, je fais donc à peu près moitié pas plus fréquents, moitié pas plus grands." },
      { type: 'h2', text: 'Pour le 8 novembre' },
      { type: 'p', text: "Partir à 4'45/km, pas plus vite. Aux 2 Rives, mon départ à 4'34/km, je l'ai payé à partir du 23e km." },
      { type: 'p', text: "Je ne me suis pas fixé de règle sur le cardio. Mais je sais maintenant qu'à 4'45/km, après 16 km, il tourne autour de 153 bpm." },
      { type: 'p', text: "Reste la question des 12 derniers kilomètres, que je n'ai pas courus à l'entraînement. Réponse à Bordeaux. Et pour savoir pourquoi le 30e kilomètre me fait peur, c'est dans [mon article sur les crampes](/articles/crampes-30e-kilometre-marathon/)." },
      { type: 'try', items: ['Les [séances Marathon](/marathon/) de Coriace, à caler loin de la sortie longue.'] },
    ],
    sources: [],
  },
  {
    slug: 'crampes-sel-magnesium-cornichon',
    title: 'Crampes : le sel, le magnésium et le jus de cornichon',
    description: "Sel, magnésium, jus de cornichon : ce que les études disent des remèdes contre les crampes, et ce qui marche quand ça bloque en course.",
    kind: 'Ce que dit la science',
    lead: "Contre les crampes, chacun a son remède : du magnésium, des pastilles de sel, et même du jus de cornichon. J'ai regardé ce que disent les études, remède par remède.",
    publishedAt: '2026-10-27',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: false,
    coverExerciseId: 'calves_standing_slow',
    blocks: [
      { type: 'h2', text: 'Le sel' },
      { type: 'p', text: "C'est l'idée la plus répandue : on transpire, on perd du sel, le muscle crampe. Pourtant, quand des chercheurs ont suivi 210 triathlètes sur un Ironman, ceux qui ont crampé n'avaient pas moins de sodium dans le sang que les autres. Ils n'étaient pas plus déshydratés non plus (Schwellnus, 2011)." },
      { type: 'p', text: "Il y a peut-être une exception : les très grosses pertes de sueur, par forte chaleur. Dans une petite étude sur dix joueurs de football américain, ceux qui crampaient pendant les stages d'été perdaient deux fois plus de sel dans leur sueur que les autres (Stofan, 2005). Pour un marathon en novembre, on est loin de ces conditions." },
      { type: 'p', text: "Boire et manger salé pendant un marathon reste utile, pour d'autres raisons. Mais contre les crampes, le sel n'a jamais fait ses preuves." },
      { type: 'h2', text: 'Le magnésium' },
      { type: 'p', text: "Le magnésium a été beaucoup testé, mais surtout contre les crampes nocturnes des personnes âgées. La synthèse Cochrane, qui reprend les essais contre placebo, conclut qu'il ne les réduit probablement pas de façon utile (Garrison, 2020)." },
      { type: 'p', text: "Contre les crampes à l'effort, il n'existe pas d'essai sérieux. Un manque de magnésium, c'est à un médecin d'en juger, avec une prise de sang. Sinon, en prendre avant un marathon n'a rien de prouvé." },
      { type: 'h2', text: 'Le jus de cornichon' },
      { type: 'p', text: "C'est le plus surprenant. En 2010, des chercheurs ont provoqué des crampes au pied chez dix volontaires, par stimulation électrique. Après une gorgée de jus de cornichon, la crampe durait environ 1 min 25. Après la même quantité d'eau, environ 2 min 15 (Miller, 2010)." },
      { type: 'p', text: "Le plus intéressant, c'est que le sodium dans le sang n'avait pas bougé : le jus n'avait pas eu le temps d'être absorbé. Les chercheurs pensent à un réflexe parti de la bouche et de la gorge, qui calmerait les nerfs du muscle. Ça va dans le sens d'une crampe d'origine nerveuse, pas d'un manque de sel." },
      { type: 'p', text: "Ce sont quand même des crampes provoquées en laboratoire, sur des gens au repos. Personne n'a montré que le jus de cornichon empêche les crampes en course." },
      { type: 'h2', text: 'Quand ça bloque' },
      { type: 'p', text: "Étirer le muscle qui crampe : c'est le traitement le mieux appuyé par les études (Miller, 2022). C'est aussi ce que je fais en course. Je m'arrête, j'étire, je marche, et je repars dès que je peux." },
      { type: 'h2', text: 'Alors, contre les crampes ?' },
      { type: 'p', text: "Ni le sel, ni le magnésium, ni le jus de cornichon n'ont fait leurs preuves en course. La piste qui tient le mieux, c'est la fatigue du muscle (Miller, 2022). Sur l'Ironman, ceux qui ont crampé avaient couru plus vite que les autres, et avaient déjà eu des crampes sur des courses précédentes (Schwellnus, 2011)." },
      { type: 'p', text: "Pour les éviter, il reste donc deux pistes : partir à une allure que tu tiendras jusqu'au bout, et arriver au kilomètre où ça lâche d'habitude avec des muscles moins fatigués. Pour ça, je mise sur le renfo des mollets, comme je l'explique dans [mon article sur les crampes au 30e km](/articles/crampes-30e-kilometre-marathon/). C'est un pari, pas une certitude. Réponse au marathon de Bordeaux, le 8 novembre." },
      { type: 'try', items: ["La séance « Mollets express » et les autres [séances ciblées](/seances-ciblees/), pour des mollets qui encaissent mieux."] },
    ],
    sources: [
      'Schwellnus MP et al. Increased running speed and previous cramps rather than dehydration or serum sodium changes predict exercise-associated muscle cramping: a prospective cohort study in 210 Ironman triathletes. British Journal of Sports Medicine, 2011.',
      'Stofan JR et al. Sweat and sodium losses in NCAA football players: a precursor to heat cramps? International Journal of Sport Nutrition and Exercise Metabolism, 2005.',
      'Garrison SR et al. Magnesium for skeletal muscle cramps. Cochrane Database of Systematic Reviews, 2020.',
      'Miller KC et al. Reflex inhibition of electrically induced muscle cramps in hypohydrated humans. Medicine & Science in Sports & Exercise, 2010.',
      'Miller KC et al. An evidence-based review of the pathophysiology, treatment, and prevention of exercise-associated muscle cramps. Journal of Athletic Training, 2022.',
    ],
  },
  {
    slug: 'renfo-affutage-marathon',
    title: 'Renfo et affûtage : mes 10 derniers jours',
    description: "Comment je garde du renfo dans les dix derniers jours avant le marathon de Bordeaux, sans arriver les jambes lourdes.",
    kind: 'Guide',
    lead: "Avant un marathon, on réduit l'entraînement pour arriver frais le jour J. Mais que faire du renfo ? Ce que je fais pour Bordeaux.",
    publishedAt: '2026-11-03',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: false,
    coverExerciseId: 'calves_standing_slow',
    blocks: [
      { type: 'h2', text: 'Moins, mais pas rien' },
      { type: 'p', text: "Une synthèse de 27 études sur l'affûtage donne une recette assez claire : réduire progressivement le volume d'entraînement de 40 à 60 %, garder l'intensité et le nombre de séances, pendant environ deux semaines (Bosquet, 2007)." },
      { type: 'p', text: "Pour le renfo, je fais pareil. Je garde ma séance de la semaine, mais je la raccourcis : 20 minutes au lieu de 30, sur les quatre zones que je travaille pour Bordeaux, mollets, adducteurs, fessiers et gainage. Et je garde mon rythme habituel, le rythme équilibré : 30 secondes d'effort, 30 de récup. Il y a moins de travail, mais chaque exercice reste aussi intense. Le rythme intense, 40 secondes d'effort et 20 de récup, que je prends les jours où je suis en forme, attendra après la course." },
      { type: 'h2', text: 'Ma dernière séance' },
      { type: 'p', text: "Ma dernière séance, c'est le mercredi 4 novembre, quatre jours avant la course. Ensuite, plus de renfo jusqu'au marathon." },
      { type: 'p', text: "Cette séance doit entretenir, pas fatiguer : rien de traumatique pour les muscles, rien qu'ils n'aient pas l'habitude de faire. Les courbatures arrivent surtout avec un exercice nouveau, ou une séance plus intense ou plus longue que d'habitude. Et elles ne font pas que gêner : elles réduisent l'amorti et la force du muscle (Cheung, 2003). Exactement ce dont j'aurai besoin au 30e kilomètre." },
      { type: 'h2', text: "Ce que j'évite" },
      {
        type: 'list',
        items: [
          "**Rien de nouveau.** Pas d'exercice que je n'ai jamais fait, pas de séance plus longue que d'habitude.",
          '**Pas de poids.** La séance se fait sans matériel.',
          '**Pas de gros sauts.** Je garde les petits sautillements, je laisse de côté les squats sautés.',
          '**Plus rien après mercredi.** C\'est ma règle habituelle, jamais de renfo la veille de la sortie longue, en plus large.',
        ],
      },
      { type: 'try', items: ['La séance Marathon · Courte (20 minutes, sans matériel), dans les [séances Marathon](/marathon/).'] },
    ],
    sources: [
      'Bosquet L, Montpetit J, Arvisais D, Mujika I. Effects of tapering on performance: a meta-analysis. Medicine & Science in Sports & Exercise, 2007.',
      'Cheung K, Hume P, Maxwell L. Delayed onset muscle soreness: treatment strategies and performance factors. Sports Medicine, 2003.',
    ],
  },
  {
    slug: 'marathon-bordeaux-2026',
    title: 'Mon marathon de Bordeaux',
    description: "Le récit de mon marathon de Bordeaux, le 8 novembre 2026, et l'analyse de ma montre : allure, cardio, et ce qui s'est passé au 30e km.",
    kind: 'Journal',
    lead: "[À compléter après la course.]",
    publishedAt: '2026-11-11',
    reviewedByPhysio: false,
    healthNotice: false,
    draft: true,
    blocks: [
      { type: 'h2', text: 'Le jour J' },
      { type: 'p', text: "[À compléter : le départ, l'allure prévue, les sensations.]" },
      { type: 'h2', text: 'Ce que montre ma montre' },
      { type: 'p', text: "[À compléter avec le fichier FIT : allure au km, cardio, cadence, temps de marche. Graphique comparé aux 2 Rives.]" },
      { type: 'h2', text: 'Le 30e km' },
      { type: 'p', text: "[À compléter : crampes ou pas, et ce que tu en penses.]" },
      { type: 'h2', text: 'Ce que je retiens' },
      { type: 'p', text: "[À compléter.]" },
    ],
    sources: [],
  },
  {
    slug: 'etirements-avant-course',
    title: "S'étirer avant de courir, ça sert à quoi ?",
    description: "Les étirements avant la course protègent-ils des blessures ? Ce que montrent les études, et un échauffement plus utile en 10 minutes.",
    kind: 'Ce que dit la science',
    lead: "S'étirer avant de courir, beaucoup l'ont appris au club ou en cours de sport. Les études disent autre chose : ça ne protège pas des blessures, et tenu trop longtemps, ça peut même faire perdre un peu de force.",
    publishedAt: '2026-11-17',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: false,
    coverExerciseId: 'high_knees',
    blocks: [
      { type: 'h2', text: 'Pas moins de blessures' },
      { type: 'p', text: "L'étude la plus citée a suivi 1 538 recrues de l'armée australienne pendant douze semaines d'entraînement. Une moitié s'étirait avant chaque séance, l'autre non. À la fin, il y avait à peu près autant de blessures aux jambes dans les deux groupes (Pope, 2000)." },
      { type: 'p', text: "Une grande synthèse de 2014, qui regroupe des essais sur plus de 26 000 sportifs, arrive à la même conclusion pour les étirements. Le renforcement musculaire, lui, divise le risque de blessure par trois environ (Lauersen, 2014)." },
      { type: 'h2', text: 'Et sur la performance ?' },
      { type: 'p', text: "Un étirement tenu moins de 30 secondes ne change presque rien. Au-delà d'une minute sur le même muscle, il fait perdre un peu de force et d'explosivité (Kay et Blazevich, 2012). Juste avant un fractionné ou une course, c'est l'inverse de ce qu'on cherche." },
      { type: 'p', text: "Être souple n'est pas forcément un atout pour courir. Chez des coureurs de fond de niveau international, les moins souples étaient même les plus économes, c'est-à-dire ceux qui dépensaient le moins d'énergie à une allure donnée (Jones, 2002). C'est une corrélation, pas une preuve, mais ça relativise." },
      { type: 'h2', text: 'Après la sortie' },
      { type: 'p', text: "Pendant longtemps, je m'étirais après chaque séance de course. Je ne voyais pas la différence, alors j'ai arrêté. Et j'ai bien fait : c'est aussi ce que montrent les études." },
      { type: 'p', text: "S'étirer après avoir couru ne fait pas disparaître les courbatures. La synthèse Cochrane chiffre l'effet à environ un point sur une échelle de douleur de 100 : rien que tu sentiras (Herbert, 2011). Si ça te fait du bien, rien ne t'empêche de le faire. Ce n'est simplement pas une obligation." },
      { type: 'h2', text: 'À la place, un échauffement' },
      { type: 'p', text: "Ce qui prépare à courir, c'est de bouger : quelques minutes de footing tranquille, des gammes comme les montées de genoux ou les talons-fesses, puis deux ou trois accélérations progressives. Le corps se réchauffe et les appuis se réveillent." },
      { type: 'p', text: "Dans Coriace, la séance « Activation avant sortie » réveille les fessiers et les appuis en 10 minutes, sans fatiguer les jambes. À faire avant le footing d'échauffement." },
      { type: 'p', text: "Le seul moment où j'étire en course, c'est quand une crampe bloque le mollet. Là, c'est le bon réflexe (Miller, 2022)." },
      { type: 'try', items: ['La séance « Activation avant sortie », dans les [séances ciblées](/seances-ciblees/).'] },
    ],
    sources: [
      'Pope RP, Herbert RD, Kirwan JD, Graham BJ. A randomized trial of preexercise stretching for prevention of lower-limb injury. Medicine & Science in Sports & Exercise, 2000.',
      'Lauersen JB, Bertelsen DM, Andersen LB. The effectiveness of exercise interventions to prevent sports injuries: a systematic review and meta-analysis of randomised controlled trials. British Journal of Sports Medicine, 2014.',
      'Kay AD, Blazevich AJ. Effect of acute static stretch on maximal muscle performance: a systematic review. Medicine & Science in Sports & Exercise, 2012.',
      'Jones AM. Running economy is negatively related to sit-and-reach test performance in international-standard distance runners. International Journal of Sports Medicine, 2002.',
      'Herbert RD, de Noronha M, Kamper SJ. Stretching to prevent or reduce muscle soreness after exercise. Cochrane Database of Systematic Reviews, 2011.',
      'Miller KC et al. An evidence-based review of the pathophysiology, treatment, and prevention of exercise-associated muscle cramps. Journal of Athletic Training, 2022.',
    ],
  },
  {
    slug: 'renfo-apres-marathon',
    title: 'Après le marathon, quand reprendre le renfo ?',
    description: "Combien de temps attendre après un marathon avant de reprendre le renfo, et par quelle séance recommencer.",
    kind: 'Guide',
    lead: "[À compléter : ta reprise après Bordeaux.]",
    publishedAt: '2026-11-24',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: true,
    coverExerciseId: 'single_leg_bridge',
    blocks: [
      { type: 'h2', text: 'Ce que le marathon laisse dans les jambes' },
      { type: 'p', text: "[À compléter : ce que disent les études sur la récupération après un marathon. Je chercherai les sources.]" },
      { type: 'h2', text: 'Ma reprise' },
      { type: 'p', text: "[À compléter : quand tu as recouru, quand tu as refait du renfo, quelle séance, et comment ça s'est passé.]" },
      { type: 'h2', text: 'Par où recommencer' },
      { type: 'p', text: "[À compléter : par exemple une séance courte de 20 minutes, au rythme doux.]" },
      { type: 'try', items: ['Les séances courtes de 20 minutes, dans les [séances Marathon](/marathon/).'] },
    ],
    sources: [],
  },
  {
    slug: 'cadence-180-pas-minute',
    title: 'La cadence à 180 pas par minute, une règle ?',
    description: "D'où vient le chiffre de 180 pas par minute, ce qu'en disent les études, et ce que montre ma montre, du semi au marathon.",
    kind: 'Ce que dit la science',
    lead: "180 pas par minute : on le lit partout comme la cadence idéale. Le chiffre vient d'une observation faite en 1984, sur des athlètes olympiques en pleine course. Ma montre, elle, n'est presque jamais à 180.",
    publishedAt: '2026-12-08',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: false,
    coverExerciseId: 'rope_running_step',
    blocks: [
      { type: 'h2', text: "D'où vient le 180" },
      { type: 'p', text: "L'entraîneur américain Jack Daniels a compté les pas des coureurs aux Jeux olympiques de Los Angeles, en 1984. Presque tous dépassaient 180 pas par minute. Mais c'étaient des athlètes d'élite, en course, donc très rapides. Le chiffre est ensuite devenu une règle pour tout le monde, à toutes les allures." },
      { type: 'h2', text: 'Ce que montre ma montre' },
      { type: 'p', text: "J'ai regardé ma cadence sur mes dernières courses et sorties :" },
      {
        type: 'list',
        items: [
          "Semi-marathon de 2025, à 4'03/km de moyenne : 181 pas par minute.",
          "Début du marathon des 2 Rives, à 4'35/km : 172.",
          "Sortie test du 14 octobre, 10 km à 4'46/km : 179.",
          "Même sortie, partie tranquille à 5'17/km : 169.",
        ],
      },
      { type: 'p', text: "Sur une même sortie, la cadence suit l'allure : plus je vais vite, plus mes pas sont rapides. D'un jour à l'autre, en revanche, elle varie. J'étais plus haut le 14 octobre à 4'46/km qu'aux 2 Rives à 4'35/km. Je ne dépasse 180 qu'en semi, à près de 15 km/h." },
      { type: 'h2', text: 'Ce que disent les études' },
      { type: 'p', text: "Augmenter un peu sa cadence, à vitesse égale, change quand même quelque chose. Dans une étude sur 45 coureurs, 5 % de pas en plus suffisaient à réduire l'énergie absorbée par le genou à chaque appui. Avec 10 %, la hanche en profitait aussi (Heiderscheit, 2011). Des pas plus courts et plus fréquents, c'est moins de choc à chaque appui." },
      { type: 'p', text: "C'est pour ça que des kinés proposent d'augmenter un peu la cadence à des coureurs qui ont mal aux genoux. Mais on parle de quelques pour cent à partir de ta propre cadence, pas d'un chiffre à atteindre." },
      { type: 'h2', text: 'Si tu veux la changer' },
      { type: 'p', text: "Rien ne t'y oblige si tu cours sans douleur. Si tu veux essayer, monte de 5 % au plus, par exemple de 168 à 176, sur une partie de tes sorties tranquilles. Un métronome sur le téléphone aide à tenir le rythme. Et laisse à tes mollets le temps de s'habituer : plus de pas, c'est plus d'appuis." },
      { type: 'exercises', ids: ['rope_running_step', 'pogo_jumps'], caption: 'Corde à sauter en pas de course, et sauts sur place pieds joints : des appuis courts et rapides.' },
      { type: 'try', items: ["Les fiches [Corde à sauter, pas de course](/exercices/corde-a-sauter-pas-de-course/) et [Sauts sur place pieds joints](/exercices/sauts-sur-place-pieds-joints/)."] },
    ],
    sources: [
      'Heiderscheit BC, Chumanov ES, Michalski MP, Wille CM, Ryan MB. Effects of step rate manipulation on joint mechanics during running. Medicine & Science in Sports & Exercise, 2011.',
      "Daniels J. Daniels' Running Formula. Human Kinetics.",
    ],
  },
  {
    slug: 'adducteurs-coureur',
    title: 'Les adducteurs, les oubliés du renfo des coureurs',
    description: "À quoi servent les adducteurs quand on court, ce que montrent les études sur la Copenhagen plank, et comment l'ajouter à ton renfo.",
    kind: 'Guide',
    lead: "Aux 2 Rives, mes mollets ont crampé, mais mes adducteurs aussi. Ce sont les muscles qu'on oublie le plus souvent dans le renfo des coureurs, alors qu'ils travaillent à chaque foulée.",
    publishedAt: '2026-12-15',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: false,
    coverExerciseId: 'copenhagen_plank',
    blocks: [
      { type: 'h2', text: 'À quoi ils servent' },
      { type: 'p', text: "Les adducteurs, ce sont les muscles de l'intérieur de la cuisse. En course, ils ne font pas avancer : ils tiennent. À chaque appui, avec les fessiers, ils gardent le bassin et le genou dans l'axe. Sur un marathon, ça fait des dizaines de milliers d'appuis. Aux 2 Rives, ma montre en a compté environ 37 000." },
      { type: 'h2', text: 'La Copenhagen plank' },
      { type: 'p', text: "C'est l'exercice le plus étudié pour les adducteurs. Allongé sur le côté, le pied du dessus posé sur une chaise, tu soulèves le bassin et tu tiens. Tout le travail se fait à l'intérieur de la cuisse posée sur la chaise." },
      { type: 'exercises', ids: ['copenhagen_plank'], caption: 'La Copenhagen plank. Avec le genou sur la chaise au lieu du pied, elle devient plus facile.' },
      { type: 'p', text: "De jeunes footballeurs qui l'ont pratiquée pendant huit semaines ont gagné environ un tiers de force dans les adducteurs (Ishøi, 2016). En Norvège, un programme construit autour de cet exercice, suivi par des équipes entières pendant une saison, a réduit de 41 % le risque de problèmes à l'aine (Harøy, 2019)." },
      { type: 'p', text: "Ce sont des footballeurs, qui sollicitent beaucoup plus leurs adducteurs que nous, avec les changements de direction et les frappes. Je n'ai pas trouvé d'étude équivalente chez les coureurs. Mais chez moi, ce sont eux qui crampent en fin de marathon, alors je les travaille." },
      { type: 'h2', text: 'Par où commencer' },
      { type: 'p', text: "La Copenhagen plank se fait avec le pied sur la chaise. Les premières fois, tu peux poser le genou à la place : le bras de levier est plus court, et l'exercice est bien plus facile. Quand tu tiens tout le temps d'effort sans que le bassin descende, passe au pied." },
      { type: 'p', text: "Deux autres exercices complètent bien : le squat sumo et les fentes latérales. Ils font travailler les adducteurs debout et en mouvement." },
      { type: 'exercises', ids: ['squat_sumo', 'lateral_lunges'], caption: 'Squat sumo et fentes latérales.' },
      { type: 'p', text: "Dans Coriace, la séance ciblée « Adducteurs » réunit les trois, avec l'abduction couché sur le côté entre deux : pendant que l'intérieur des cuisses récupère, l'extérieur de la hanche travaille. Elle dure 15 minutes." },
      { type: 'try', items: ['La séance « Adducteurs », dans les [séances ciblées](/seances-ciblees/).', 'La fiche de la [Copenhagen plank](/exercices/copenhagen-plank/).'] },
    ],
    sources: [
      'Ishøi L et al. Large eccentric strength increase using the Copenhagen Adduction exercise in football: a randomized controlled trial. Scandinavian Journal of Medicine & Science in Sports, 2016.',
      'Harøy J et al. The Adductor Strengthening Programme prevents groin problems among male football players: a cluster-randomised controlled trial. British Journal of Sports Medicine, 2019.',
    ],
  },
  {
    slug: 'test-mollets-coureur',
    title: 'Teste tes mollets en 2 minutes',
    description: 'Un test simple, contre un mur, pour savoir où en sont tes mollets et suivre tes progrès : le protocole, les repères chiffrés et la séance qui va avec.',
    kind: 'Auto-test',
    lead: 'Au marathon, mes mollets lâchent avant mon souffle. Un test simple, contre un mur, permet de savoir où on en est et de suivre ses progrès. Voici comment le faire, les repères pour se situer, et mon propre résultat.',
    publishedAt: '2026-12-01',
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
  {
    slug: 'exercices-renfo-chaque-semaine',
    title: 'Les exercices de renfo que je fais chaque semaine',
    description: "Mollets et adducteurs en priorité, mes exercices préférés et les plus durs : le renfo que je fais deux fois par semaine, et comment adapter chaque exercice.",
    kind: 'Guide',
    lead: "Je fais deux séances de renfo par semaine, et pas toujours les mêmes exercices : j'essaie de travailler tout le corps, avec une priorité, les mollets et les adducteurs. Voici ce que je fais, ce que je préfère, et ce qui me coûte le plus.",
    publishedAt: '2026-12-22',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: true,
    coverExerciseId: 'alternating_lunges',
    blocks: [
      { type: 'h2', text: 'Deux séances par semaine' },
      { type: 'p', text: "La première le mercredi, la seconde quand je trouve un moment dans la semaine, tôt le matin ou le soir. Une trentaine de minutes en circuit, au rythme équilibré : 30 secondes d'effort, 30 de récup. Les jours où je suis en forme, au rythme intense : 40 secondes d'effort, 20 de récup." },
      { type: 'p', text: "Je ne fais pas toujours les mêmes exercices. J'essaie de travailler un peu tout le corps, avec une priorité : les mollets et les adducteurs, ceux qui lâchent chez moi en fin de marathon. Pourquoi ces zones, je l'explique dans [mon plan pour Bordeaux](/articles/renfo-marathon-plan-bordeaux/)." },
      { type: 'h2', text: 'Priorité aux mollets' },
      { type: 'p', text: "Ils amortissent et relancent chaque appui. Je les fais de deux façons : jambes tendues, et genoux pliés pour le soléaire, le muscle profond du mollet." },
      { type: 'exercises', ids: ['calves_standing_slow', 'calf_raise_isometric_low'], caption: 'Mollets debout en descente lente, et mollets en squat profond.' },
      {
        type: 'list',
        items: [
          "**Mollets debout, descente lente.** Sur une marche, talons dans le vide : 1 seconde pour monter, 3 à 4 secondes pour descendre. C'est la descente qui compte. Trop facile ? Sur une jambe.",
          "**Mollets en squat profond.** Accroupi au plus bas, monte sur la pointe des pieds et tiens 2 secondes. Genoux très pliés, c'est le soléaire qui travaille.",
        ],
      },
      { type: 'h2', text: 'Et aux adducteurs' },
      { type: 'p', text: "À l'intérieur des cuisses, ils tiennent le bassin et le genou à chaque foulée. Chez moi, ils crampent aussi en fin de marathon." },
      { type: 'exercises', ids: ['copenhagen_plank', 'squat_sumo'], caption: 'Copenhagen plank et squat sumo.' },
      {
        type: 'list',
        items: [
          "**Copenhagen plank.** Allongé sur le côté, le pied du dessus sur une chaise, monte le bassin et tiens. L'effort se sent à l'intérieur de la cuisse posée sur la chaise. Les premières fois, pose le genou au lieu du pied.",
          "**Squat sumo.** Pieds plus écartés que les épaules, pointes vers l'extérieur. Pousse les genoux vers l'extérieur pour qu'ils restent dans l'axe des pieds.",
        ],
      },
      { type: 'h2', text: 'Mes préférés' },
      { type: 'p', text: "Les plus simples pour moi : les fentes alternées, le squat et la chaise contre un mur. Trois exercices pour les cuisses et les fessiers, sans matériel." },
      { type: 'exercises', ids: ['alternating_lunges', 'squat_classic', 'wall_sit'], caption: 'Fentes alternées, squat et chaise contre un mur.' },
      {
        type: 'list',
        items: [
          "**Fentes alternées.** Un grand pas en avant, descends jusqu'à ce que le genou arrière frôle le sol, puis reviens. Buste vertical, genou avant dans l'axe du pied.",
          "**Squat.** Pieds largeur d'épaules, descends en envoyant les fesses en arrière, comme pour t'asseoir. Le poids reste sur les talons.",
          "**Chaise contre un mur.** Dos au mur, cuisses parallèles au sol, et tiens. Tout le dos reste en contact avec le mur. Trop dur ? Remonte un peu.",
        ],
      },
      { type: 'h2', text: 'Les plus durs pour moi' },
      { type: 'p', text: "Ceux qui font travailler les bras : la planche commando et les pompes. Si toi aussi tu as du mal avec ces deux exercices, commence par leur version plus facile." },
      { type: 'exercises', ids: ['plank_commando', 'pushups'], caption: 'Planche commando et pompes.' },
      {
        type: 'list',
        items: [
          "**Planche commando.** En planche sur les avant-bras, monte sur une main puis sur l'autre pour passer bras tendus, puis redescends. Le bassin ne se balance pas. Plus facile : sur les genoux, ou pieds plus écartés.",
          "**Pompes.** Mains sous les épaules, corps gainé, descends la poitrine près du sol puis pousse. Coudes à environ 45° du corps. Plus facile : sur les genoux, ou mains posées sur une chaise.",
        ],
      },
      { type: 'p', text: "Le reste du temps, je varie : pont fessier, abduction, gainage latéral, dead bug… Chaque exercice a sa fiche dans [les exercices](/exercices/), avec le mouvement animé, les muscles sollicités, une version plus facile et une plus dure." },
      { type: 'try', items: ['Pour varier comme moi : les Complètes A, B et C des [séances Marathon](/marathon/) travaillent tout le corps, avec des exercices différents.'] },
    ],
    sources: [],
  },
  {
    slug: 'plan-marathon-ia',
    title: "J'ai fait mon plan marathon avec une IA",
    description: "Mon plan pour le marathon de Bordeaux a été construit avec une IA : ce que je lui ai demandé, ce qu'elle m'a proposé, ce que j'ai changé et ce que ça a donné.",
    kind: 'Journal',
    lead: "[À compléter : pourquoi tu as demandé ton plan à une IA.]",
    publishedAt: '2027-01-05',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: true,
    coverExerciseId: 'high_knees',
    blocks: [
      { type: 'h2', text: 'Ce que je lui ai demandé' },
      { type: 'p', text: "[À compléter : quelle IA, ta demande mot pour mot si tu l'as gardée, et les infos que tu lui as données (chronos, nombre de sorties, contraintes).]" },
      { type: 'h2', text: "Le plan qu'elle m'a donné" },
      { type: 'p', text: "Un plan de 18 semaines : six semaines de reprise en juillet et début août, puis douze semaines de préparation jusqu'au 8 novembre. Quatre sorties par semaine : fractionné le lundi, endurance le mardi, côtes le mercredi matin, sortie longue le vendredi. Tout est compté en minutes, avec une allure pour chaque séance. L'objectif : 3 h 15, soit 4'37/km." },
      { type: 'p', text: "Le volume passait de près de 3 heures de course par semaine en juillet à un peu plus de 5 heures mi-octobre, avec une semaine plus légère toutes les quatre semaines. La sortie longue montait de 50 minutes à une sortie test de 2 h 30, trois semaines avant la course." },
      { type: 'p', text: "Pour le renfo, le plan disait juste « PPG 30 minutes », le mercredi soir. Le contenu, c'était à moi de le trouver. La dernière, plus légère, tombait quatre jours avant la course." },
      { type: 'h2', text: "Ce que j'ai changé" },
      { type: 'p', text: "[À compléter : ce que tu as modifié en route et pourquoi (la sortie test faite le mercredi 14 octobre au lieu du vendredi 16 ? l'objectif passé de 3 h 15 à 3 h 20 ?).]" },
      { type: 'h2', text: 'Ce que ça a donné à Bordeaux' },
      { type: 'p', text: "[À compléter après la course.]" },
      { type: 'h2', text: 'Les limites' },
      { type: 'p', text: "Une IA ne te voit pas courir, ne sait pas si tu as mal, et ne connaît de toi que ce que tu lui dis. [À compléter : ce que tu en penses après coup.]" },
      { type: 'try', items: ['Les [séances Marathon](/marathon/) de Coriace, pour remplir la case « renfo » de ton plan.'] },
    ],
    sources: [],
  },
  {
    slug: 'regle-10-pourcent-course',
    title: 'La règle des 10 % par semaine, vraie ou fausse ?',
    description: "Ne pas augmenter son kilométrage de plus de 10 % par semaine : ce que montrent les études sur cette règle, et comment mon plan pour Bordeaux faisait monter le volume.",
    kind: 'Ce que dit la science',
    lead: "Ne jamais augmenter son kilométrage de plus de 10 % d'une semaine à l'autre : c'est la règle la plus répétée pour éviter les blessures. Deux études l'ont mise à l'épreuve, et le résultat est plus nuancé qu'on ne le croit.",
    publishedAt: '2027-01-12',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: true,
    coverExerciseId: 'reverse_lunges',
    blocks: [
      { type: 'h2', text: 'Une règle mise à l\'épreuve' },
      { type: 'p', text: "Aux Pays-Bas, 532 débutants se préparaient à une course de 6,7 km. La moitié a suivi un plan classique de 8 semaines. L'autre moitié, un plan de 13 semaines, plus progressif, construit sur la règle des 10 %. À l'arrivée, il y avait autant de blessés dans les deux groupes : environ un sur cinq (Buist, 2008)." },
      { type: 'h2', text: 'Mais pas n\'importe comment' },
      { type: 'p', text: "Au Danemark, des chercheurs ont donné une montre GPS à 874 débutants et les ont suivis pendant un an. Dans l'ensemble, ceux qui augmentaient leur distance de plus de 10 % par semaine ne se blessaient pas plus que les autres." },
      { type: 'p', text: "Mais au-delà de 30 % d'augmentation sur deux semaines, certaines blessures liées à la distance devenaient plus fréquentes : douleur à l'avant du genou, syndrome de l'essuie-glace, périostite (Nielsen, 2014). Les auteurs restent prudents : l'écart n'est pas assez net pour en faire une preuve. Leur conseil aux débutants : rester sous 30 % par semaine." },
      { type: 'h2', text: 'Mon plan pour Bordeaux' },
      { type: 'p', text: "Mon plan comptait en minutes de course. Converti en kilomètres, avec l'endurance autour de 5'10/km, il passait d'une trentaine de kilomètres par semaine en juillet à un peu plus de 60 mi-octobre, au plus haut." },
      { type: 'p', text: "D'une semaine normale à la suivante, il augmentait de 6 à 10 %, sans dépasser la barre. Et toutes les quatre semaines, une semaine plus légère, d'un quart à un tiers en moins, avant de repartir à peu près où j'en étais. Mon plan suivait donc presque la règle à la lettre." },
      { type: 'h2', text: "Ce que j'en retiens" },
      { type: 'p', text: "Le chiffre de 10 % n'a rien de magique. Ce qui semble compter, c'est d'éviter les gros sauts d'un coup, surtout quand on débute." },
      { type: 'h2', text: 'Et le renfo ?' },
      { type: 'p', text: "Le renfo ne remplace pas une progression raisonnable, mais il aide les jambes à encaisser. Une synthèse d'essais, tous sports confondus, montre qu'il divise le risque de blessure par trois environ (Lauersen, 2014)." },
      { type: 'try', items: ['Les [séances Marathon](/marathon/) de Coriace : 20, 30 ou 45 minutes.'] },
    ],
    sources: [
      'Buist I, Bredeweg SW, van Mechelen W, Lemmink KA, Pepping GJ, Diercks RL. No effect of a graded training program on the number of running-related injuries in novice runners: a randomized controlled trial. The American Journal of Sports Medicine, 2008.',
      'Nielsen RØ, Parner ET, Nohr EA, Sørensen H, Lind M, Rasmussen S. Excessive progression in weekly running distance and risk of running-related injuries: an association which varies according to type of injury. Journal of Orthopaedic & Sports Physical Therapy, 2014.',
      'Lauersen JB, Bertelsen DM, Andersen LB. The effectiveness of exercise interventions to prevent sports injuries: a systematic review and meta-analysis of randomised controlled trials. British Journal of Sports Medicine, 2014.',
    ],
  },
  {
    slug: 'renfo-et-course-meme-jour',
    title: 'Renfo et course le même jour : dans quel ordre ?',
    description: "Faire son renfo avant ou après la sortie, le même jour ou pas : ce que montrent les études, et comment je cale mes séances dans la semaine.",
    kind: 'Ce que dit la science',
    lead: "Entre les sorties et le renfo, la semaine se remplit vite, et on finit souvent par tout faire le même jour. Dans quel ordre, et avec combien de temps entre les deux ? Les études donnent des repères.",
    publishedAt: '2027-01-19',
    reviewedByPhysio: false,
    healthNotice: false,
    draft: true,
    coverExerciseId: 'side_plank',
    blocks: [
      { type: 'h2', text: "Le renfo d'abord, pour la force" },
      { type: 'p', text: "Une synthèse de dix études a comparé les deux ordres dans une même séance, sur plusieurs semaines. Faire le renfo avant l'endurance donnait un peu plus de force dans les jambes, environ 7 %. Pour le reste, la masse musculaire, la capacité aérobie et la masse grasse, l'ordre ne changeait rien (Eddens, 2018)." },
      { type: 'p', text: "Ces études portent sur des adultes en bonne santé, pas sur des coureurs qui préparent une course." },
      { type: 'h2', text: "La sortie d'abord, pour la qualité" },
      { type: 'p', text: "Pour un coureur, la priorité, c'est souvent la sortie elle-même. Un fractionné ou une sortie longue avec les jambes déjà fatiguées par le renfo, c'est une séance moins bonne. Là, ce n'est pas une étude, c'est du bon sens : quand la course compte le plus, elle passe en premier." },
      { type: 'h2', text: 'Laisser du temps entre les deux' },
      { type: 'p', text: "L'écart compte plus que l'ordre. Une étude a suivi 58 joueurs de rugby amateurs pendant sept semaines, avec deux séances de renfo et deux d'endurance par semaine. Ceux qui enchaînaient les deux sans pause gagnaient moins de force que ceux qui laissaient 6 ou 24 heures entre les deux. La consigne des auteurs : au moins 6 heures d'écart (Robineau, 2016)." },
      { type: 'h2', text: 'Comment je fais' },
      { type: 'p', text: "Ma semaine pour Bordeaux : fractionné le lundi, endurance le mardi, côtes le mercredi matin, sortie longue le vendredi. Le renfo, c'est le mercredi, et une deuxième séance quand je trouve un moment, tôt le matin ou le soir. Une seule règle : jamais la veille de la sortie longue." },
      { type: 'p', text: "Quand je fais les deux le même jour, je laisse une demi-journée entre les deux, sans ordre particulier : par exemple l'un à 8 h, l'autre à l'heure du déjeuner. D'après cette étude, c'est un peu court. Le mercredi, mon plan mettait les côtes à 8 h et le renfo à 20 h : là, c'est large." },
      { type: 'h2', text: 'Avant de courir, juste un réveil' },
      { type: 'p', text: "Il y a un cas où un peu de renfo avant la sortie a du sens : réveiller les appuis, vite et sans se fatiguer. C'est le but de la séance « Activation avant sortie » : 10 minutes de pont fessier, d'abduction, de petits sauts et de montées de genoux." },
      { type: 'try', items: ['Les séances « Activation avant sortie » et « Mollets express », dans les [séances ciblées](/seances-ciblees/).'] },
    ],
    sources: [
      'Eddens L, van Someren K, Howatson G. The role of intra-session exercise sequence in the interference effect: a systematic review with meta-analysis. Sports Medicine, 2018.',
      'Robineau J, Babault N, Piscione J, Lacome M, Bigard AX. Specific training effects of concurrent aerobic and strength exercises depend on recovery duration. Journal of Strength and Conditioning Research, 2016.',
    ],
  },
  {
    slug: 'soleaire-mollet-coureur',
    title: 'Le soléaire, le muscle caché du mollet',
    description: "Le soléaire porte le coureur à chaque appui. Où il se trouve, ce qu'il fait en course, et les exercices pour le renforcer.",
    kind: 'Guide',
    lead: "Quand on dit mollet, on pense au muscle bombé qu'on voit sous la peau. Mais en course, il y en a un autre qui travaille énormément : le soléaire, caché dessous.",
    publishedAt: '2027-02-02',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: true,
    coverExerciseId: 'calf_raise_isometric_low',
    blocks: [
      { type: 'h2', text: 'Deux muscles, un tendon' },
      { type: 'p', text: "Le mollet, c'est deux muscles. Les gastrocnémiens, qu'on appelle les jumeaux, sont en surface : ce sont eux qui donnent sa forme au mollet. Le soléaire est dessous, plus plat et plus large. Les deux se rejoignent dans le tendon d'Achille." },
      { type: 'p', text: "Les jumeaux passent derrière le genou, le soléaire non. C'est pour ça qu'on les travaille différemment : jambe tendue, les jumeaux participent beaucoup ; genou plié, ils se relâchent et le soléaire prend une plus grande part du travail." },
      { type: 'h2', text: "Ce qu'il fait en course" },
      { type: 'p', text: "Des chercheurs ont reconstitué sur ordinateur, muscle par muscle, la façon dont on court. Dans la deuxième moitié de l'appui, ce sont le soléaire et les jumeaux qui font le plus pour soutenir le corps et le pousser vers l'avant (Hamner, 2010). Une autre étude, de la course lente au sprint, trouve la même chose jusqu'à environ 25 km/h (Dorn, 2012)." },
      { type: 'p', text: "Autrement dit, à l'allure d'un marathon, les mollets portent le coureur à chaque pas. Au marathon, ce sont les miens qui lâchent les premiers, avant le souffle." },
      { type: 'h2', text: 'Genou plié, mais sans miracle' },
      { type: 'p', text: "On conseille souvent de travailler le soléaire genou plié. Une étude a mesuré l'activité des muscles du mollet pendant des montées sur la pointe du pied, jambe tendue puis genou plié à 45°. Genou plié, le soléaire travaillait un peu plus et les jumeaux un peu moins, mais de 4 à 5 % seulement (Hébert-Losier, 2012)." },
      { type: 'p', text: "Les auteurs le disent eux-mêmes : la différence est peut-être trop petite pour changer grand-chose. Et moi, je ne sens pas de différence entre les deux. Je garde quand même les deux positions dans mon renfo : ça ne coûte rien, et ça varie le travail." },
      { type: 'h2', text: 'Les exercices' },
      { type: 'exercises', ids: ['calves_standing_slow', 'calf_raise_isometric_low'], caption: 'Mollets debout en descente lente, et mollets en squat profond, genoux très pliés.' },
      {
        type: 'list',
        items: [
          "**Mollets debout, descente lente** : sur une marche, talons dans le vide, 1 seconde pour monter, 3 à 4 pour descendre. Les jumeaux et le soléaire.",
          "**Mollets en squat profond** : accroupi au plus bas, monte sur la pointe des pieds et tiens 2 secondes. Surtout le soléaire.",
          "**Mollets assis** : assis sur une chaise, un poids posé sur les cuisses près des genoux, monte sur la pointe des pieds. Le soléaire, avec une charge.",
        ],
      },
      { type: 'try', items: ["Les séances « Mollets express » et « Tendon d'Achille », dans les [séances ciblées](/seances-ciblees/)."] },
    ],
    sources: [
      'Hamner SR, Seth A, Delp SL. Muscle contributions to propulsion and support during running. Journal of Biomechanics, 2010.',
      'Dorn TW, Schache AG, Pandy MG. Muscular strategy shift in human running: dependence of running speed on hip and ankle muscle performance. Journal of Experimental Biology, 2012.',
      'Hébert-Losier K, Schneiders AG, García JA, Sullivan SJ, Simoneau GG. Influence of knee flexion angle and age on triceps surae muscle activity during heel raises. Journal of Strength and Conditioning Research, 2012.',
    ],
  },
  {
    slug: 'renfo-grossir-jambes-coureur',
    title: 'Le renfo fait-il grossir les jambes ?',
    description: "Beaucoup de coureurs évitent le renfo de peur de prendre du muscle et du poids. Ce que montrent les études sur les coureurs qui en font.",
    kind: 'Ce que dit la science',
    lead: "« Je ne fais pas de renfo, je ne veux pas prendre des cuisses. » On l'entend souvent chez les coureurs. Les études disent que le risque est faible, et il y a une raison à ça : la course elle-même.",
    publishedAt: '2027-02-09',
    reviewedByPhysio: false,
    healthNotice: false,
    draft: true,
    coverExerciseId: 'tempo_squat',
    blocks: [
      { type: 'h2', text: 'Pas de kilos en trop chez les coureurs' },
      { type: 'p', text: "Une revue de 24 études a regardé ce que le renfo change chez des coureurs de demi-fond et de fond. L'économie de course, l'énergie dépensée à une allure donnée, s'améliore souvent, de 2 à 8 %. La composition du corps, elle, ne bouge pas dans le mauvais sens (Blagrove, 2018)." },
      { type: 'h2', text: 'La course freine la prise de muscle' },
      { type: 'p', text: "Une synthèse de 21 études a comparé le renfo seul et le renfo combiné à de l'endurance. Quand on ajoute de la course, on gagne moins de muscle qu'avec le renfo seul. Le vélo, lui, ne fait pas cet effet. Et plus les séances d'endurance sont fréquentes et longues, plus le frein est fort (Wilson, 2012)." },
      { type: 'p', text: "Pour quelqu'un qui veut prendre du muscle, c'est un problème. Pour un coureur qui a peur d'en prendre trop, c'est plutôt rassurant." },
      { type: 'h2', text: 'Et le renfo de Coriace' },
      { type: 'p', text: "Ce n'est pas un programme de musculation : 20 à 45 minutes, au poids du corps ou avec un poids de 8 kg au plus, à côté de la course." },
      { type: 'p', text: "Personnellement, ça ne m'a jamais inquiété. Et depuis que je fais du renfo chaque semaine, je n'ai pas vu de différence sur la balance." },
      { type: 'try', items: ['Les séances courtes de 20 minutes, sans matériel, dans les [séances Marathon](/marathon/).'] },
    ],
    sources: [
      'Blagrove RC, Howatson G, Hayes PR. Effects of strength training on the physiological determinants of middle- and long-distance running performance: a systematic review. Sports Medicine, 2018.',
      'Wilson JM, Marin PJ, Rhea MR, Wilson SM, Loenneke JP, Anderson JC. Concurrent training: a meta-analysis examining interference of aerobic and resistance exercises. Journal of Strength and Conditioning Research, 2012.',
    ],
  },
  {
    slug: 'renforcer-pieds-coureur',
    title: 'Renforcer ses pieds pour moins se blesser',
    description: "Un essai sur 118 coureurs : huit semaines d'exercices pour les pieds et les chevilles, et nettement moins de blessures sur un an.",
    kind: 'Ce que dit la science',
    lead: "On renforce les cuisses, les fessiers, les mollets. Les pieds, presque jamais. Pourtant, un essai mené chez des coureurs montre qu'en les travaillant, on se blesse nettement moins.",
    publishedAt: '2027-02-16',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: true,
    coverExerciseId: 'single_leg_balance',
    blocks: [
      { type: 'h2', text: "L'étude" },
      { type: 'p', text: "118 coureurs amateurs de longue distance ont été tirés au sort en deux groupes. Le premier a suivi huit semaines d'exercices pour les muscles du pied et de la cheville, puis a continué seul, avec un suivi à distance. Le second servait de groupe témoin. Tous ont noté leurs sorties et leurs blessures chaque semaine, pendant un an (Taddei, 2020)." },
      { type: 'p', text: "Au bout d'un an, ceux qui n'avaient pas fait les exercices avaient 2,4 fois plus de risques de s'être blessés. L'effet apparaissait entre quatre et huit mois d'entraînement." },
      { type: 'h2', text: 'Un seul essai, mais rare' },
      { type: 'p', text: "C'est un seul essai, sur une centaine de coureurs, et les auteurs demandent d'autres études pour confirmer. Ils rappellent aussi qu'aucune méthode n'avait encore vraiment fait ses preuves pour prévenir les blessures des coureurs. C'est ce qui rend ce résultat intéressant." },
      { type: 'h2', text: 'Dans Coriace' },
      { type: 'p', text: "La séance « Pieds et chevilles » travaille le bas de la jambe : équilibre sur un pied, marche sur les talons, mollets et petits sauts latéraux. Ce ne sont pas les exercices de l'étude, mais ils travaillent les mêmes zones. Sur un pied, par exemple, le pied corrige sans arrêt : c'est ce qui protège la cheville sur un terrain irrégulier." },
      { type: 'exercises', ids: ['single_leg_balance', 'marche_talons_inversion'], caption: 'Équilibre sur un pied, et marche sur les talons.' },
      { type: 'p', text: "Moi, je n'ai jamais eu mal aux pieds ni aux chevilles en courant. Mais c'est toujours bon de savoir que ça existe, et que ça se travaille." },
      { type: 'try', items: ['La séance « Pieds et chevilles », dans les [séances ciblées](/seances-ciblees/).'] },
    ],
    sources: [
      'Taddei UT, Matias AB, Duarte M, Sacco ICN. Foot core training to prevent running-related injuries: a survival analysis of a single-blind, randomized controlled trial. The American Journal of Sports Medicine, 2020.',
    ],
  },
  {
    slug: 'genou-coureur-renfo-hanches',
    title: 'Mal au genou en courant : pourquoi renforcer les hanches',
    description: "Une douleur autour de la rotule en courant : pourquoi les études conseillent de renforcer les hanches en plus des cuisses, et les exercices pour le faire.",
    kind: 'Ce que dit la science',
    lead: "Une douleur autour de la rotule, qui monte pendant la sortie ou dans les escaliers : c'est souvent le syndrome fémoro-patellaire. On pense d'abord à renforcer les cuisses. Les études disent qu'il faut aussi s'occuper des hanches.",
    publishedAt: '2027-02-23',
    reviewedByPhysio: false,
    healthNotice: true,
    draft: true,
    coverExerciseId: 'side_lying_abduction',
    blocks: [
      { type: 'h2', text: 'Ce que disent les études' },
      { type: 'p', text: "Une synthèse de 14 études a comparé plusieurs façons de soigner cette douleur par l'exercice. Renforcer les muscles de la hanche en plus des cuisses diminuait la douleur et améliorait la fonction à court terme, avec des preuves solides. À un an, l'association des deux faisait mieux que les cuisses seules, avec des preuves plus limitées (Lack, 2015)." },
      { type: 'p', text: "Ce sont des études sur des personnes qui ont déjà mal, pas sur la prévention. Si tu as une douleur au genou qui dure, c'est à un kiné ou à un médecin d'en juger." },
      { type: 'h2', text: 'Pourquoi les hanches ?' },
      { type: 'p', text: "Le moyen fessier, sur le côté de la hanche, tient le bassin à chaque appui. Quand il fatigue, le genou peut avoir tendance à rentrer vers l'intérieur. Dans cette synthèse, le renfo des hanches rendait aussi le genou plus stable pendant la course, avec moins de variations vers l'intérieur, mais sur très peu d'études (Lack, 2015)." },
      { type: 'h2', text: 'De mon côté' },
      { type: 'p', text: "J'ai eu mal au genou il y a quelques années. J'ai réduit mon volume de course pendant deux ou trois semaines, et c'est passé, sans jamais revenir." },
      { type: 'p', text: "Sur ma première course, les 23 km de Saint-Émilion, c'est la hanche qui s'est réveillée, vers le 15e kilomètre. J'ai continué, la douleur est partie au bout de 5 km, et le repos après la course a suffi. Ça s'est bien fini, mais ce n'est pas une méthode." },
      { type: 'h2', text: 'Les exercices' },
      { type: 'exercises', ids: ['side_lying_abduction', 'single_leg_bridge'], caption: 'Abduction couché sur le côté et pont fessier sur une jambe, pour les hanches.' },
      { type: 'exercises', ids: ['step_down', 'tempo_squat'], caption: "Descente lente d'une marche et squat descente lente, pour les cuisses." },
      { type: 'p', text: "La séance « Genoux solides » de Coriace réunit les deux : l'abduction et le pont sur une jambe pour les hanches, la descente lente d'une marche et le squat descente lente pour les cuisses, plus le gainage latéral." },
      { type: 'p', text: "Augmenter un peu sa cadence peut aussi soulager le genou : j'en parle dans [l'article sur la cadence](/articles/cadence-180-pas-minute/)." },
      { type: 'try', items: ['La séance « Genoux solides », dans les [séances ciblées](/seances-ciblees/).'] },
    ],
    sources: [
      'Lack S, Barton C, Sohan O, Crossley K, Morrissey D. Proximal muscle rehabilitation is effective for patellofemoral pain: a systematic review with meta-analysis. British Journal of Sports Medicine, 2015.',
    ],
  },
  {
    slug: 'renfo-poids-du-corps-suffisant',
    title: 'Le renfo au poids du corps, est-ce que ça suffit ?',
    description: "Les études montrent l'effet le plus net du renfo avec des charges lourdes. Ce que le poids du corps apporte quand même au coureur, et ses limites.",
    kind: 'Ce que dit la science',
    lead: "Coriace propose du renfo au poids du corps, avec au plus un poids de 8 kg. Alors je me suis posé la question honnêtement : est-ce que ça suffit ? Les études donnent une réponse en deux temps.",
    publishedAt: '2027-03-02',
    reviewedByPhysio: false,
    healthNotice: false,
    draft: true,
    coverExerciseId: 'bulgarian_split_squat',
    blocks: [
      { type: 'h2', text: 'Pour la performance, les charges lourdes' },
      { type: 'p', text: "Une synthèse récente a comparé plusieurs façons de faire du renfo chez des coureurs de demi-fond et de fond. Les charges lourdes, au moins 80 % de ce qu'on peut soulever une fois, amélioraient la performance. Mélanger plusieurs méthodes, charges et sauts par exemple, faisait encore mieux (Llanos-Lagos, 2024)." },
      { type: 'p', text: "Les charges moyennes marchent aussi. Chez des coureurs de haut niveau, des programmes de 8 à 12 semaines, deux à trois fois par semaine, avec des charges faibles à modérées et des sauts, amélioraient nettement l'économie de course (Balsalobre-Fernández, 2016)." },
      { type: 'p', text: "Le renfo au poids du corps est plus proche du renfo léger que des charges lourdes, sauf sur certains exercices sur une jambe. Pour gagner en performance, ce n'est donc pas ce qu'il y a de plus efficace." },
      { type: 'h2', text: 'Pour les blessures, pas besoin de barre' },
      { type: 'p', text: "Tous sports confondus, le renfo divise le risque de blessure par trois environ (Lauersen, 2014). Et certains programmes qui ont fait leurs preuves se font sans charge : un programme autour de la Copenhagen plank, au poids du corps, a réduit de 41 % le risque de problèmes à l'aine chez des footballeurs (Harøy, 2019)." },
      { type: 'h2', text: "Ce que j'en retiens" },
      { type: 'p', text: "Moi, je n'ai jamais fait de musculation en salle. Le poids de 8 kg, je l'avais chez moi, c'est tout." },
      { type: 'p', text: "Le renfo au poids du corps a un gros avantage : on le fait chez soi, sans salle, donc on le fait vraiment, chaque semaine. Pour aller plus loin, la salle et les charges lourdes sont l'étape suivante." },
      { type: 'p', text: "Dans Coriace, on monte en difficulté avec les exercices sur une jambe, les versions plus dures de chaque fiche, et le poids de 8 kg dans les séances longues." },
      { type: 'try', items: ['Les séances longues de 45 minutes, avec charge, dans les [séances Marathon](/marathon/).'] },
    ],
    sources: [
      "Llanos-Lagos C, Ramirez-Campillo R, Moran J, Sáez de Villarreal E. The effect of strength training methods on middle-distance and long-distance runners' athletic performance: a systematic review with meta-analysis. Sports Medicine, 2024.",
      'Balsalobre-Fernández C, Santos-Concejero J, Grivas GV. Effects of strength training on running economy in highly trained runners: a systematic review with meta-analysis of controlled trials. Journal of Strength and Conditioning Research, 2016.',
      'Lauersen JB, Bertelsen DM, Andersen LB. The effectiveness of exercise interventions to prevent sports injuries: a systematic review and meta-analysis of randomised controlled trials. British Journal of Sports Medicine, 2014.',
      'Harøy J et al. The Adductor Strengthening Programme prevents groin problems among male football players: a cluster-randomised controlled trial. British Journal of Sports Medicine, 2019.',
    ],
  },
];

// Today, YYYY-MM-DD, in local time.
export function today() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Proofread, and its date has come.
export const isPublished = (article: Article, day = today()) => !article.draft && article.publishedAt <= day;

// Articles to show, most recent first: published ones, plus drafts and scheduled ones on the
// development server.
export const visibleArticles = (includeDrafts: boolean, day = today()) =>
  ARTICLES.filter(a => includeDrafts || isPublished(a, day)).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

// "Brouillon" or "Programmé" before an article not published yet, in a preview.
export const articleStatus = (article: Article, day = today()) =>
  article.draft ? 'Brouillon · ' : article.publishedAt > day ? 'Programmé · ' : '';

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
