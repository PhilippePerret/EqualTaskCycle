# Equal Task Cycle (ETC) 

**ETC** est une application qui permet de travailler un ensemble de tâches en leur alouant un temps afin de les exécuter toutes parallèlement sans en délaisser.

Par exemple, si nous avons 5 tâches, et un temps par défaut de 2 heures, les tâches seront proposées dans le désordre, jusqu'à ce que chacune ait été accomplie pendant au moins 2 heures avant que le cycle ne recommence.

## Mode Electron

Pour pouvoir enrouler l’application à l’intérieur d’une application *Electron*, nous avons besoin de mettre son code dans le dossier `./Electron`. Il faut donc veiller à être dans le bon dossier lorsqu’on joue une commande.

Voici un petit rappel :

| À la racine DE L’APPLICATION |                                                              | Dans le dossier Electron |
| ---------------------------- | :----------------------------------------------------------: | ------------------------ |
| **`bun run watch_ts`**       | Pour surveiller les fichiers `ts`<br />du dossier `./public` |                          |
|                              |       Pour lancer l’application en mode développement.       | **`bun run start`**      |
|                              |   Pour produire la release<br />(ne fonctionne pas encore)   | **`bun run build`**      |
|                              |                                                              |                          |



## Lancer en mode développement

* rejoindre le dossier `electron/` (**`cd electron/`**)
* jouer la commande **`bun run start`**

Pour lancer un watcher sur les fichiers `public/main.ts` et `public/ui.ts` (et les futurs modules peut-être), jouer (à la racine de l’application) : 

~~~shell
bun run watch_ts
~~~



## Fonctionnement au quotidien

* Mettre dans un fichier `TASKS.yaml`, à l’extérieur de l’application, les tâches courantes, en définissant leur dossier principal ou le script qui doit être joué pour les "lancer".
* Définir le temps par défaut en haut du fichier.
* Lancer ETC au démarrage de l'ordinateur (si possible dans le dossier contenant le fichier des tâches, sinon avec un chemin d’accès complet précisant où il se trouve).

## Aspect du fichier `_TASKS_`.yaml

~~~yaml
---
duration: 120 # nombre de minutes par défaut pour chaque tâche

works:
  - id: pss
    project: "Passé sous Silence"
    content: "Travailler sur le deuxième Tome"
    duration: 180 # Possibilité de mettre un durée propre, pour travail + ou - une tâche
    folder: '/Users/philippeperret/ICARE_EDITIONS/_LIVRES_/Fictions/Passé sous silence'
  - id: dico
    project: "Grand Dictionnaire du Scénario"
    content: "Développer les exemples et l'interface"
    folder: /Users/philippeperret/ICARE_EDITIONS/_LIVRES_/Narration/Dictionnaire
    script: path/to/startud-script
  - id: idml
    project: "IDML-Générateur"
    content: "Poursuivre le développement"
    folder: "/Users/philippeperret/Programmes/IDML-APGenerator"
  - id: pmail
    project: "Perfect-Mail"
    content: "Poursuivre le développement"
    folder: '/Users/philippeperret/Programmes/Perfect-Mail'
  - id: preludes
    project: "Préludes de Bach"
    content: "Poursuivre la com"
    folder: '/Users/philippeperret/ICARE_EDITIONS/_LIVRES_/Musique/Partitions/Recueils/Les plus beaux préludes de Bach'
  - id: oubliettes
    name: "Le Rayon aux oubliettes"
    content: "Poursuivre le livre"
    folder: '/Users/philippeperret/pCloud Drive/Ecriture/Romans/Le Rayon aux oubliettes'


~~~

### Ajout d’une tâche

Pour qu’une tâche devienne « prioritaire » (juste être exécutée avant les autres), quand on n’est pas en mode aléatoire, il faut la mettre le plus au-dessus des autres possible.

#### Détail des paramètres

| Nom           | description                                                  | notes                                                        |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| id            | Identifiant de la tâche                                      | Très important car sert à identifier la tâches/le travail partout dans le programme. |
| project       | Nom du projet auquel appartient la tâche                     |                                                              |
| content       | Le contenu proprement dit de la tâche, donc ce qu’il faut faire. | Le texte peut être assez long et suffisamment informatif pour |
| duration      | Optionnellement, la durée de travail par cycle               | Par essence, chaque tâche devrait se voir affecter le même temps de travail. Mais cette donnée permet de donner plus d’importance à certaines tâches. |
| folder        | Dossier du projet                                            | Ce dossier peut être ouvert à l’aide du bouton « Folder » de l’interface. |
| script | Script de démarrage du projet                                | Permet de lancer un script de démarrage (par exemple pour créer automatiquement une nouvelle version d’un fichier, simplement en cliquant sur le bouton « Script » de l’interface.<br />Il faut penser à le rendre exécutable en jouant la commande `chmod +x path/to/script`. |
| active        | [Optionnel] true si la tâche est active                      | Par défaut, c’est true, mais permet de désactiver un travail sans le retirer du fichier |
|               |                                                              |                                                              |

​	

### Mode aléatoire

Par défaut, les tâches sont proposées dans un ordre aléatoire (pour épicer les journées). On peut désactiver ce comportement dans les préférences, en décochant la case « ordre aléatoire » (ou similaire).

## Annexe

En développement, il faut parfois détruire les processus :

~~~shell
sudo pkill -f "bun.*server"
~~~

