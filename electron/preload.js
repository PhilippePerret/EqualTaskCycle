/**
 * Ce module est nécessaire pour communiquer entre l'application
 * Bun et l'app Electron de l'interface.
 * 
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  bringToFront: () => ipcRenderer.send('bring-to-front')
});