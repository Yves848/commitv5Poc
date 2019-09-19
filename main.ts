import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

import { IpcFiles } from './src/IPC/ipcMain';
import { IPCProjects } from './src/IPC/ipcProject';

let mainWindow: BrowserWindow;
let serve: any;
let ipcFiles: IpcFiles;
let ipcProjects: IPCProjects;

const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    darkTheme: true,
  });

  ipcFiles = new IpcFiles(mainWindow);
  ipcFiles.start();

  ipcProjects = new IPCProjects(mainWindow);
  ipcProjects.start();

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

  mainWindow.maximize();

  mainWindow.webContents.openDevTools();

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
