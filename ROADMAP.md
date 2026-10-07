# Feuille de route

Ce qui est prévu pour Coriace, dans l'ordre de priorité actuel.

## Fait

- [x] Déploiement automatique sur GitHub Pages (https://gaetandg.github.io/Coriace/)
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
- [x] Échauffement progressif sans répétition, option « Déjà échauffé » (même durée), finisher cardio, retour au calme guidé ; circuits courts et deux blocs pour les séances longues
- [x] Six séances prédéfinies, exercices fixes dans un ordre fixe
- [ ] Programme sur plusieurs semaines (enchaînement de séances selon la phase de préparation)
- [x] Historique des séances terminées, avec le nombre de séances des 7 derniers jours sur l'accueil
- [x] Écran Statistiques : chiffres clés, séances par semaine, séances les plus faites
- [x] Stats par groupe musculaire : chaque séance enregistre ses exercices (séries de travail sur 30 jours)
- [ ] Créer ses propres séances (exercices et ordre choisis) et les enregistrer

### Préférences
- [x] Se souvenir des préférences d'une fois sur l'autre (matériel, rythme, durée, exercices cochés, son)

### Comptes et statistiques
- [x] Mesure d'audience avec Umami (sans cookie) : séances préparées, lancées, terminées, quittées, écrans ouverts — à activer avec l'identifiant du site
- [x] Connexion Google (Supabase) et synchronisation de l'historique entre appareils, accessible depuis l'en-tête
- [ ] Synchroniser aussi les préférences et les séances enregistrées
- [x] Sans compte : proposer de se connecter en fin de séance pour sauvegarder son historique (l'historique local est repris à la connexion)
- [ ] Export vers Strava : envoyer chaque séance terminée comme activité « Renforcement musculaire » (API Strava, connexion Strava du coureur)

### Articles (SEO et GEO)
- [ ] Section d'articles sur la course à pied et le renfo, publiés à intervalle régulier, rédigés par IA et relus avant publication
- [ ] Définir le ton (tutoiement, sobre et direct, comme l'app), la liste de sujets et un calendrier
- [ ] Pages HTML statiques générées au build (une page par article, titre, description, données structurées `Article`, sitemap) : l'app actuelle est une page unique que les moteurs lisent mal
- [ ] Nom de domaine propre plutôt que github.io, pour que le référencement profite à la marque
- [ ] Publication par une tâche planifiée qui propose l'article en pull request : rien n'est publié sans relecture (Google pénalise les contenus produits en masse sans valeur ajoutée)
- [ ] Chaque article renvoie vers une séance de l'app adaptée au sujet

### Plus tard
- [ ] Applications Android et iPhone avec Capacitor (minuteur et voix qui continuent écran verrouillé)
- [ ] Vérifier la disponibilité du nom « Coriace » avant publication sur les stores (marques INPI et EUIPO, classe 9)

## Problèmes connus

- Sur iPhone en PWA, le minuteur et la voix s'arrêtent si l'écran se verrouille (l'écran reste allumé pendant la séance, mais un verrouillage manuel coupe tout). La version native (Capacitor) règlera ce point.
