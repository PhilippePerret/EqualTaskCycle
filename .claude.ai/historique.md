# Historique de travail - EqualTaskCycle

## 2025-10-20

### Problème identifié
- La route `/task/current` n'était jamais atteinte
- Le serveur plantait au démarrage à cause de `userDataPath` undefined
- `userDataPath` dépend de `process.env.USER_DATA_PATH` qui n'est défini que par Electron

### Vraie explication
- Le problème était que tu testais `bun run server.ts` directement, ce qui plantait à cause de `userDataPath` undefined
- Mais l'application est conçue pour être lancée uniquement avec `bun run start` depuis le dossier electron/
- Avec la bonne méthode, tout fonctionne : les tâches se chargent et la route `/task/current` est accessible

### Vraie cause trouvée
- Bun cache la compilation du serveur TypeScript
- Les modifications de `server.ts` n'étaient pas prises en compte à cause du cache
- Il fallait tuer les processus bun pour forcer la recompilation

### Solution
- Tuer les processus : `pkill -f "bun.*server"`
- Attention : `pkill -f "Electron"` ferme aussi VSCode (app Electron)

## Problème marked
- Installation de `marked` pour traitement markdown
- Problème : texte traité comme code au lieu de paragraphes
- Cause : indentation dans les template literals (backticks)
- Solution : retirer l'indentation du markdown

## Mise en place IPC pour bringToFront
- Objectif : mettre la fenêtre Electron au premier plan depuis le client
- Création de `electron/preload.js` avec contextBridge
- Modification de `main.js` : ajout webPreferences et listener IPC
- Exposition de `window.electronAPI.bringToFront()` côté client
- Test réussi avec setTimeout

## Système de vérification d'activité (ActivityTracker)
- Objectif : vérifier que l'utilisateur travaille encore sur le projet
- Création de `lib/activityTracker.ts` : parcours récursif des dossiers, gestion symlinks, détection boucles
- Création du Worker : `lib/ActivityTracker_worker.ts` avec API Worker Bun
- Rationalisation du code : deux fichiers principaux (lib et public)
- Dialog déplacé côté serveur (utilise osascript via Bun.$)
- Route `/work/check-activity` : vérifie activité + affiche dialog si inactif
- Correction bug majeur : dialog affiché systématiquement au lieu de seulement si isActive=false
- Solution cache Bun : `sudo pkill -f "bun.*server"` nécessaire pour recompilation
- Système fonctionnel : détecte l'inactivité et demande confirmation utilisateur
- TODO : Côté client, interrompre le travail si pas de confirmation
