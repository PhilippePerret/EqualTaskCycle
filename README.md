# Equal Task Cycle (ETC) 

**ETC** est une application qui permet de travailler un ensemble de tâches en leur alouant un temps afin de les exécuter toutes parallèlement sans en délaisser.

Par exemple, si nous avons 5 tâches, et un temps par défaut de 2 heures, les tâches seront proposées dans le désordre, jusqu'à ce que chacune ait été accomplie pendant au moins 2 heures avant que le cycle ne recommence.

## Fonctionnement au quotidien

* Mettre dans le fichier `TASKS.yaml` les tâches courantes, en définissant leur dossier principal ou le script qui doit être joué pour les "lancer".
* Définir le temps par défaut en haut du fichier.
* Lancer ETC au démarrage de l'ordinateur.

## Aspect du fichier `_TASKS_`.yaml

~~~yaml
---
duration: 120 # nombre de minutes par défaut pour chaque tâche

tasks:
  - id: pss
    name: "Passé sous Silence"
    content: "Travailler sur le deuxième Tome"
    duration: 180 # Possibilité de mettre un durée propre, pour travail + ou - une tâche
    folder: '/Users/philippeperret/ICARE_EDITIONS/_LIVRES_/Fictions/Passé sous silence'
  - id: dico
    name: "Grand Dictionnaire du Scénario"
    content: "Développer les exemples et l'interface"
    folder: /Users/philippeperret/ICARE_EDITIONS/_LIVRES_/Narration/Dictionnaire
  - id: idml
    name: "IDML-Générateur"
    content: "Poursuivre le développement"
    folder: "/Users/philippeperret/Programmes/IDML-APGenerator"
  - id: pmail
    name: "Perfect-Mail"
    content: "Poursuivre le développement"
    folder: '/Users/philippeperret/Programmes/Perfect-Mail'
  - id: preludes
    name: "Préludes de Bach"
    content: "Poursuivre la com"
    folder: '/Users/philippeperret/ICARE_EDITIONS/_LIVRES_/Musique/Partitions/Recueils/Les plus beaux préludes de Bach'
  - id: oubliettes
    name: "Le Rayon aux oubliettes"
    content: "Poursuivre le livre"
    folder: '/Users/philippeperret/pCloud Drive/Ecriture/Romans/Le Rayon aux oubliettes'


~~~


## Lancer depuis le code

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
