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
- [ ] Revue approfondie avec un regard de coach ou de kiné : dosage, progressions, variantes plus faciles et plus dures
- [x] Circuits équilibrés et variés : groupes clés garantis, ordre aléatoire, deux exercices max par groupe ; « Régénérer » évite la séance précédente

### Séances
- [x] Six séances prédéfinies, exercices fixes dans un ordre fixe
- [ ] Programme sur plusieurs semaines (enchaînement de séances selon la phase de préparation)
- [ ] Historique des séances faites
- [ ] Créer ses propres séances (exercices et ordre choisis) et les enregistrer

### Préférences
- [x] Se souvenir des préférences d'une fois sur l'autre (matériel, rythme, durée, exercices cochés, son)

### Plus tard
- [ ] Applications Android et iPhone avec Capacitor (minuteur et voix qui continuent écran verrouillé)
- [ ] Vérifier la disponibilité du nom « Coriace » avant publication sur les stores (marques INPI et EUIPO, classe 9)

## Problèmes connus

- Sur iPhone en PWA, le minuteur et la voix s'arrêtent si l'écran se verrouille (l'écran reste allumé pendant la séance, mais un verrouillage manuel coupe tout). La version native (Capacitor) règlera ce point.
