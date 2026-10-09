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
- [ ] Enregistrer ses séances personnalisées (nom, ordre choisi) dans « Mes séances »

### Préférences
- [x] Se souvenir des préférences d'une fois sur l'autre (matériel, rythme, durée, exercices cochés, son)

### Comptes et statistiques
- [x] Mesure d'audience avec Umami (sans cookie) : séances préparées, lancées, terminées, quittées, écrans ouverts — à activer avec l'identifiant du site
- [x] Connexion Google (Supabase) et synchronisation de l'historique entre appareils, accessible depuis l'en-tête
- [ ] Synchroniser aussi les préférences et les séances enregistrées
- [ ] Connexion avec Apple, obligatoire pour publier l'app iPhone sur l'App Store dès qu'une connexion Google est proposée (compte développeur Apple, 99 $ par an)
- [x] Sans compte : proposer de se connecter en fin de séance pour sauvegarder son historique (l'historique local est repris à la connexion)
- [ ] Export vers Strava : envoyer chaque séance terminée comme activité « Renforcement musculaire » (API Strava, connexion Strava du coureur)

### Installation de l'app
- [ ] Proposer d'installer l'app depuis le navigateur. Android et ordinateur (Chrome, Edge, Samsung Internet) : bouton « Installer » qui ouvre la fenêtre du système. iPhone (Safari, aucun moyen de déclencher l'installation) : fenêtre qui montre « Partager » puis « Sur l'écran d'accueil ». Rien si l'app est déjà installée
- [ ] Moment : jamais à la première visite ni pendant une séance. Carte sur l'écran de fin de la première séance terminée (« Installer » / « Plus tard »), reproposée 3 séances plus tard, abandonnée après deux refus
- [ ] Une seule carte à la fois en fin de séance : l'installation passe en premier les fois où elle est prévue, la connexion Google les autres fois. Déjà installée : seulement la connexion ; déjà connecté : seulement l'installation
- [ ] Ligne « Installer l'app » dans le menu du compte, tant que l'app n'est pas installée
- [ ] Mesure Umami : proposition affichée, installation acceptée, refus
- [ ] Une fois l'app Android publiée : sur Android, lien vers le Play Store à la place de l'installation navigateur ; rien si l'app du Store est déjà installée (`related_applications` dans le manifeste) ; rien dans l'app Android elle-même

### Articles (SEO et GEO)
- [ ] Section d'articles sur la course à pied et le renfo, publiés à intervalle régulier, rédigés par IA et relus avant publication
- [ ] Définir le ton (tutoiement, sobre et direct, comme l'app), la liste de sujets et un calendrier
- [ ] Pages HTML statiques générées au build (une page par article, titre, description, données structurées `Article`, sitemap) : l'app actuelle est une page unique que les moteurs lisent mal
- [x] Nom de domaine propre plutôt que github.io (coriace.app), pour que le référencement profite à la marque
- [ ] Publication par une tâche planifiée qui propose l'article en pull request : rien n'est publié sans relecture (Google pénalise les contenus produits en masse sans valeur ajoutée)
- [ ] Chaque article renvoie vers une séance de l'app adaptée au sujet

### Plus tard
- [ ] Applications Android et iPhone avec Capacitor (minuteur et voix qui continuent écran verrouillé)
- [ ] Vérifier la disponibilité du nom « Coriace » avant publication sur les stores (marques INPI et EUIPO, classe 9)

## Problèmes connus

- Sur iPhone en PWA, le minuteur et la voix s'arrêtent si l'écran se verrouille (l'écran reste allumé pendant la séance, mais un verrouillage manuel coupe tout). La version native (Capacitor) règlera ce point.
