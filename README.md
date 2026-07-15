# Comptage Blackjack

Une application web d'entraînement au comptage de cartes pour le blackjack. Le projet simule un paquet de 52 cartes, affiche les cartes une par une, et propose plusieurs systèmes de comptage pour s'entraîner.

## Fonctionnalités

- Sélection de plusieurs systèmes de comptage :
  - **Hi-Lo**
  - **Hi-Opt II**
  - **Zen Count**
  - **Omega II**
- Affichage du nombre de cartes vues et restants
- Compte courant (`Running Count`) calculé automatiquement
- Section d'estimation du nombre de cartes restantes par catégorie
- Interface clavier :
  - `→` carte suivante
  - `←` carte précédente
  - `Espace` nouvelle partie

## Structure du projet

- `index.html` : page principale de l'application
- `styles.css` / `styles.scss` : styles visuels
- `js/app.js` : logique principale du jeu
- `js/counters/` : définitions des systèmes de comptage
  - `hi-lo.js`
  - `hi-opt-ii.js`
  - `zen-count.js`
  - `omega-ii.js`
  - `index.js`

## Installation et utilisation

1. Ouvrir `index.html` dans un navigateur moderne.
2. Choisir un système de comptage dans le menu déroulant.
3. Cliquer sur **Suivante →** pour révéler la carte suivante.
4. Observer le compteur courant et estimer le nombre de cartes restantes.

> Le projet fonctionne en local sans serveur. Si le navigateur bloque les images distantes, les cartes utilisent un rendu SVG de secours.

## Systèmes de comptage disponibles

### Hi-Lo
- 2 à 6 : +1
- 7 à 9 : 0
- 10 à As : -1
- Système standard simple pour débuter.

### Hi-Opt II
- 2, 3 : +1
- 4, 5 : +2
- 6, 7 : +1
- 8, 9, 10, As : 0
- Système plus précis que Hi-Lo, sans compter les As.

### Zen Count
- 2, 3 : +1
- 4, 5, 6 : +2
- 7 : +1
- 8, 9 : 0
- 10 : -2
- As : -1

### Omega II
- 2, 3 : +1
- 4, 5 : +2
- 6 : +1
- 7, 8 : 0
- 9 : -1
- 10 : -2
- As : 0

## Notes techniques

- Les cartes sont générées dynamiquement dans `js/app.js`.
- Les images sont chargées depuis `https://deckofcardsapi.com/static/img/`.
- Le décompte repose sur les valeurs définies dans chaque système de comptage.

## Licence

Ce projet est libre, adapté pour l'apprentissage et l'entraînement au comptage de cartes.
