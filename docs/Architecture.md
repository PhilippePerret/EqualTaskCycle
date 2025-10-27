# Architecture de l’application

## Démarrage

Au lancement :

| Fichier/module      | Action              | Description                                                  |
| ------------------- | ------------------- | ------------------------------------------------------------ |
| main.js             |                     | Démarre Electron                                             |
| =>                  | Spawn **server.ts** | Qui charge express, définit les routes etc.                  |
| =>                  | **win.loadURL**     | Charge HOST après une seconde                                |
| GET /               |                     | Initie les locales (côté serveur), traduit la page HTML et la retourne (= réponse serveur). |
|                     | charge **main.js**  | … qui exécute **`client.init()`** pour initialiser l’application. |
| **`client.init()`** | loc.init()          | Pour initialiser les locales en fonction de la langue.       |

​	
