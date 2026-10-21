# Coriace

**Renfo pour coureurs.** Séances de renforcement musculaire guidées pour les coureurs, pensées d'abord pour la préparation marathon.

L'application génère une séance de renforcement en intervalles (travail / récupération) adaptée au matériel disponible, puis guide l'utilisateur pas à pas avec un minuteur et des signaux sonores.

## Fonctionnalités

- **Séances prédéfinies** : 18 séances par objectif de course (10 km, semi, marathon, +50 km), 6 par durée (courtes 20 min, sans matériel ; moyennes 30 min ; longues 45 min) : Complète A, B et C, Mollets, Gainage et Cardio, avec la même structure et le même matériel au sein d'une durée (`src/sessionFormulas.ts`) ; et dix séances ciblées (Mollets express, Gainage, Hanches solides, Genoux solides, Pieds et chevilles, Tendon d'Achille, Côtes, Descentes, Dos et posture, Activation avant sortie). L'accueil liste les pages (10 km, Semi, Marathon, +50 km, Séances ciblées) ; la page d'une distance explique à quoi servent ses séances et les présente toutes, regroupées par durée. La page d'une séance permet de choisir le rythme et de la lancer. Les séances qui utilisent un poids se font aussi sans : l'interrupteur « Je n'ai pas de poids » remplace les exercices lestés (squat goblet latéral → squat descente lente, mollets assis lestés → mollets debout, bûcheron → bird dog), décoché par défaut, le choix est retenu d'une fois sur l'autre.
- **Trois modes**, chacun expliqué en une phrase sous le sélecteur (Prédéfinies par défaut pour un nouvel utilisateur) :
  - **Aléatoire** : durée de 15 à 60 minutes, l'app compose une séance variée parmi les exercices sélectionnés (tous par défaut) ; « Régénérer » en tire une autre.
  - **Personnalisée** : tous les exercices sélectionnés (aucun par défaut) sont dans la séance, rangés pour ne pas enchaîner deux fois le même groupe, répétés 2, 3 ou 4 tours ; la durée s'affiche en direct. Pas de finisher.
  - **Prédéfinies** : séances fixes par objectif de course et niveau, et séances ciblées.
  Chaque mode garde sa propre sélection d'exercices.
