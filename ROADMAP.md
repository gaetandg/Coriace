# Feuille de route

Ce qui est prévu pour Coriace, dans l'ordre de priorité actuel.

## Fait

- [x] Déploiement automatique sur GitHub Pages (https://coriace.app/)
- [x] Application installable (PWA), fonctionne hors ligne
- [x] Nettoyage du code issu d'AI Studio, découpage en composants
- [x] Réécriture de tous les textes : tutoiement, ton sobre et direct
- [x] Tests automatiques (générateur, annonces, préférences), lancés à chaque déploiement
- [x] Nom : **Coriace · Renfo pour coureurs**
- [x] Direction artistique « Piste » : fond brique (vert pendant la récupération), crème, Bricolage Grotesque + Instrument Sans, logo en trois couloirs
- [x] Menu en bas de l'écran : Séances, Articles, Statistiques (sur le site et dans l'app Android), masqué pendant une séance

## À faire

### Guidage audio
- [x] Voix qui annonce le prochain exercice et sa consigne pendant les pauses
- [x] Décompte vocal « 3, 2, 1 » avant chaque exercice, bips avant la fin, « encore dix secondes », « change de côté »
- [x] Réglages séparés pour les bips et la voix
- [x] Écran maintenu allumé pendant la séance
- [x] Durée réelle des séances corrigée (à 30 s près)
- [ ] Choix de la voix et du débit, si les voix par défaut ne plaisent pas

### Exercices
- [x] Classer les exercices par groupe sur l'écran de préparation
- [x] Première revue : ajout fessiers et ischios (pont fessier, abduction, soulevé de terre sur une jambe), fente bulgare, gainage latéral, dead bug ; retrait des crunchs et sit-ups
- [x] Deuxième revue : variantes plus faciles et plus dures sur chaque fiche ; ajout de la corde (pas de course, sur un pied), sauts pieds joints, montée sur chaise, pont ischios, bird dog, équilibre sur un pied, montées de genoux ; bûcheron à la place des russian twists ; Copenhagen côté par côté à mi-temps
- [ ] Faire relire la liste par un kiné
- [x] Animation de chaque exercice (personnage en volume, positions clés, décor)
- [ ] Éditeur de poses pour retoucher les animations à la souris (page interne), export GIF pour les articles
- [x] Circuits équilibrés et variés : groupes clés garantis, ordre aléatoire, deux exercices max par groupe ; « Régénérer » évite la séance précédente

### Séances
- [x] Échauffement progressif sans répétition, option « Ne pas inclure d'échauffement » (même durée), finisher cardio, retour au calme guidé ; circuits courts et deux blocs pour les séances longues
- [x] Séances prédéfinies par objectif (10 km, semi, marathon, +50 km) et niveau (débutant, intermédiaire, confirmé), et dix séances ciblées
- [x] Nouveaux exercices pour le trail et la puissance : descente lente d'une marche, squat descente lente, fentes arrière, sauts latéraux, squat sauté
- [ ] Programmes sur plusieurs semaines (prépa marathon, trail, prévention des blessures, reprise) : phases fondation, développement, spécifique, affûtage ; calage sur la date de course ; carte « séance du jour » sur l'accueil ; progression synchronisée avec le compte
- [x] Historique des séances terminées, avec le nombre de séances des 7 derniers jours sur l'accueil
- [x] Écran Statistiques : chiffres clés, séances par semaine, séances les plus faites
- [x] Stats par groupe musculaire : chaque séance enregistre ses exercices (séries de travail sur 30 jours)
- [x] Mode Personnalisée : tous les exercices sélectionnés, 2 à 4 tours, durée affichée en direct
- [x] Cadran de durée sur chaque séance prédéfinie (liste et résumé)
- [ ] Enregistrer ses séances personnalisées (nom, ordre choisi) dans « Mes séances »

### Préférences
- [x] Se souvenir des préférences d'une fois sur l'autre (matériel, rythme, durée, exercices cochés, son)

