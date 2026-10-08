# Coriace

**Renfo pour coureurs.** Séances de renforcement musculaire guidées pour les coureurs, pensées d'abord pour la préparation marathon.

L'application génère une séance de renforcement en intervalles (travail / récupération) adaptée au matériel disponible, puis guide l'utilisateur pas à pas avec un minuteur et des signaux sonores.

## Fonctionnalités

- **Séances prédéfinies** : six séances fixes (Mollets express, Gainage, Hanches solides, Sans matériel, Spécial marathon, Complète), toujours les mêmes exercices dans le même ordre pour suivre ses progrès.
- **Trois modes**, chacun expliqué en une phrase sous le sélecteur :
  - **Aléatoire** : durée de 15 à 60 minutes, l'app compose une séance variée parmi les exercices sélectionnés (tous par défaut) ; « Régénérer » en tire une autre.
  - **Personnalisée** : tous les exercices sélectionnés (aucun par défaut) sont dans la séance, rangés pour ne pas enchaîner deux fois le même groupe, répétés 2, 3 ou 4 tours ; la durée s'affiche en direct. Pas de finisher.
  - **Prédéfinies** : six séances fixes.
  Chaque mode garde sa propre sélection d'exercices.
- **Matériel** : sans matériel, chaise, poids de 8 kg, corde à sauter.
- **Trois rythmes** : doux (20 s / 40 s), équilibré (30 s / 30 s, par défaut) ou intense (40 s / 20 s).
- **Structure complète** : échauffement progressif (de la mobilité aux sautillements, sans répétition), un ou deux circuits courts (8 exercices au plus, 3 ou 4 tours ; les séances longues ont deux blocs plutôt qu'un circuit sans fin), finisher cardio et sauts, retour au calme avec étirements guidés.
- **Ne pas inclure d'échauffement** : après un footing par exemple ; la séance garde sa durée, le circuit prend le temps libéré.
- **Ciblage coureur** : gainage abdominal, endurance des mollets, adducteurs.
- **Minuteur guidé** : chrono géant lisible au sol, fond brique pendant l'effort et vert pendant la récupération.
- **Guidage vocal** : annonce du prochain exercice et de sa consigne pendant les pauses, décompte « 3, 2, 1 » avant de repartir, « encore dix secondes », « change de côté ». Bips et voix réglables séparément.
- **Écran maintenu allumé** pendant la séance (si le navigateur le permet).
- **Durée respectée** : la séance dure le temps choisi, à 30 secondes près.
- **Fiche de chaque exercice** (30 exercices) : description, conseil, variante plus facile et plus dure, précautions pour les sauts.
- **Animations** : chaque exercice est montré par un personnage animé (squelette posé par angles, dessiné en SVG, calculé dans l'app, hors ligne). Dans la fiche, pendant l'effort et, pendant les pauses, pour le prochain exercice. L'animation se fige quand la séance est en pause ou si le téléphone demande moins d'animations. Une vignette fixe tirée de l'animation repère chaque exercice dans les listes (accueil et résumé de séance).
- **Circuits équilibrés et variés** : chaque circuit contient au moins un exercice de mollets, d'adducteurs, de fessiers et de gainage, au plus deux par groupe, sans deux exercices du même groupe à la suite. « Régénérer » évite les exercices de la séance précédente.
- **Bouton retour du téléphone** : revient à l'écran précédent ; pendant une séance, il met en pause au lieu de quitter.
- **Statistiques** : bouton en haut à droite. Séances sur 7 et 30 jours, minutes, semaines d'affilée, moyenne par semaine, graphique des séances par semaine (12 semaines, repère à 2 par semaine), séries par groupe musculaire sur 30 jours, séances les plus faites et historique complet. Chaque séance terminée garde la liste de ses exercices. L'accueil affiche le nombre de séances des 7 derniers jours.
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
│   ├── stats/                 # Statistiques : chiffres clés, graphiques, historique
│   ├── AccountCard.tsx, AccountSheet.tsx  # Connexion Google et compte
│   ├── config/                # Accueil (réglages) et choix des exercices
│   ├── summary/               # Résumé du plan et fiche détaillée d'un exercice
│   └── player/                # Séance en cours : minuteur, prochaine étape, commandes, déroulé
├── illustrations/             # Personnage animé : squelette (mannequin.ts), mouvements (motion.ts), décor (props.ts), une scène par exercice (scenes.ts)
├── lib/                       # Annonces (cues.ts), préférences, historique, statistiques, groupes d'exercices, plan, formatage, classes d'interface
├── exercises.ts               # Base de données des exercices
├── workoutGenerator.ts        # Séances aléatoires et personnalisées, construction des intervalles
├── sessions.ts                # Séances prédéfinies
├── sessionParts.ts            # Mouvements d'échauffement et étirements du retour au calme
├── types.ts                   # Types partagés
├── main.tsx                   # Point d'entrée React
└── index.css                  # Thème « Piste » : couleurs et polices
public/                        # Icônes de l'application (PWA)
```

## Comptes (Supabase)

La connexion se fait uniquement avec Google, via Supabase. Le projet et sa clé publique sont dans `src/config.ts` (valeurs publiques par conception ; on peut les remplacer avec `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`). Le bouton de connexion n'apparaît que si Google est activé dans le projet.

Mise en place, une seule fois, dans le tableau de bord Supabase :

1. **SQL Editor** : exécuter, dans l'ordre, les fichiers de `supabase/migrations/` : `20261007000000_session_history.sql` (table de l'historique et règles d'accès : chacun ne voit que ses séances) puis `20261008000000_session_exercises.sql` (exercices de chaque séance) et `20261009000000_gentle_rhythm.sql` (rythme doux).
2. **Authentication → Sign In / Providers** : désactiver *Email*, activer *Google* avec l'identifiant et le secret d'un client OAuth Google Cloud dont l'URI de redirection autorisée est `https://prfadpnawhrphxigiyag.supabase.co/auth/v1/callback`.
3. **Authentication → URL Configuration** : *Site URL* `https://gaetandg.github.io/Coriace/`, et ajouter cette adresse (plus `http://localhost:3000/` pour le développement) aux *Redirect URLs*.

## Mesure d'audience (Umami)

L'app compte les visites et quelques actions avec [Umami Cloud](https://umami.is) : sans cookie, sans donnée personnelle, et rien n'est mesuré si le navigateur demande à ne pas être suivi. Seul le site publié est mesuré, jamais le développement local.

Événements : `seance-preparee`, `seance-lancee`, `seance-terminee`, `seance-quittee` (avec `progression` en %), `seance-regeneree` (chacun avec `seance`, `minutes`, `rythme`, `deja_echauffe`), `statistiques`, `compte`, `reglages-son`, `fiche-exercice` (avec `exercice`), `connexion-google`.

L'identifiant du site Umami se règle dans `src/config.ts` (`UMAMI_WEBSITE_ID`, ou la variable `VITE_UMAMI_WEBSITE_ID`). Vide, rien n'est chargé.

## Déploiement

L'application est déployée automatiquement sur GitHub Pages à chaque push sur `main`, via le workflow `.github/workflows/deploy.yml` : vérification des types, tests, build, puis publication.

Mise en place initiale (une seule fois) : dans **Settings → Pages** du dépôt, choisir **Source : GitHub Actions**.

Adresse : https://gaetandg.github.io/Coriace/
