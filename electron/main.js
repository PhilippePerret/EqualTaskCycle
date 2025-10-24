const { existsSync, writeFileSync, unlinkSync, readFileSync } = require('fs');
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const { HOST } = require('../public/js/constants');
const userDataPath = app.getPath('userData');

let server = null;

const path = require('path');

const ICON_PATH = path.join(path.resolve(__dirname, 'icon.png'));

if (existsSync(ICON_PATH)) {
  // console.log("Icon path: ", ICON_PATH);
} else {
  throw new Error("Unfound icon");
}

app.name = "Equal Task Cycle";

app.whenReady().then(() => {
  app.dock.setIcon(ICON_PATH);
  const serverPath = path.join(__dirname, '..', 'server.ts');
  server = spawn('bun', ['run', serverPath], {
    cwd: path.join(__dirname, '..'),
    env: { 
      ...process.env, 
      USER_DATA_PATH: userDataPath,
      APP_ICON_PATH: ICON_PATH
    }
  });
  
  if (server) {
    server.stdout.on('data', (data) => console.log(`SERVER STDOUT: ${data}`));
    server.stderr.on('data', (data) => console.error(`SERVER STDERR: ${data}`));
    server.on('error', (err) => console.error('SERVER FAILED TO START:', err));
    server.on('exit', (code) => console.log('SERVER EXITED WITH CODE:', code));
  }

  const WITH_CONSOLE_DEV = true;
  
  const win = new BrowserWindow({
    x: 10,
    y: WITH_CONSOLE_DEV ? 400 : 800,
    height: WITH_CONSOLE_DEV ? 1000 : 600,
    width: 800,
    // width: 1200, // Pour console
    icon: ICON_PATH,
    /** Pour le preload qui doit permettre la communication
     *  entre les éléments pour mettre la fenêtre au premier
     *  plan
     */
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true
      }    
  });
  WITH_CONSOLE_DEV && win.webContents.openDevTools({ mode: 'bottom' });

  // Pour mettre au premier plan (communication IPC)
  const { ipcMain } = require('electron');
  ipcMain.on('bring-to-front', () => {
    bringToFront();
  });

  function bringToFront() {
    app.focus({ steal: true });
    win.show();
    win.focus();
  }

  setTimeout(() => win.loadURL(HOST), 1000);

  // setTimeout(() => bringToFront(), 5000);

});

/**
 * Quand on quitte l'application (donc Electron), il faut aussi
 * quitter le processus Bun de l'application (le serveur).
 */
app.on('before-quit', () => {
  if (server && server.pid) {
    try {
      // Tuer le groupe de processus entier
      process.kill(-server.pid, 'SIGTERM');
    } catch(e) {
      console.error('Error killing server:', e);
    }
  }
});