### Comptes et statistiques
- [x] Mesure d'audience avec Umami (sans cookie) : séances préparées, lancées, terminées, quittées, écrans ouverts — à activer avec l'identifiant du site
- [x] Visites de l'app Android comptées aussi, avec l'étiquette `android`
- [x] Connexion Google (Supabase) et synchronisation de l'historique entre appareils, accessible depuis l'en-tête
- [x] Connexion Google dans l'app Android avec le compte du téléphone (Credential Manager, jeton Google transmis à Supabase) et « Supprimer mon compte » dans le menu du compte, sur l'app comme sur le site (suppression immédiate, traces de connexion comprises), comme Google Play l'exige
- [ ] Mise en place de la connexion dans l'app : deux ID clients OAuth Android dans Google Cloud (clé de signature de Google Play et clé de test), migration `delete_account` dans Supabase, puis mettre à jour la section « Sécurité des données » de la Play Console si besoin
- [ ] Synchroniser aussi les préférences et les séances enregistrées
- [ ] Connexion avec Apple, obligatoire pour publier l'app iPhone sur l'App Store dès qu'une connexion Google est proposée (compte développeur Apple, 99 $ par an)
- [x] Sans compte : proposer de se connecter en fin de séance pour sauvegarder son historique (l'historique local est repris à la connexion)
- [ ] Export vers Strava : envoyer chaque séance terminée comme activité « Renforcement musculaire » (API Strava, connexion Strava du coureur)

### Installation de l'app
- [x] Carte en fin de séance (« Plus tard ») : à la première séance terminée, reproposée 3 séances plus tard, abandonnée après deux refus. Une seule carte à la fois : l'installation, puis « Ton avis », sinon la connexion Google
- [x] Android et ordinateur : badge officiel Google Play ; iPhone : étapes « Partager » puis « Sur l'écran d'accueil ». Rien dans l'app Android, ni sur le site installé, ni si l'app du Store est déjà sur le téléphone (`related_applications` dans le manifeste, `asset_statements` dans l'app)
- [x] Emplacements : fin de séance, encadré sous chaque article, ligne en bas de l'accueil et dans le menu du compte, lien dans le pied des pages lues par les moteurs. Pas de bandeau ni de fenêtre à l'arrivée sur le site
- [x] Lien Play Store avec un `referrer` par emplacement (fin de séance, article, pied de page, compte), pour voir dans la Play Console ce qui fait installer ; mesure Umami : proposition, clic, refus
- [ ] Liens coriace.app ouverts dans l'app quand elle est installée (Android App Links : `/.well-known/assetlinks.json` sur le site avec l'empreinte SHA-256 de la clé de signature de Google Play, `intent-filter` vérifié dans l'app, ouverture de la bonne page avec `@capacitor/app`)

### Avis et retours
- [x] « Ton avis » : note sur 5 facultative et message, depuis le bas de l'accueil, le menu du compte et une fois en fin de séance (à partir de la 3e séance terminée), sur le site comme dans l'app. Table `feedback` dans Supabase (date, note, message, support, nombre de séances), sans compte ni nom, écriture seule pour tous, lecture depuis le tableau de bord
- [x] Note Google Play dans l'app Android (API In-App Review) : en fin de séance, à partir de la 5e séance terminée, au plus une fois par mois ; Google limite lui-même le nombre d'affichages et ne dit pas la note donnée
- [x] Règle de Google Play : rien n'est demandé juste avant la carte de note, et tout le monde la voit, quel que soit son avis (renvoyer vers le Store seulement les 4 étoiles et plus est interdit). « Ton avis » et la carte de Google ne s'affichent jamais à la même fin de séance
- [x] Page de confidentialité mise à jour ; mesure Umami : avis proposé, ouvert, envoyé, note demandée
- [ ] Exécuter la migration `feedback` dans Supabase ; déclarer les avis dans la section « Sécurité des données » de la Play Console (activité dans l'app, autres contenus générés par l'utilisateur, non liés à l'identité)
- [ ] Lire les avis régulièrement (Supabase, *Table Editor → feedback*) et répondre à ceux du Play Store depuis la Play Console

### Articles (SEO et GEO)
- [x] Section d'articles sur la course à pied et le renfo (`/articles/`) : liste des articles et une page par article, HTML écrit au build (titre, description, données structurées `Article` avec l'auteur, sitemap), brouillons visibles seulement en développement
- [x] Premiers articles publiés : « Des crampes au 30e kilomètre, à chaque marathon » (avec le graphique d'allure des 2 Rives) et « Renfo et marathon : mon plan pour Bordeaux »
- [x] Articles programmés : un article daté sort tout seul (le site est refait chaque matin) ; l'app Android lit les articles du site (`articles.json`) et les garde hors ligne, sans mise à jour du Store
- [ ] Faire relire par le kiné les articles publiés (crampes au 30e, plan pour Bordeaux, sortie de 30 km) et programmés avant leur date (sel et magnésium le 27 octobre, étirements le 17 novembre, cadence le 8 décembre, adducteurs le 15 décembre), ou décaler ces dates ; puis afficher « Relu par un kinésithérapeute »
- [x] Analyse de la sortie test de 30 km du 14 octobre, comparée à avril
- [ ] Brouillons datés à finir, sinon ils ne sortent pas (`draft: true`) : affûtage (3 novembre), marathon de Bordeaux avec le fichier de la montre (11 novembre), reprise après le marathon (24 novembre), test des mollets (1er décembre)
- [ ] « Teste tes mollets en 2 minutes » : attend le résultat du test de l'auteur et l'avis du kiné
- [ ] Articles « ce que dit la science » : une idée qui circule sur les réseaux (étirements avant la course, renfo qui alourdit, crampes et magnésium…), ce que montrent vraiment les études, leur niveau de preuve et ce qu'on ne sait pas, sources citées ; relus par le kiné
- [x] Charte éditoriale (dossier Drive « Application Coriace ») : contenu qu'on est seuls à pouvoir écrire (vécu de l'auteur, données Coriace, illustrations Coriace, tests, avis du kiné, interviews), première personne et tutoiement, rien d'inventé, illustrations maison sans images générées par IA, mention santé, relecture du kiné pour tout ce qui touche au corps
- [x] Auteur signé « Le Coureur Coriace », page « Qui écrit ? » sans nom ni photo de visage
- [ ] Six premiers articles : pourquoi j'ai fini par faire du renfo, le renfo pour préparer un marathon, teste tes mollets en 2 minutes, renfo avant ou après la sortie, journal de prépa du marathon de Bordeaux, interview du kiné ; plus tard un baromètre tiré des données de l'app (chiffres agrégés et anonymes, mentionnés dans la page de confidentialité)
- [ ] Rythme : deux articles par mois. Brouillon rédigé à partir de la matière de l'auteur (notes, Strava, photos), relu par l'auteur et le kiné avant publication
- [x] Nom de domaine propre plutôt que github.io (coriace.app), pour que le référencement profite à la marque
- [x] Une page par distance et pour les séances ciblées (`/marathon/`…) : adresse, titre, description et texte lisible sans JavaScript, écrits au build ; sitemap et robots.txt
- [x] Une page par exercice (`/exercices/…`) et la liste des exercices : fiche complète, image de la position, séances qui l'utilisent ; dans l'app aussi
- [x] Données structurées (Organization, WebSite, WebApplication, fil d'Ariane, listes de séances et d'exercices) et une image de partage par page (1200 × 630)
- [x] Déclarer le site dans Google Search Console (propriété Domaine, enregistrement TXT chez OVH) et y envoyer le sitemap ; l'importer dans Bing Webmaster Tools
- [ ] Faire connaître l'app ailleurs (forums, clubs, fiche Play Store) : les mentions comptent pour être cité par les assistants IA
- [ ] Chaque article renvoie vers une séance de l'app adaptée au sujet

### Publication Play Store
- [x] Bundle signé (AAB) fabriqué par le workflow Android, clé d'importation hors du dépôt (secrets GitHub)
- [x] Fiche du Store (textes, icône, image de présentation, 8 captures) et réponses de la Play Console, sur le Drive
- [x] Lien vers la politique de confidentialité dans l'app (bas de l'accueil)
- [ ] Vérifier la disponibilité du nom « Coriace » avant la publication (marques INPI et EUIPO, classe 9)
- [x] Créer l'app dans la Play Console et publier la première version
- [x] Envoi automatique sur le test interne par l'API Google Play à chaque push sur `main` (compte de service, secret `PLAY_SERVICE_ACCOUNT_JSON`) ; production par la Play Console (promouvoir la version) ou en lançant le workflow à la main
- [ ] Vérifier sur téléphone la version du test interne avec le menu du bas et les articles (articles lus hors ligne, graphiques, liens « À essayer » vers les séances), puis la promouvoir en production
- [ ] Polices dans l'app Android plutôt que chargées depuis Google Fonts (hors ligne)

### Langues
- [ ] Gestion des langues : textes sortis du code dans un fichier par langue, langue du téléphone par défaut, choix dans les réglages
- [ ] Traduire l'app, anglais d'abord, puis espagnol, allemand et italien : écrans, fiches des 35 exercices, annonces de la voix (voix du téléphone dans la langue choisie)
- [ ] Pages du site par langue (`/en/…`), reliées entre elles pour les moteurs de recherche (`hreflang`), sitemap compris
- [ ] Fiche Play Store dans chaque langue (textes et captures) et diffusion dans tous les pays, plus seulement les pays francophones

### Plus tard
- [ ] Coriace pour les kinés : composer une séance pour un patient (exercices, tours, rythme, consignes), lui envoyer par lien ou QR code, voir s'il l'a faite. À creuser avec un kiné : besoins, cadre (données de santé), modèle (gratuit pour le patient, payant pour le cabinet ?)
- [ ] Application iPhone avec Capacitor, comme celle d'Android (minuteur et voix qui continuent écran verrouillé)

## Problèmes connus

- Sur iPhone en PWA, le minuteur et la voix s'arrêtent si l'écran se verrouille (l'écran reste allumé pendant la séance, mais un verrouillage manuel coupe tout). La version native (Capacitor) règlera ce point.
