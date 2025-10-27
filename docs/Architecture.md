# Architecture de l’application

## Démarrage

Au lancement :

| Fichier/module |                     | Description                                                  |
| -------------- | ------------------- | ------------------------------------------------------------ |
| main.js        |                     | Démarre Electron                                             |
| =>             | Spawn **server.ts** | Qui charge express, définit les routes etc.                  |
| =>             | **win.loadURL**     | Charge HOST après une seconde                                |
| GET /          |                     | Initie les locales (côté serveur), traduit la page HTML et la retourne (= réponse serveur). |

