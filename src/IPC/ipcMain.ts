import { BrowserWindow, dialog, ipcMain } from 'electron';
import * as fs from 'fs';

import { chalk, LogBase } from './../utils/output';

export class IpcFiles {
  log: LogBase;

  constructor(private mainWindow: BrowserWindow) {
    this.log = new LogBase();
  }

  start() {
    this.log.info('IPCMain - Start', chalk.bgWhiteBright.green('Ok'));
    ipcMain.on('init-fichier', (event, data) => {
      this.log.log('IPCMain ts [message]', event, data);
    });

    ipcMain.on('listfiles', (event, data) => {
      this.log.log('IPCMain ts [message]', data);
      const files = fs.readdirSync(data.path);
      event.returnValue = files;
    });

    ipcMain.on('browse-folder', (event, data) => {
      this.log.log('IPCMain ts [browse-folder]', data);

      const options: Electron.OpenDialogSyncOptions = {
        title: 'Choisir le répertoire pour le projet',
        defaultPath: data.path,
        properties: ['createDirectory', 'openDirectory'],
      };
      const file = dialog.showOpenDialogSync(null, options);
      event.returnValue = file[0];
    });
  }
}
