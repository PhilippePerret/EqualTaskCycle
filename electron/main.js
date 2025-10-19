const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const { PORT } = require('../common/constants');

let server = null;

const path = require('path');

app.whenReady().then(() => {
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
    width: 600,
    height: 400
  });


  setTimeout(() => win.loadURL(`http://localhost:${PORT}`), 1000);
});

