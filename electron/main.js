const { existsSync } = require('fs');
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const { PORT } = require('../common/constants');

let server = null;

const path = require('path');

const ICON_PATH = path.join(path.resolve(__dirname, 'icon.png'));
// const ICON_PATH = path.join(path.resolve(__dirname, 'icon.icns'));
if (existsSync(ICON_PATH)) {
  console.log("Icon path: ", ICON_PATH);
} else {
  throw new Error("Unfound icon");
}

app.name = "Equal Task Cycle";

app.whenReady().then(() => {
  app.dock.setIcon(ICON_PATH);
  const serverPath = path.join(__dirname, '..', 'index.ts');
  server = spawn('bun', ['run', serverPath], {
    cwd: path.join(__dirname, '..')
  });
  
  if (server) {
    server.stdout.on('data', (data) => console.log(`SERVER STDOUT: ${data}`));
    server.stderr.on('data', (data) => console.error(`SERVER STDERR: ${data}`));
  }
  
  const win = new BrowserWindow({
    x: 10,
    y: 800,
    width: 800,
    // width: 2000,
    height: 600,
    icon: ICON_PATH
  });


  setTimeout(() => win.loadURL(`http://localhost:${PORT}`), 1000);
});

