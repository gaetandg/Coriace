# Marathon PPG Coach

Coach interactif de préparation physique générale (PPG) pour les coureurs de marathon.

L'application génère une séance de renforcement en intervalles (travail / récupération) adaptée au matériel disponible, puis guide l'utilisateur pas à pas avec un minuteur et des signaux sonores.

## Fonctionnalités

- **Séance personnalisée** : durée de 15 à 60 minutes, 1 ou 2 blocs de circuit, choix des exercices.
- **Matériel** : sans matériel, chaise, poids de 8 kg, corde à sauter.
- **Deux rythmes** : équilibré (30 s / 30 s) ou intense (40 s / 20 s).
- **Structure complète** : échauffement, circuit principal, finisher.
- **Ciblage coureur** : gainage abdominal, endurance des mollets, adducteurs.
- **Minuteur guidé** : bips sonores sur les 3 dernières secondes et aux changements d'étape.
- **Guide des exercices** : description, consignes clés et conseils pour chaque mouvement.

## Stack technique

- [React 19](https://react.dev/) + TypeScript
- [Vite](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Motion](https://motion.dev/) pour les animations
- [Lucide](https://lucide.dev/) pour les icônes
- Web Audio API pour les signaux sonores

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
├── App.tsx               # Interface : configuration, résumé, séance active, fin de séance
├── exercises.ts          # Base de données des exercices
├── workoutGenerator.ts   # Génération de la séance (échauffement, circuit, finisher)
├── types.ts              # Types partagés
├── main.tsx              # Point d'entrée React
└── index.css             # Thème et styles globaux
```

## Déploiement

L'application est déployée automatiquement sur GitHub Pages à chaque push sur `main`, via le workflow `.github/workflows/deploy.yml` : vérification des types, build, puis publication.

Mise en place initiale (une seule fois) : dans **Settings → Pages** du dépôt, choisir **Source : GitHub Actions**.

Adresse : https://gaetandg.github.io/PPG-marathon/
