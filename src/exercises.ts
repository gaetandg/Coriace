import { Exercise } from './types';

export const EXERCISE_DATABASE: Exercise[] = [
  {
    id: 'copenhagen_plank',
    name: 'Copenhagen plank',
    target: 'Adducteurs',
    description: 'Allongé sur le côté, pose le pied du dessus sur l\'assise d\'une chaise. Soulève le bassin pour aligner tête, bassin et pieds. La jambe du dessous reste dans le vide. Change de côté à chaque tour.',
    equipmentRequired: ['chaise'],
    category: 'specific_adductor',
    tips: 'L\'effort se sent à l\'intérieur de la cuisse posée sur la chaise. Trop dur : pose le genou sur la chaise au lieu du pied.',
    instructionHighlight: 'Corps aligné, bassin haut.'
  },
  {
    id: 'calves_standing_slow',
    name: 'Mollets debout, descente lente',
    target: 'Mollets (gastrocnémiens)',
    description: 'Sur une marche, talons dans le vide. Monte sur la pointe des pieds en 1 seconde, redescends en 3 à 4 secondes. Sur une jambe si tu peux.',
    equipmentRequired: [],
    category: 'specific_calf',
    tips: 'C\'est la descente qui compte : ce travail excentrique renforce le mollet et le tendon d\'Achille.',
    instructionHighlight: '1 s pour monter, 4 s pour descendre.'
  },
  {
    id: 'calves_seated',
    name: 'Mollets assis',
    target: 'Mollets (soléaire)',
    description: 'Assis sur une chaise, le poids de 8 kg posé sur les cuisses près des genoux. Monte sur la pointe des pieds le plus haut possible, puis redescends. Enchaîne.',
    equipmentRequired: ['chaise', 'poids_8kg'],
    category: 'specific_calf',
    tips: 'Genoux pliés, c\'est surtout le soléaire qui travaille. C\'est lui qui tient la cheville à chaque foulée.',
    instructionHighlight: 'Amplitude complète, descente contrôlée.'
  },
  {
    id: 'squat_sumo',
    name: 'Squat sumo',
    target: 'Adducteurs et quadriceps',
    description: 'Pieds plus écartés que les épaules, pointes tournées vers l\'extérieur. Descends en gardant le buste droit, puis remonte. Option : tiens le poids de 8 kg contre la poitrine.',
    equipmentRequired: [],
    category: 'specific_adductor',
    tips: 'Pousse les genoux vers l\'extérieur pour qu\'ils restent dans l\'axe des pieds.',
    instructionHighlight: 'Genoux dans l\'axe des pieds, buste droit.'
  },
  {
    id: 'lateral_lunges',
    name: 'Fentes latérales',
    target: 'Adducteurs et stabilité du genou',
    description: 'Fais un grand pas sur le côté. Plie la jambe qui avance, garde l\'autre tendue, puis pousse pour revenir au centre. Alterne les côtés.',
    equipmentRequired: [],
    category: 'specific_adductor',
    tips: 'Envoie les fesses en arrière sur la jambe pliée, comme pour t\'asseoir.',
    instructionHighlight: 'Jambe opposée tendue.'
  },
  {
    id: 'crunchs',
    name: 'Crunchs',
    target: 'Abdominaux (grand droit)',
    description: 'Sur le dos, genoux pliés, mains près des tempes. Enroule le haut du dos en gardant le bas du dos au sol. Souffle en montant.',
    equipmentRequired: [],
    category: 'abdos',
    tips: 'Ne tire pas sur la nuque : ce sont les abdos qui travaillent, pas les bras.',
    instructionHighlight: 'Bas du dos au sol, souffle en montant.'
  },
  {
    id: 'plank_commando',
    name: 'Planche commando',
    target: 'Gainage profond (transverse)',
    description: 'En planche sur les avant-bras. Monte sur une main puis sur l\'autre pour passer bras tendus, puis redescends sur les avant-bras. Alterne le bras qui commence.',
    equipmentRequired: [],
    category: 'abdos',
    tips: 'Écarte un peu les pieds pour être plus stable. Le bassin ne doit pas se balancer.',
    instructionHighlight: 'Bassin immobile.'
  },
  {
    id: 'russian_twists',
    name: 'Russian twists lestés',
    target: 'Obliques',
    description: 'Assis, buste incliné en arrière, talons au sol ou pieds décollés. Tiens le poids de 8 kg à deux mains et tourne le buste d\'un côté puis de l\'autre.',
    equipmentRequired: ['poids_8kg'],
    category: 'abdos',
    tips: 'Tourne les épaules, pas seulement les bras. Trop dur : garde les talons au sol.',
    instructionHighlight: 'Les épaules suivent le poids.'
  },
  {
    id: 'situps',
    name: 'Sit-ups',
    target: 'Abdominaux et fléchisseurs de hanche',
    description: 'Sur le dos, genoux pliés. Remonte le buste jusqu\'à toucher les genoux, puis redescends en déroulant le dos.',
    equipmentRequired: [],
    category: 'abdos',
    tips: 'Pas d\'élan avec les bras. Redescends vertèbre par vertèbre.',
    instructionHighlight: 'Descente lente et contrôlée.'
  },
  {
    id: 'squat_classic',
    name: 'Squat',
    target: 'Quadriceps et fessiers',
    description: 'Pieds largeur d\'épaules. Descends en envoyant les fesses en arrière, comme pour t\'asseoir, puis remonte. Option : tiens le poids de 8 kg contre la poitrine.',
    equipmentRequired: [],
    category: 'general',
    tips: 'Garde le poids du corps sur les talons et le regard devant toi.',
    instructionHighlight: 'Dos droit, talons au sol.'
  },
  {
    id: 'alternating_lunges',
    name: 'Fentes alternées',
    target: 'Quadriceps, fessiers et équilibre',
    description: 'Fais un grand pas en avant et descends jusqu\'à ce que le genou arrière frôle le sol, puis reviens. Alterne les jambes.',
    equipmentRequired: [],
    category: 'general',
    tips: 'Garde le buste vertical et le genou avant dans l\'axe du pied.',
    instructionHighlight: 'Les deux genoux à 90°.'
  },
  {
    id: 'wall_sit',
    name: 'Chaise contre un mur',
    target: 'Quadriceps et mollets',
    description: 'Dos contre le mur, cuisses parallèles au sol. Tiens la position. Pour corser, décolle un talon puis l\'autre.',
    equipmentRequired: [],
    category: 'general',
    tips: 'Tout le dos reste en contact avec le mur.',
    instructionHighlight: 'Cuisses parallèles au sol.'
  },
  {
    id: 'pushups',
    name: 'Pompes',
    target: 'Haut du corps et gainage',
    description: 'Mains sous les épaules, corps gainé. Descends la poitrine près du sol, puis pousse. Sur les genoux si besoin.',
    equipmentRequired: [],
    category: 'general',
    tips: 'Coudes à environ 45° du corps, pas écartés à l\'horizontale : tes épaules te remercieront.',
    instructionHighlight: 'Corps droit du début à la fin.'
  },
  {
    id: 'jumping_jacks',
    name: 'Jumping jacks',
    target: 'Cardio et mollets',
    description: 'Saute en écartant les pieds et en levant les bras au-dessus de la tête, puis reviens pieds joints, bras le long du corps.',
    equipmentRequired: [],
    category: 'general',
    tips: 'Atterris en souplesse sur l\'avant du pied.',
    instructionHighlight: 'Réceptions légères.'
  },
  {
    id: 'calf_raise_isometric_low',
    name: 'Mollets en squat profond',
    target: 'Mollets (soléaire)',
    description: 'Accroupis-toi au plus bas, fesses près des talons. Monte sur la pointe des pieds, tiens 2 secondes, repose les talons. Enchaîne.',
    equipmentRequired: [],
    category: 'specific_calf',
    tips: 'Genoux très pliés, c\'est le soléaire qui travaille. Tiens-toi à un meuble si l\'équilibre est difficile.',
    instructionHighlight: 'Tiens 2 s en haut.'
  },
  {
    id: 'sauts_corde_bas',
    name: 'Sauts à la corde',
    target: 'Tendon d\'Achille et mollets',
    description: 'Petits sauts rapides sur l\'avant du pied, jambes presque tendues. Les talons ne touchent pas le sol.',
    equipmentRequired: ['corde_a_sauter'],
    category: 'specific_calf',
    tips: 'Cherche des rebonds courts et réguliers : le tendon d\'Achille travaille comme un ressort.',
    instructionHighlight: 'Talons décollés, rebonds courts.'
  },
  {
    id: 'marche_talons_inversion',
    name: 'Marche sur les talons',
    target: 'Jambier antérieur (devant du tibia)',
    description: 'Lève l\'avant des pieds et marche uniquement sur les talons.',
    equipmentRequired: [],
    category: 'specific_calf',
    tips: 'Ce muscle travaille à l\'opposé du mollet. Le renforcer équilibre le bas de la jambe.',
    instructionHighlight: 'Pointes de pieds le plus haut possible.'
  },
  {
    id: 'shift_squat_goblet',
    name: 'Squat goblet latéral',
    target: 'Adducteurs et hanches',
    description: 'Poids de 8 kg contre la poitrine, pieds un peu plus écartés que les épaules. Descends en squat. En bas, décale le poids du corps sur la jambe gauche, reviens au centre, puis sur la jambe droite, reviens au centre et remonte.',
    equipmentRequired: ['poids_8kg'],
    category: 'specific_adductor',
    tips: 'Reste bas pendant tout le transfert : les adducteurs travaillent pour stabiliser le bassin.',
    instructionHighlight: 'Fesses basses pendant le transfert.'
  }
];
