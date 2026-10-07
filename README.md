# Coriace

**Renfo pour coureurs.** Séances de renforcement musculaire guidées pour les coureurs, pensées d'abord pour la préparation marathon.

L'application génère une séance de renforcement en intervalles (travail / récupération) adaptée au matériel disponible, puis guide l'utilisateur pas à pas avec un minuteur et des signaux sonores.

## Fonctionnalités

- **Séances prédéfinies** : six séances fixes (Mollets express, Gainage, Hanches solides, Sans matériel, Spécial marathon, Complète), toujours les mêmes exercices dans le même ordre pour suivre ses progrès.
- **Séance sur mesure** : durée de 15 à 60 minutes, choix des exercices par groupe, fiche détaillée de chaque exercice.
- **Matériel** : sans matériel, chaise, poids de 8 kg, corde à sauter.
- **Deux rythmes** : équilibré (30 s / 30 s) ou intense (40 s / 20 s).
- **Structure complète** : échauffement, circuit principal, finisher.
- **Ciblage coureur** : gainage abdominal, endurance des mollets, adducteurs.
- **Minuteur guidé** : chrono géant lisible au sol, fond brique pendant l'effort et vert pendant la récupération.
- **Guidage vocal** : annonce du prochain exercice et de sa consigne pendant les pauses, décompte « 3, 2, 1 » avant de repartir, « encore dix secondes », « change de côté ». Bips et voix réglables séparément.
- **Écran maintenu allumé** pendant la séance (si le navigateur le permet).
- **Durée respectée** : la séance dure le temps choisi, à 30 secondes près.
- **Guide des exercices** : description, consignes clés et conseils pour chaque mouvement.
- **Circuits équilibrés et variés** : chaque circuit contient au moins un exercice de mollets, d'adducteurs, de fessiers et de gainage, au plus deux par groupe, sans deux exercices du même groupe à la suite. « Régénérer » évite les exercices de la séance précédente.
- **Bouton retour du téléphone** : revient à l'écran précédent ; pendant une séance, il met en pause au lieu de quitter.
- **Historique** : chaque séance terminée est enregistrée (date, nom, durée, rythme) ; l'accueil affiche le nombre de séances des 7 derniers jours.
- **Compte Google (optionnel)** : bouton compte en haut à droite ; en se connectant, l'historique est sauvegardé et synchronisé entre appareils (Supabase).
- **Préférences retenues** : matériel, rythme, durée, exercices cochés et réglages du son sont gardés d'une visite à l'autre (dans le navigateur).
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
| `npm test`        | Tests automatiques (Vitest)              |

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
│   ├── CompletedScreen.tsx    # Fin de séance
│   ├── HistoryScreen.tsx      # Historique des séances terminées
│   ├── AccountCard.tsx, AccountSheet.tsx  # Connexion Google et compte
│   ├── config/                # Accueil (réglages) et choix des exercices
│   ├── summary/               # Résumé du plan et fiche détaillée d'un exercice
│   └── player/                # Séance en cours : minuteur, prochaine étape, commandes, déroulé
├── lib/                       # Annonces (cues.ts), préférences, historique, groupes d'exercices, plan, formatage, classes d'interface
├── exercises.ts               # Base de données des exercices
├── workoutGenerator.ts        # Séance sur mesure et construction des intervalles
├── sessions.ts                # Séances prédéfinies
├── types.ts                   # Types partagés
├── main.tsx                   # Point d'entrée React
└── index.css                  # Thème « Piste » : couleurs et polices
public/                        # Icônes de l'application (PWA)
```

## Comptes (Supabase)

La connexion se fait uniquement avec Google, via Supabase. Le projet et sa clé publique sont dans `src/config.ts` (valeurs publiques par conception ; on peut les remplacer avec `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`). Le bouton de connexion n'apparaît que si Google est activé dans le projet.

Mise en place, une seule fois, dans le tableau de bord Supabase :

1. **SQL Editor** : exécuter `supabase/migrations/20261007000000_session_history.sql` (table de l'historique et règles d'accès : chacun ne voit que ses séances).
2. **Authentication → Sign In / Providers** : désactiver *Email*, activer *Google* avec l'identifiant et le secret d'un client OAuth Google Cloud dont l'URI de redirection autorisée est `https://prfadpnawhrphxigiyag.supabase.co/auth/v1/callback`.
3. **Authentication → URL Configuration** : *Site URL* `https://gaetandg.github.io/Coriace/`, et ajouter cette adresse (plus `http://localhost:3000/` pour le développement) aux *Redirect URLs*.

## Déploiement

L'application est déployée automatiquement sur GitHub Pages à chaque push sur `main`, via le workflow `.github/workflows/deploy.yml` : vérification des types, tests, build, puis publication.

Mise en place initiale (une seule fois) : dans **Settings → Pages** du dépôt, choisir **Source : GitHub Actions**.

Adresse : https://gaetandg.github.io/Coriace/
