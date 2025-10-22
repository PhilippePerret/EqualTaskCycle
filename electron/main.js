const { existsSync, writeFileSync, unlinkSync, readFileSync } = require('fs');
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const { HOST } = require('../public/js/constants');
const userDataPath = app.getPath('userData');

let server = null;

const path = require('path');

const pidPath = path.join(userDataPath, 'serverPID'); // to kill it
const ICON_PATH = path.join(path.resolve(__dirname, 'icon.png'));

if (existsSync(ICON_PATH)) {
  // console.log("Icon path: ", ICON_PATH);
} else {
  throw new Error("Unfound icon");
}

app.name = "Equal Task Cycle";

// If old pid exists, try to kill it again
if (existsSync(pidPath)) {
  const oldPid = readFileSync(pidPath, 'utf8');

  try { 
    process.kill(oldPid, 'SIGTERM'); 
  } catch(e) {
    // Ignore this error
    if (e.code !== 'ESRCH') {
      console.error('Error when kill the old pid', e);
    }
  }

  unlinkSync(pidPath);
}

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

    writeFileSync(pidPath, server.pid.toString());

    server.stdout.on('data', (data) => console.log(`SERVER STDOUT: ${data}`));
    server.stderr.on('data', (data) => console.error(`SERVER STDERR: ${data}`));

  }
  
  const win = new BrowserWindow({
    x: 10,
    y: 800,
    width: 800,
    // width: 2000, // Pour console
    height: 600,
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