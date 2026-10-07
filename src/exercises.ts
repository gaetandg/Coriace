/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Exercise } from './types';

export const EXERCISE_DATABASE: Exercise[] = [
  {
    id: 'copenhagen_plank',
    name: 'Copenhagen Plank',
    target: 'Adducteurs (Intérieur des cuisses) - Spécifique Marathon',
    description: 'Allongé sur le côté, place le pied du dessus sur une chaise. Soulève le bassin pour aligner le corps. Jambe du dessous suspendue. Alterne le côté gauche/droit à chaque tour.',
    equipmentRequired: ['chaise'],
    category: 'specific_adductor',
    tips: 'Sentez la contraction sur l\'intérieur de la cuisse supérieure. Gardez le corps parfaitement rectiligne sans cambrer.',
    instructionHighlight: 'Alignement tête-bassin-pied impeccable.'
  },
  {
    id: 'calves_standing_slow',
    name: 'Extensions de mollets debout (Tempo Lent)',
    target: 'Mollets (Gastrocnémiens) - Spécifique Marathon',
    description: 'Sur une marche, monte sur la pointe des pieds en 1 seconde, puis redescends très lentement en 3 à 4 secondes (travail excentrique). Sur une seule jambe si possible.',
    equipmentRequired: [],
    category: 'specific_calf',
    tips: 'Le freinage excentrique (la descente) à vitesse lente est le secret pour bétonner les tendons d\'Achille et éviter la fatigue après le 30ème kilomètre.',
    instructionHighlight: 'Fréquence lente ordonnée : 1s de montée, 4s de descente.'
  },
  {
    id: 'calves_seated',
    name: 'Extensions de mollets assis',
    target: 'Mollets (Soléaire - endurance de force) - Spécifique Marathon',
    description: 'Assis sur une chaise, pose ton poids de 8kg sur tes cuisses. Monte au maximum sur la pointe des pieds, puis redescends. Enchaîne les répétitions.',
    equipmentRequired: ['chaise', 'poids_8kg'],
    category: 'specific_calf',
    tips: 'Le soléaire stabilise activement la cheville à chaque foulée. Cet exercice prévient directement la tétanie ou les crampes des mollets.',
    instructionHighlight: 'Gardez le dos droit et contrôlez la descente.'
  },
  {
    id: 'squat_sumo',
    name: 'Squat Sumo',
    target: 'Adducteurs & Quadriceps - Spécifique Marathon',
    description: 'Écarte les pieds plus largement que les épaules, pointes à 45° vers l\'extérieur. Descends en gardant le dos droit. Possibilité de tenir le poids de 8kg contre la poitrine.',
    equipmentRequired: [],
    category: 'specific_adductor',
    tips: 'Descendez les fesses vers le bas en ouvrant bien vos genoux dans l\'axe de vos orteils pour étirer et renforcer les adducteurs.',
    instructionHighlight: 'Genoux alignés avec les orteils, buste redressé.'
  },
  {
    id: 'lateral_lunges',
    name: 'Fentes latérales',
    target: 'Adducteurs & Stabilité du genou - Spécifique Marathon',
    description: 'Fais un grand pas sur le côté, fléchis la jambe qui a fait le pas en gardant l\'autre bien tendue, puis pousse fort pour revenir au centre.',
    equipmentRequired: [],
    category: 'specific_adductor',
    tips: 'Poussez bien vos fesses en arrière sur la jambe active. Cet exercice améliore la stabilité latérale du genou lors de la fatigue.',
    instructionHighlight: 'Garder l\'autre jambe parfaitement tendue.'
  },
  {
    id: 'crunchs',
    name: 'Crunchs (Abdos)',
    target: 'Sangle abdominale (Grand droit)',
    description: 'Allongé sur le dos, genoux fléchis, les mains effleurant les tempes. Enroule le haut du buste vers l\'avant en contractant les abdos et en gardant le bas du dos plaqué au sol. Expire à la montée.',
    equipmentRequired: [],
    category: 'abdos',
    tips: 'Ne tirez pas sur la nuque avec vos mains. Le mouvement vient uniquement de la contraction des muscles abdominaux.',
    instructionHighlight: 'Plaquer le bas du dos au sol et expirer en montant.'
  },
  {
    id: 'plank_commando',
    name: 'Gainage Planche dynamique / Commando',
    target: 'Sangle abdominale profonde (Transverse) et stabilité',
    description: 'En position de planche sur les avant-bras, monte une main après l\'autre pour passer en position de pompe, puis redescends sur les avant-bras. Garde le bassin le plus fixe possible.',
    equipmentRequired: [],
    category: 'abdos',
    tips: 'Imaginez une tasse de café posée sur votre dos : votre bassin ne doit pas osciller de gauche à droite pendant la transition.',
    instructionHighlight: 'Bassin ultra stable, pas d\'oscillation.'
  },
  {
    id: 'russian_twists',
    name: 'Russian Twists avec poids (Abdos)',
    target: 'Abdominaux obliques (Stabilité de la rotation de course)',
    description: 'Assis au sol, buste légèrement incliné en arrière, jambes décollées ou talons posés. Tiens le poids de 8kg à deux mains et balance-le de gauche à droite en pivotant les épaules.',
    equipmentRequired: ['poids_8kg'],
    category: 'abdos',
    tips: 'Faites pivoter de gauche à droite l\'ensemble du haut du corps (épaules comprises) pour cibler efficacement les obliques, garants de la stabilité du bassin.',
    instructionHighlight: 'Rotation complète des épaules, pas seulement des bras.'
  },
  {
    id: 'situps',
    name: 'Abdos complets (Sit-ups)',
    target: 'Sangle abdominale (Fléchisseurs de hanche & Grand droit)',
    description: 'Allongé sur le dos, les plantes de pieds l\'une contre l\'autre en papillon ou genoux pliés. Remontez entièrement le buste pour venir toucher vos pieds ou vos genoux avec vos mains, puis contrôlez la descente.',
    equipmentRequired: [],
    category: 'abdos',
    tips: 'Engagez les abdominaux dès le début du mouvement et évitez de donner un coup d\'élan violent avec vos bras. Gardez le dos rond lors de la descente pour amortir vertèbre après vertèbre.',
    instructionHighlight: 'Remonter entièrement le buste en contrôlant la descente.'
  },
  {
    id: 'squat_classic',
    name: 'Squat classique',
    target: 'Général (Quadriceps & Fessiers)',
    description: 'Pieds largeur des épaules. Descends les fesses vers l\'arrière comme pour t\'asseoir. Option : tenir le poids de 8kg contre la poitrine pour augmenter la résistance.',
    equipmentRequired: [],
    category: 'general',
    tips: 'Gardez le poids dans les talons et le regard droit devant vous. Très efficace pour renforcer les quadriceps essentiels lors des descentes.',
    instructionHighlight: 'Dos plat, genoux qui ne dépassent pas la pointe des pieds.'
  },
  {
    id: 'alternating_lunges',
    name: 'Fentes alternées',
    target: 'Général (Ischios & Stabilité unilatérale)',
    description: 'Fais un pas en avant (ou en arrière), descends le genou arrière près du sol en gardant le buste droit. Alterne gauche et droite.',
    equipmentRequired: [],
    category: 'general',
    tips: 'Focalisez-vous sur le contrôle de l\'équilibre unilatéral, reproduisant les contraintes d\'impact d\'une foulée de course.',
    instructionHighlight: 'Angle de 90° sur les deux genoux, buste vertical.'
  },
  {
    id: 'wall_sit',
    name: 'La Chaise (Option mollets)',
    target: 'Général (Isométrie) + Mollets',
    description: 'Dos au mur, cuisses parallèles au sol (90°). Pour corser l\'exercice, décolle alternativement le talon gauche puis le talon droit du sol pendant la position.',
    equipmentRequired: [],
    category: 'general',
    tips: 'L\'effort isométrique est idéal pour renforcer l\'endurance musculaire des quadriceps en protégeant les articulations. L\'option mollets active le soléaire.',
    instructionHighlight: 'Appuyez tout le dos au mur, cuisses parallèles au sol.'
  },
  {
    id: 'pushups',
    name: 'Pompes',
    target: 'Général (Haut du corps & Gainage)',
    description: 'Face au sol, mains largeur des épaules. Descends la poitrine au sol en gardant le corps bien aligné (sur les pieds ou sur les genoux si besoin de moduler).',
    equipmentRequired: [],
    category: 'general',
    tips: 'Gardez les coudes rentrés à environ 45 degrés plutôt qu\'écartés sur les côtés, cela protège les épaules.',
    instructionHighlight: 'Maintenir un gainage de planche complet du début à la fin.'
  },
  {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    target: 'Général (Cardio & Activation mollets)',
    description: 'Saute en écartant les pieds et en croisant les mains au-dessus de la tête, puis reviens en position initiale de manière dynamique.',
    equipmentRequired: [],
    category: 'general',
    tips: 'Réceptionnez-vous doucement sur la pointe des pieds pour amortir l\'impact et travailler activement l\'élasticité du tendon d\'Achille.',
    instructionHighlight: 'Rebond souple et synchronisation des mouvements.'
  },
  {
    id: 'calf_raise_isometric_low',
    name: 'Seated Calf Raise (Poids du corps - Isométrie basse)',
    target: 'Mollets (Soléaire) - Spécifique Marathon',
    description: 'Accroupis-toi le plus bas possible (squat complet), les fesses près des talons. Dans cette position, décolle les talons du sol pour monter au maximum sur les pointes de pieds, tiens 2 secondes, puis repose les talons.',
    equipmentRequired: [],
    category: 'specific_calf',
    tips: 'Cet exercice fléchit le genou au maximum, ce qui isole complètement le soléaire (le muscle profond du mollet). C\'est ce muscle qui absorbe jusqu\'à 8 fois ton poids du corps à chaque impact en course à pied.',
    instructionHighlight: 'Genoux fléchis au maximum, monter et tenir 2s sur les pointes.'
  },
  {
    id: 'sauts_corde_bas',
    name: 'Sauts à la corde (Vrais ou imaginaires)',
    target: 'Tendon d\'Achille (Raideur tendineuse) - Spécifique Marathon',
    description: 'Fais de tout petits sauts sur place sur la pointe des pieds, jambes quasi tendues. Les talons ne doivent jamais toucher le sol. Vise la rapidité et le rebond. (Utilise ta corde à sauter si activée, sinon fais des sauts imaginaires).',
    equipmentRequired: ['corde_a_sauter'],
    category: 'specific_calf',
    tips: 'Cela entraîne la "raideur tendineuse" du tendon d\'Achille. Plus ton tendon est élastique et tonique, moins tes mollets se fatiguent vite après des heures de course, ce qui repousse l\'apparition des crampes.',
    instructionHighlight: 'Petits sauts rapides jambes quasi tendues, talons décollés.'
  },
  {
    id: 'marche_talons_inversion',
    name: 'Marche sur les talons (Inversion)',
    target: 'Jambier antérieur (Tibia devant) - Spécifique Marathon',
    description: 'Décolle complètement l\'avant des pieds du sol et marche uniquement sur les talons pendant toute la durée recommandée.',
    equipmentRequired: [],
    category: 'specific_calf',
    tips: 'Cela renforce le jambier antérieur (le muscle devant le tibia). Souvent, les crampes aux mollets surviennent à cause d\'un déséquilibre si le muscle de devant est trop faible par rapport au mollet.',
    instructionHighlight: 'Garder l\'avant des pieds décollé au maximum et marcher sur les talons.'
  },
  {
    id: 'shift_squat_goblet',
    name: 'Squat Goblet latéral (Shift Squat)',
    target: 'Adducteurs & Hanches (Bassin) - Spécifique Marathon',
    description: 'Prends ton poids de 8kg contre ta poitrine. Écarte les pieds un peu plus que la largeur des épaules. Descends en squat, puis, une fois en bas, transfère le poids de ton corps sur la jambe gauche, reviens au centre, puis transfère sur la jambe droite, reviens au centre et remonte.',
    equipmentRequired: ['poids_8kg'],
    category: 'specific_adductor',
    tips: 'Ce léger transfert de poids en position basse force l\'adducteur de la jambe opposée à s\'étirer et à se contracter pour stabiliser le bassin. C\'est ultra-efficace pour blinder les hanches.',
    instructionHighlight: 'Poids de 8kg à la poitrine, fesses basses durant tout le transfert latéral.'
  }
];
