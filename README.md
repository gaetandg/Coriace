# Coriace

**Renfo pour coureurs.** Séances de renforcement musculaire guidées pour les coureurs, pensées d'abord pour la préparation marathon.

L'application génère une séance de renforcement en intervalles (travail / récupération) adaptée au matériel disponible, puis guide l'utilisateur pas à pas avec un minuteur et des signaux sonores.

## Fonctionnalités

- **Séance personnalisée** : durée de 15 à 60 minutes, 1 ou 2 blocs de circuit, choix des exercices.
- **Matériel** : sans matériel, chaise, poids de 8 kg, corde à sauter.
- **Deux rythmes** : équilibré (30 s / 30 s) ou intense (40 s / 20 s).
- **Structure complète** : échauffement, circuit principal, finisher.
- **Ciblage coureur** : gainage abdominal, endurance des mollets, adducteurs.
- **Minuteur guidé** : chrono géant lisible au sol, fond brique pendant l'effort et vert pendant la récupération.
- **Guidage vocal** : annonce du prochain exercice et de sa consigne pendant les pauses, décompte « 3, 2, 1 » avant de repartir, « encore dix secondes », « change de côté ». Bips et voix réglables séparément.
- **Écran maintenu allumé** pendant la séance (si le navigateur le permet).
- **Durée respectée** : la séance dure le temps choisi, à 30 secondes près.
- **Guide des exercices** : description, consignes clés et conseils pour chaque mouvement.
- **Installable (PWA)** : s'ajoute à l'écran d'accueil et fonctionne hors ligne.

## Stack technique

- [React 19](https://react.dev/) + TypeScript
- [Vite](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide](https://lucide.dev/) pour les icônes
- Web Audio API pour les bips, Web Speech API pour la voix, Screen Wake Lock API pour garder l'écran allumé
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) pour l'installation et le hors ligne

## Lancer le projet en local

**Prérequis** : Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

L'application est alors disponible sur http://localhost:3000.

## Scripts

| Commande          | Rôle                                     |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Serveur de développement                 |
| `npm run build`   | Build de production dans `dist/`         |
| `npm run preview` | Prévisualisation du build de production  |
| `npm run lint`    | Vérification des types TypeScript        |

## Structure

```
src/
├── App.tsx                    # Assemble l'en-tête, les écrans et le pied de page
├── hooks/
│   ├── useWorkoutSession.ts   # État de la séance : configuration, plan, minuteur, annonces, actions
│   ├── useBeep.ts             # Bips sonores (Web Audio API)
│   ├── useSpeech.ts           # Voix française (Web Speech API)
│   └── useWakeLock.ts         # Écran maintenu allumé
├── components/
│   ├── Header.tsx, Logo.tsx   # En-tête, logo et motif de couloirs
│   ├── GuideScreen.tsx        # Onglet « Guide »
│   ├── CompletedScreen.tsx    # Fin de séance
│   ├── config/                # Accueil (réglages) et choix des exercices
│   ├── summary/               # Résumé du plan et fiche détaillée d'un exercice
│   └── player/                # Séance en cours : minuteur, prochaine étape, commandes, déroulé
├── lib/                       # Annonces de séance (cues.ts), groupes d'exercices, plan, formatage, classes d'interface
├── exercises.ts               # Base de données des exercices
├── workoutGenerator.ts        # Génération de la séance (échauffement, circuit, finisher)
├── types.ts                   # Types partagés
├── main.tsx                   # Point d'entrée React
└── index.css                  # Thème « Piste » : couleurs et polices
public/                        # Icônes de l'application (PWA)
```

## Déploiement

L'application est déployée automatiquement sur GitHub Pages à chaque push sur `main`, via le workflow `.github/workflows/deploy.yml` : vérification des types, build, puis publication.

Mise en place initiale (une seule fois) : dans **Settings → Pages** du dépôt, choisir **Source : GitHub Actions**.

Adresse : https://gaetandg.github.io/Coriace/
