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
