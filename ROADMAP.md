# Feuille de route

Ce qui est prévu pour Coriace, dans l'ordre de priorité actuel.

## Fait

- [x] Déploiement automatique sur GitHub Pages (https://gaetandg.github.io/Coriace/)
- [x] Application installable (PWA), fonctionne hors ligne
- [x] Nettoyage du code issu d'AI Studio, découpage en composants
- [x] Réécriture de tous les textes : tutoiement, ton sobre et direct
- [x] Nom : **Coriace · Renfo pour coureurs**
- [x] Direction artistique « Piste » : fond brique (vert pendant la récupération), crème, Bricolage Grotesque + Instrument Sans, logo en trois couloirs

## À faire

### Guidage audio
- [ ] Voix qui annonce le prochain exercice pendant les pauses (synthèse vocale du navigateur, voix française)
- [ ] Comptes à rebours vocaux avant le début et avant la fin de chaque exercice
- [ ] Réglages pour activer ou couper chaque élément sonore
- [ ] Garder l'écran allumé pendant la séance (Wake Lock API)
- [ ] Corriger la durée réelle des séances : les 30 s ajoutées à chaque changement de tour font dépasser la durée choisie (une séance de 45 min dure environ 47 min)

### Exercices
- [x] Classer les exercices par groupe sur l'écran de préparation
- [x] Première revue : ajout fessiers et ischios (pont fessier, abduction, soulevé de terre sur une jambe), fente bulgare, gainage latéral, dead bug ; retrait des crunchs et sit-ups
- [ ] Revue approfondie avec un regard de coach ou de kiné : dosage, progressions, variantes plus faciles et plus dures
- [ ] Séances qui équilibrent les groupes (aujourd'hui le tirage ne garantit pas, par exemple, au moins un exercice fessiers par circuit)

### Séances
- [ ] Proposer des séances toutes faites et cohérentes, en plus de la génération aléatoire

### Préférences
- [ ] Se souvenir des préférences de l'utilisateur d'une fois sur l'autre (matériel, rythme, durée, exercices cochés, son)

### Plus tard
- [ ] Applications Android et iPhone avec Capacitor (minuteur et voix qui continuent écran verrouillé)
- [ ] Vérifier la disponibilité du nom « Coriace » avant publication sur les stores (marques INPI et EUIPO, classe 9)

## Problèmes connus

- En mode développement uniquement, le minuteur peut sauter un intervalle et doubler les bips (effet du `StrictMode` de React sur la logique du minuteur). À corriger lors du travail sur le guidage audio.
