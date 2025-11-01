# Liste des tests à implémenter

*cette liste présente la liste des tests à implémenter*

## Main panel

### Présence des éléments

- [ ] Il contient bien le travail courant avec ses données (titre, id, content, stop-report, todo, les temps)
- [ ] Les boutons réagissent comme attendus
  - [ ] Le bouton "start" démarre le chronomètre
  - [ ] le bouton "stop" arrête le travail
  - [ ] le bouton "pause" met le travail en pause
  - [ ] le bouton « Projet » permet d’ouvrir le projet
  - [ ] le bouton « Change » permet de changer de travail
- [ ] le bouton « Préférences » ouvre le panneau des préférences
- [ ] le bouton « Editing » ouvre la liste des travaux
- [x] le bouton « Aide » ouvre la fenêtre de l’aide

### Fonctionnement

- [ ] Le bouton « Start » met bien en route le chrono

- [ ] Le bouton « Pause » met le temps en pause

- [ ] Le bouton « Stop » :

  - [ ] arrête le chrono
  - [ ] affiche le rapport d’arrêt

- [ ] L’horloge s’affiche au démarrage

- [ ] Les temps du travail se changent toutes les minutes

  

## Panneau de l’aide

### Présence des éléments

- [ ] Présente les éléments de l’aide
- [ ] Présente un bouton pour fermer l’aide

### Fonctionnement

- [ ] Le bouton « Fermer » permet de fermer l’aide

## Panneau des préférences

### Présence des éléments

- [ ] Affiche toutes les préférences
- [ ] Affiche tous les outils
- [ ] Présente un bouton « Fermer »
- [ ] Présente un bouton « Enregistrer »

### Fonctionnement

- [ ] Le bouton « Fermer » ferme les préférences sans enregistrer
- [ ] Le bouton « Enregistrer » enregistre bien les préférences dans le fichier `prefs.json`
- [ ] Changer le thème le change aussitôt

#### Outils

- [ ] L’outil « Rapport temporel » affiche le rapport temporel
- [ ] La ré-initialisation des cycles remet tout à zéro
- [ ] Le bouton de production du manuel le produit (bonne langue)
- [ ] Le bouton d’ouverture du manuel l’ouvre (bonne langue)

## Panneau d’édition des travaux

### Présence des éléments

- [ ] Affiche le titre avec le nombre de travaux (total, actifs/inactifs)
- [ ] Affiche un div de formulaire par travail
- [ ] Le div de formulaire contient les bons éléments
- [ ] Présente un bouton « + »
- [ ] Présente un bouton « Finir »
- [ ] Présente un bouton « Enregistrer »
- [ ] Présente un lien d’aide pour rejoindre le site pour établir le Cron

### Fonctionnement

- [ ] Le bouton « + » permet d’ajouter un travail
- [ ] Le menu actif active et désactive le travail (aspect)
- [ ] La flèche pour monter un travail le monte
- [ ] la flèche pour descendre un travail le descend
- [ ] le bouton pour supprimer le travail affiche une boite de confirmation
- [ ] Le bouton « Finir » ferme le panneau si aucune modification/création/suppression
- [ ] Le bouton « Finir » affiche une boite de confirmation si modification/création/suppression
- [ ] Le bouton « Enregistrer » enregistre la nouvelle liste (création + suppression + ordre)
- [ ] Le champ « cron » affiche tout de suite un message d’erreur s’il est mauvai
- [ ] Le champ « cron » affiche tout de suite la prochaine échéance (quand il est correct)

### Enregistrement

- [ ] Affiche toutes les erreurs rencontrées en mettant les champs en évidence
- [ ] Produit une erreur si l’identifiant existe déjà
- [ ] Produit une erreur si le titre du projet n’existe pas
- [ ] Produit une erreur si le titre du projet existe déjà
- [ ] Produit une erreur si le dossier n’existe pas
- [ ] Produit une erreur si le script est défini mais n’existe pas
- [ ] Produit une erreur si le cron est mal défini