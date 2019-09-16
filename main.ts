import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

import { IpcFiles } from './src/IPC/ipcMain';

let mainWindow: BrowserWindow;
let serve: any;
let ipcFiles: IpcFiles;

const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  ipcFiles = new IpcFiles();
  ipcFiles.start();
  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
    });
    mainWindow.loadURL('http://localhost:4200');
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  if (serve) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
