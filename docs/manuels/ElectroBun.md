# Bunapp

« Bunapp » ou « BunApp » est le nom que je donne à ce modèle d’application qui fonctionne sur une base de Bun et d’Electron pour l’interface.

Elle permet une application rapide (Bun/Zig) et entièrement personnalisable au niveau de l’interface (HTML/CSS)

## Fonctionnalités à présenter

*(dans cette section, mettre toutes les fonctionnalités qu’on veut présenter)*

* Fenêtre de dialogue Apple-like synchrone et asynchrone (`Dialog.ts`)
* Gestion des erreurs de formulaire (sur les travaux) avec un changeset un peu comme dans elixir (`this.originalWorks`, `this.modifiedWorks`, `this.changesetWorks`).
* Redémarrage automatique du serveur en cas de panne (arrive souvent).
* Gestion facile des appels serveurs avec **`postToServer`**.

## Packager

~~~shell
bun add -D electron-builder
~~~

Pour configurer electron, dans `package.json`: 

~~~json
"build": {
  "appId": "com.philapp.equaltaskcycle",
  "productName": "Nom de Production",
  "mac": {
    "target": "dmg",
    "icon": "electron/icon.png",
    "identity": null

  },
  "files": [
    "electron/**/*",
    "public/**/*",
    "lib/**/*",
    "server.js",
    "node_modules/**/*"
  ]
}
~~~

> La ligne 7 sert à ne pas authentifier le développeur. Si vous avez un compte développeur Apple, cette ligne peut être supprimée.

Ajouter un script de build (toujours dans `package.json`) :

~~~json
"scripts": {
  ...
  "build": "electron-builder"
}

~~~

Il faut transformer `server.ts` en `server.js` :

~~~shell
bun build ./server.ts --outfile=./server.js --target=node
~~~

Dans `main.js`, il faut remplacer : 

~~~javascript
server = spawn('bun', ['--no-cache', 'run', serverPath], {
~~~

… par : 

~~~javascript
server = spawn('node', ['server.js'], {
~~~



## Monodule

*(construit à l’aide de « mono » et de « module »)*

J’appelle « monodule » des modules qui fonctionne aussi bien côté client que côté serveur, même lorsque leurs imports sont très différents. 

La première tentative (MAIS ÉCHEC MAINTENANT) de *monodule* concerne les outils (`lib/tools`) avec des outils qui lancent des appels côté client et les traitent côté serveur. En fait, dès qu’on a un import, même seulement dans la méthode serveur, ça foire à la compilation (et c’est vraiment trop compliqué de faire que ça fonctionne).

Donc on réserve l’isomophisme aux situations où on n’utilise pas de trucs spécifique à un côté ou un autre seulement.

