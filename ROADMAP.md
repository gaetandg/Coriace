# Feuille de route

Ce qui est prévu pour Coriace, dans l'ordre de priorité actuel.

## Fait

- [x] Déploiement automatique sur GitHub Pages (https://gaetandg.github.io/PPG-marathon/)
- [x] Application installable (PWA), fonctionne hors ligne
- [x] Nettoyage du code issu d'AI Studio, découpage en composants
- [x] Réécriture de tous les textes : tutoiement, ton sobre et direct
- [x] Nom : **Coriace · Renfo pour coureurs**

## À faire

### Identité visuelle
- [ ] Logo (l'icône actuelle est provisoire)
- [ ] Direction artistique : couleurs, typographies, remplacement des emojis-icônes (matériel, parties du corps) par de vraies icônes

### Guidage audio
- [ ] Voix qui annonce le prochain exercice pendant les pauses (synthèse vocale du navigateur, voix française)
- [ ] Comptes à rebours vocaux avant le début et avant la fin de chaque exercice
- [ ] Réglages pour activer ou couper chaque élément sonore
- [ ] Garder l'écran allumé pendant la séance (Wake Lock API)
- [ ] Corriger la durée réelle des séances : les 30 s ajoutées à chaque changement de tour font dépasser la durée choisie (une séance de 45 min dure environ 47 min)

### Exercices
- [ ] Revoir la liste des exercices en s'appuyant sur ce que proposent les références (apps, coachs, études) : s'assurer que chaque exercice est fiable et utile pour un coureur
- [ ] Classer les exercices par thème dans la liste (mollets, adducteurs, gainage, etc.)

### Séances
- [ ] Proposer des séances toutes faites et cohérentes, en plus de la génération aléatoire

### Préférences
- [ ] Se souvenir des préférences de l'utilisateur d'une fois sur l'autre (matériel, rythme, durée, exercices cochés, son)

### Plus tard
- [ ] Applications Android et iPhone avec Capacitor (minuteur et voix qui continuent écran verrouillé)
- [ ] Vérifier la disponibilité du nom « Coriace » avant publication sur les stores (marques INPI et EUIPO, classe 9)

## Problèmes connus

- En mode développement uniquement, le minuteur peut sauter un intervalle et doubler les bips (effet du `StrictMode` de React sur la logique du minuteur). À corriger lors du travail sur le guidage audio.
