# Historique des actions - Problème de port

## Objectif initial
Changer le port de développement (3002) et production (3003) dans l'application

## Actions effectuées

### 1. Tentatives de centralisation des ports
- Créé `electron/ports.json` avec ports dev/prod
- Créé `electron/config.js` (CommonJS)
- Modifié `lib/server/constants_server.ts`
- **RÉSULTAT** : Échec, serveur ne démarre pas en production

### 2. Découverte du vrai problème
- `lib/shared/utils.ts` importe `public/js/constants.js` qui utilise `window`
- Quand le serveur charge ce module, crash car `window` n'existe pas côté serveur
- **PROBLÈME** : Ce n'était pas lié au port mais à l'architecture client/serveur

### 3. Problème découvert en production
- Serveur ne trouve pas `express` : "Cannot find package 'express'"
- Seul `better-sqlite3` était dans `node_modules` dépacké
- **SOLUTION TENTÉE** : Ajout `"node_modules/**/*"` dans `asarUnpack`

### 4. Nouveau problème après ajout node_modules dans asarUnpack
- En déplaçant l'app dans `/Applications`, erreur de chemin
- `path.resolve('.')` dans `routes.ts` pointe vers le mauvais dossier
- **NON RÉSOLU**

### 5. Tentative de réparation via git reset
- `git reset --hard ea9118f55c9e3fc443f54a88f9a81a7357cb059e`
- Suppression de `node_modules` pour réinstaller proprement
- **NOUVEAU PROBLÈME** : `bun install` échoue car `postinstall` ne trouve pas Electron

### 6. État actuel
- Commit restauré : `ea9118f55c9e3fc443f54a88f9a81a7357cb059e`
- `node_modules` supprimé
- `package.json` n'a jamais eu Electron en devDependencies
- `postinstall` exécute `electron-builder install-app-deps` qui échoue
- Electron installé globalement via `npm install -g electron` mais `electron-builder` ne le trouve pas

## Actions déjà tentées (NE PAS RÉPÉTER)
- ✗ Commenter/décommenter `postinstall` 
- ✗ Supprimer et réinstaller `node_modules/electron`
- ✗ Installer Electron globalement
- ✗ Ajouter puis retirer Electron des devDependencies

## Solution à tester
Ajouter définitivement `electron` en devDependencies dans `package.json` car `electron-builder` le cherche là

## Notes chronologiques

### 2025-10-31 18:36 - Tentative lancement app depuis terminal
- Commande : `/Applications/ETC.app/Contents/MacOS/ETC`
- **Résultat : AUCUNE SORTIE, AUCUNE ERREUR**
- L'app ne démarre pas du tout

### 2025-10-31 18:37 - Vérification Gatekeeper
- `xattr -l /Applications/ETC.app` : seulement `com.apple.provenance`, pas de quarantaine
- Pas de blocage par le système

### 2025-10-31 18:38 - Comparaison apps
- Diff entre `/Applications/ETC-OK.app` (qui marche) et `/Applications/ETC.app` (qui ne marche pas)
- Différences : version (0.4.2 vs 0.4.16), fichier `app [conflicted].asar`, fichiers build de better-sqlite3

### 2025-10-31 18:42 - Suppression fichier conflicted
- `rm "/Applications/ETC.app/Contents/Resources/app [conflicted].asar"`
- **Résultat : AUCUN CHANGEMENT**, l'app ne démarre toujours pas

### 2025-10-31 18:46 - Comparaison binaires
- `otool -L` sur les deux apps : **IDENTIQUES**
- Le linking n'est pas le problème

### 2025-10-31 18:50 - DÉCOUVERTE CRUCIALE
**Comportement étrange du déplacement :**
1. Build de l'app → elle se trouve dans `dist/mac-arm64/ETC.app`
2. Lancement depuis `dist/` → **ÇA MARCHE**
3. **DÉPLACEMENT** (mv, pas cp) vers `/Applications/` → **ÇA NE MARCHE PLUS**
4. Si je reprends l'app depuis `/Applications/` et la **REDÉPLACE** dans `dist/` → **ÇA NE REMARCHE PLUS**

**Conclusion : Le simple fait de DÉPLACER l'app la casse définitivement**

Ce n'est PAS un problème d'emplacement ou de permissions, c'est le déplacement lui-même qui corrompt l'app.

**IMPORTANT** : L'APPLICATION FONCTIONNAIT PARFAITEMENT AVANT AVEC CE MÊME CODE.
LE SEUL CHANGEMENT : `node_modules` a été supprimé et réinstallé avec Electron 38.3.0.
Aucune modification du code source (electron/main.js, etc.).

### 2025-10-31 18:59 - Nouveau test après rebuild complet
1. `bun run build` → réussi
2. Lancement depuis `dist/` → **FONCTIONNE**
3. Déplacement vers `/Applications/` → **FONCTIONNE**
4. Quit et relance → **FONCTIONNE**

**MAIS** : L'app utilise le port **3002** (dev) au lieu de **3003** (prod)

**Le problème des ports n'est toujours PAS résolu**

### État actuel 19:02
- Electron 38.3.0 installé
- App se lance correctement depuis `/Applications/`
- **PROBLÈME** : App en production utilise le port 3002 au lieu de 3003

**RAPPEL IMPORTANT** : 
On est revenu au commit `ea9118f55c9e3fc443f54a88f9a81a7357cb059e`.
Dans ce commit, **AUCUNE gestion des ports dev/prod n'existe**.
Aucun code ne définit NODE_ENV, aucun code ne choisit entre port 3002 et 3003.
C'est le commit d'AVANT toutes nos tentatives de changement de port.

**Donc il est NORMAL que l'app utilise 3002, c'est le seul port défini dans ce commit.**