- **Matériel** : sans matériel, chaise, poids de 8 kg, corde à sauter.
- **Trois rythmes** : doux (20 s / 40 s), équilibré (30 s / 30 s, par défaut) ou intense (40 s / 20 s), avec une phrase sous le sélecteur qui explique l'effort et la récupération. Choisi à l'accueil pour les séances aléatoires et personnalisées, sur la page de la séance pour les séances prédéfinies.
- **Structure complète** : échauffement progressif (de la mobilité aux sautillements, sans répétition), un ou deux circuits courts (8 exercices au plus, 3 ou 4 tours ; les séances longues ont deux blocs plutôt qu'un circuit sans fin), finisher cardio et sauts, retour au calme avec étirements guidés.
- **Ne pas inclure d'échauffement** : après un footing par exemple ; la séance garde sa durée, le circuit prend le temps libéré.
- **Ciblage coureur** : gainage abdominal, endurance des mollets, adducteurs.
- **Minuteur guidé** : chrono géant lisible au sol, fond brique pendant l'effort et vert pendant la récupération.
- **Guidage vocal** : annonce du prochain exercice et de sa consigne pendant les pauses, décompte « 3, 2, 1 » avant de repartir, « encore dix secondes », « change de côté ». Bips et voix réglables séparément.
- **Écran maintenu allumé** pendant la séance (si le navigateur le permet).
- **Durée respectée** : la séance dure le temps choisi, à 30 secondes près.
- **Fiche de chaque exercice** (35 exercices) : description, conseil, variante plus facile et plus dure, précautions pour les sauts.
- **Animations** : chaque exercice est montré par un personnage animé (squelette posé par angles, dessiné en SVG, calculé dans l'app, hors ligne). Dans la fiche, pendant l'effort et, pendant les pauses, pour le prochain exercice. L'animation se fige quand la séance est en pause ou si le téléphone demande moins d'animations. Une vignette fixe tirée de l'animation repère chaque exercice dans les listes (accueil et résumé de séance).
- **Circuits équilibrés et variés** : chaque circuit contient au moins un exercice de mollets, d'adducteurs, de fessiers et de gainage, au plus deux par groupe, sans deux exercices du même groupe à la suite. « Régénérer » évite les exercices de la séance précédente.
- **Une adresse par page** : `coriace.app/10-km/`, `/semi-marathon/`, `/marathon/`, `/trail-ultra/` et `/seances-ciblees/` ouvrent l'app sur la page de séances correspondante, `/exercices/` sur la liste des exercices et `/exercices/copenhagen-plank/` (le nom de l'exercice, sans accents) sur sa page. La barre d'adresse et le titre de l'onglet suivent la page affichée (aussi pendant une de ses séances) : un lien partagé ou un rechargement y revient. Les pages de l'accueil sont de vrais liens.
- **Pages des exercices** : « Les exercices », en bas des séances prédéfinies, liste les 35 exercices par groupe ; la page d'un exercice reprend sa fiche avec l'animation, les pages de séances qui l'utilisent et les autres exercices du groupe. Retour : de l'exercice à la liste, de la liste à l'accueil.
- **Bouton retour du téléphone** : revient à l'écran précédent ; pendant une séance, il met en pause au lieu de quitter.
- **Statistiques** : bouton en haut à droite. Séances sur 7 et 30 jours, minutes, semaines d'affilée, moyenne par semaine, graphique des séances par semaine (12 semaines, repère à 2 par semaine), séries par groupe musculaire sur 30 jours, séances les plus faites et historique complet, avec un bouton « Refaire » sur chaque séance : la même séance prédéfinie au même rythme, ou une séance personnalisée avec les mêmes exercices pour les séances aléatoires et personnalisées (sauf les anciennes séances sans liste d'exercices). Chaque séance terminée garde la liste de ses exercices. L'accueil affiche le nombre de séances des 7 derniers jours.
- **Compte Google (optionnel)** : bouton compte en haut à droite ; en se connectant, l'historique est sauvegardé et synchronisé entre appareils (Supabase). Dans l'app Android, la connexion passe par le compte Google du téléphone. « Supprimer mon compte », dans le menu du compte, efface le compte et son historique tout de suite.
- **Installer l'app** : sur le site, une carte en fin de séance (la première, puis trois séances plus tard après un « Plus tard », jamais après deux), un encadré sous chaque article, une ligne en bas de l'accueil et dans le menu du compte. Sur Android et sur ordinateur, le badge Google Play (lien avec un `referrer` par emplacement, visible dans les rapports d'acquisition de la Play Console) ; sur iPhone, les étapes pour l'ajouter à l'écran d'accueil. Rien dans l'app, ni sur le site installé, ni quand l'app est déjà sur le téléphone (Chrome le sait par `related_applications`).
- **Ton avis** : une note sur 5 facultative et un message, envoyés sans compte ni nom dans la table `feedback` de Supabase. Depuis le bas de l'accueil, le menu du compte, et une fois en fin de séance, à partir de la troisième. Une seule carte par fin de séance : l'installation d'abord, puis « Ton avis », sinon la connexion Google.
- **Note Google Play** : dans l'app Android, la fenêtre de note de Google s'ouvre en fin de séance à partir de la cinquième, au plus une fois par mois, jamais à la fin d'une séance où « Ton avis » est proposé. Rien n'est demandé avant, et tout le monde la voit : Google interdit de filtrer qui va noter.
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
│   ├── exercises/             # Fiche d'un exercice (partagée avec la fenêtre), liste et page des exercices
│   └── player/                # Séance en cours : minuteur, prochaine étape, commandes, déroulé
├── illustrations/             # Personnage animé : squelette (mannequin.ts), mouvements (motion.ts), décor (props.ts), une scène par exercice (scenes.ts)
├── lib/                       # Annonces (cues.ts), préférences, historique, statistiques, groupes d'exercices, plan, formatage, classes d'interface
├── exercises.ts               # Base de données des exercices
├── workoutGenerator.ts        # Séances aléatoires et personnalisées, construction des intervalles
├── sessions.ts                # Séances prédéfinies
├── pages.ts                   # Adresse, titre et description de chaque page (accueil, distances, séances ciblées, exercices)
├── staticPages.ts             # HTML de chaque page, données structurées, sitemap et robots.txt, écrits au build
├── ogImage.ts                 # Images de partage (1200 × 630), dessinées au build
├── sessionParts.ts            # Mouvements d'échauffement et étirements du retour au calme
├── types.ts                   # Types partagés
├── main.tsx                   # Point d'entrée React
└── index.css                  # Thème « Piste » : couleurs et polices
public/                        # Icônes de l'application (PWA)
fonts/                         # Polices des images de partage (SIL Open Font License)
```

## Comptes (Supabase)

La connexion se fait uniquement avec Google, via Supabase. Le projet et sa clé publique sont dans `src/config.ts` (valeurs publiques par conception ; on peut les remplacer avec `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`). Le bouton de connexion n'apparaît que si Google est activé dans le projet.

Mise en place, une seule fois, dans le tableau de bord Supabase :

1. **SQL Editor** : exécuter, dans l'ordre, les fichiers de `supabase/migrations/` : `20261007000000_session_history.sql` (table de l'historique et règles d'accès : chacun ne voit que ses séances) puis `20261008000000_session_exercises.sql` (exercices de chaque séance), `20261009000000_gentle_rhythm.sql` (rythme doux) et `20261021000000_delete_account.sql` (suppression du compte par son propriétaire) et `20261021000100_feedback.sql` (les avis : tout le monde peut en envoyer, personne ne peut les relire par l'API).
2. **Authentication → Sign In / Providers** : désactiver *Email*, activer *Google* avec l'identifiant et le secret d'un client OAuth Google Cloud dont l'URI de redirection autorisée est `https://prfadpnawhrphxigiyag.supabase.co/auth/v1/callback`.
3. **Authentication → URL Configuration** : *Site URL* `https://coriace.app/`, et ajouter cette adresse (plus `http://localhost:3000/` pour le développement) aux *Redirect URLs*.
4. **App Android** : dans Google Cloud (le projet du client OAuth web), *API et services → Identifiants* : créer deux ID clients OAuth de type *Android*, nom de package `app.coriace`, l'un avec l'empreinte SHA-1 de la clé de signature de Google Play (Play Console, *Intégrité de l'application → Signature d'application*), l'autre avec celle de la clé de test, `59:06:97:23:6B:8A:9A:73:F7:F1:FF:32:02:7D:33:9C:2A:2F:98:FB`. Rien à changer dans Supabase : le téléphone demande le jeton pour le client web (`GOOGLE_WEB_CLIENT_ID` dans `src/config.ts`), celui que Supabase connaît déjà.

Les avis se lisent dans **Table Editor → feedback** (note, message, support, nombre de séances terminées, date).

Suppression d'un compte : chacun peut supprimer le sien dans le menu du compte (fonction `delete_my_account`, qui efface aussi ses traces de connexion). Sinon, la demande arrive par e-mail à contact@coriace.app (page `public/suppression-compte.html`, déclarée dans la Play Console), à traiter sous 30 jours depuis l'adresse du compte. **Authentication → Users** : retrouver l'adresse, *Delete user* ; l'historique part avec (`on delete cascade`). Puis, dans **SQL Editor**, effacer ses traces de connexion : `delete from auth.audit_log_entries where payload->>'actor_id' = '<id du compte>';`. Répondre pour confirmer.

## Mesure d'audience (Umami)

L'app compte les visites et quelques actions avec [Umami Cloud](https://umami.is) : sans cookie, sans donnée personnelle, et rien n'est mesuré si le navigateur demande à ne pas être suivi. Seul le site publié est mesuré, jamais le développement local. L'app Android est mesurée aussi : ses visites portent l'étiquette `android` (filtre *Tag* dans Umami).

Événements : `seance-preparee`, `seance-lancee`, `seance-terminee`, `seance-quittee` (avec `progression` en %), `seance-regeneree` (chacun avec `seance`, `minutes`, `rythme`, `deja_echauffe`), `statistiques`, `compte`, `reglages-son`, `fiche-exercice` (avec `exercice`), `connexion-google`, `compte-supprime`, `installation-proposee`, `installation-cliquee` (avec `emplacement` : `fin-seance`, `article`, `pied-de-page`, `compte`), `installation-refusee`, `avis-propose`, `avis-ouvert` (avec `emplacement`), `avis-envoye` (avec `note`), `note-demandee`.

Chaque page a son adresse : Umami compte donc aussi les visites par page (`/marathon/`, `/10-km/`…).

L'identifiant du site Umami se règle dans `src/config.ts` (`UMAMI_WEBSITE_ID`, ou la variable `VITE_UMAMI_WEBSITE_ID`). Vide, rien n'est chargé.

## Référencement

Le build (extension `seoPages` dans `vite.config.ts`, contenu dans `src/staticPages.ts`) écrit une page HTML par adresse : l'accueil, chaque distance, les séances ciblées, la liste des exercices et chaque exercice. Chacune a son titre, sa description, son adresse canonique et son texte dans la page : intro, séances avec leurs exercices (liens vers leurs pages), fiche complète de l'exercice avec l'image de sa position, liens vers les autres pages. Les moteurs et les robots qui n'exécutent pas JavaScript (dont ceux des assistants IA) lisent donc tout ; l'app remplace ce texte dès qu'elle démarre. Les titres et descriptions se changent dans `src/pages.ts`.

- **Données structurées** (JSON-LD schema.org) : `Organization`, `WebSite` et `WebApplication` sur l'accueil ; fil d'Ariane (`BreadcrumbList`) sur les autres pages, avec la liste des séances (`ExercisePlan`) ou des exercices.
- **Images de partage** : une par page (`og/…png`, 1200 × 630), dessinées par `src/ogImage.ts` avec [resvg](https://github.com/thx/resvg-js) aux couleurs de l'app ; celle d'un exercice montre sa position. Pas d'images dans le build Android.
- **Sitemap et robots.txt** : écrits aussi au build, avec toutes les pages.
- **Hors ligne** : les pages d'exercices ne sont pas pré-enregistrées par le service worker ; hors ligne, l'app les affiche elle-même.

Google Search Console (une seule fois) : propriété **Domaine** `coriace.app`, validée par l'enregistrement TXT que Google donne, à ajouter dans la zone DNS chez OVH. Puis **Sitemaps** : envoyer `https://coriace.app/sitemap.xml`, et **Inspection de l'URL** : demander l'indexation de l'accueil. Bing Webmaster Tools (utilisé aussi par ChatGPT et Copilot) : importer le site depuis Search Console.

## Déploiement

L'application est déployée automatiquement sur GitHub Pages à chaque push sur `main`, via le workflow `.github/workflows/deploy.yml` : vérification des types, tests, build, puis publication.

Mise en place initiale (une seule fois) : dans **Settings → Pages** du dépôt, choisir **Source : GitHub Actions**, puis *Custom domain* `coriace.app` avec *Enforce HTTPS*. Le domaine est chez OVH : enregistrements A et AAAA de GitHub Pages sur `coriace.app`, CNAME `www` vers `gaetandg.github.io.`.

Adresse : https://coriace.app/ (l'ancienne adresse github.io redirige)

## App Android

L'app Android emballe l'app web avec [Capacitor](https://capacitorjs.com) (identifiant `app.coriace`, dossier `android/`). Le site n'est pas concerné : dans un navigateur, tout fonctionne comme avant.

Dans l'app, la voix passe par le moteur du téléphone (la vue web d'Android n'en a pas) et l'écran reste allumé pendant la séance ; pas de service worker, les fichiers sont dans l'app. La connexion Google passe par le compte Google du téléphone (Google refuse sa page de connexion web dans une app) : le module `GoogleSignInPlugin` de l'app (Credential Manager d'Android) renvoie un jeton Google, que l'app web transmet à Supabase. `InAppReviewPlugin` ouvre la fenêtre de note de Google Play. Les deux sont déclarés dans `MainActivity.java`.

- `npm run build:android` : build web pour l'app puis copie dans `android/`.
- Fabrication : le workflow `.github/workflows/android.yml` construit l'APK de test à chaque push sur `main` et le publie à l'adresse https://github.com/gaetandg/Coriace/releases/download/android-test/coriace.apk. Il est signé avec une clé de test partagée (`android/app/debug.keystore`, pas un secret), pour que chaque nouvelle version s'installe par-dessus la précédente.
- Play Store : avec les secrets `UPLOAD_KEYSTORE_BASE64` (la clé d'importation `coriace-upload.jks`, encodée en base64) et `UPLOAD_KEYSTORE_PASSWORD` dans le dépôt, le même workflow fabrique aussi le bundle signé (`.aab`), gardé comme artefact du run (`coriace-<numéro>`) ; le numéro du run sert de code de version. La clé reste hors du dépôt. Fiche du Store, réponses de la Play Console et visuels : dossier Drive « Application Coriace › Play Store ».
- Envoi sur Google Play : avec en plus le secret `PLAY_SERVICE_ACCOUNT_JSON`, le bundle part tout seul sur le **test interne** à chaque push sur `main` (pas de validation de Google, les testeurs le reçoivent par le Play Store en quelques minutes). Pour le publier pour tout le monde : dans la Play Console, *Test interne → Promouvoir la version → Production* ; ou sur GitHub, *Actions → Android app → Run workflow* avec la piste `production` (un nouveau bundle, fait à partir de `main`). Les notes de version sont dans `android/whatsnew/whatsnew-fr-FR` (500 caractères au plus), à changer avant un envoi en production. Mise en place, une seule fois :
  1. Google Cloud : activer l'API *Google Play Android Developer API* ; *IAM → Comptes de service* : créer un compte de service, sans rôle, puis *Clés → Ajouter une clé → JSON*.
  2. Play Console, *Utilisateurs et autorisations* : inviter l'adresse du compte de service (`…@….iam.gserviceaccount.com`) avec, pour l'app Coriace, les autorisations de publication en test et en production.
  3. GitHub, *Settings → Secrets and variables → Actions* : secret `PLAY_SERVICE_ACCOUNT_JSON`, avec tout le contenu du fichier JSON. Supprimer ensuite le fichier.
  4. Play Console, *Test → Tests internes → Testeurs* : ajouter une liste avec son adresse, puis ouvrir le lien d'inscription sur le téléphone.
- La politique de confidentialité et les conditions sont en lien en bas de l'accueil, la seule entrée dans l'app Android (le Play Store l'exige).
- En local : JDK 21 et le SDK Android (plateforme 36), puis `cd android && ./gradlew assembleDebug` (test) ou `UPLOAD_KEYSTORE=… UPLOAD_KEYSTORE_PASSWORD=… ./gradlew bundleRelease` (Play Store).

## Articles

Les articles (`/articles/`) et la page de l'auteur (« Le Coureur Coriace », `/articles/qui-ecrit/`) sont dans `src/articles.ts` : texte par blocs (intertitres, paragraphes avec `**gras**` et `[liens](/marathon/)`, listes, exercices animés de l'app, encadré « À essayer »), sources, mention santé, relecture du kiné. Ils suivent la charte éditoriale du dossier Drive « Application Coriace » : rien d'inventé, vécu de l'auteur, illustrations maison.

Un article `draft: true` n'est visible que sur le serveur de développement (`npm run dev`) ; `CORIACE_DRAFTS=1 npm run build` l'écrit aussi, pour un aperçu. La section, son lien sur l'accueil et ses pages dans le plan du site n'apparaissent en ligne qu'à partir du premier article publié.
