//const { ipcMain } = require('electron');
import { ipcMain } from 'electron';
import * as fs from 'fs';

//const fs = require('fs');
const _console = console.log;

export class IpcFiles {
  start() {
    ipcMain.on('init-fichier', (event, data) => {
      _console('IPCMain [message]', event, data);
    });

    ipcMain.on('listfiles', (event, data) => {
      _console('IPCMain [message]', data);
      const files = fs.readdirSync(data.path);
      _console(files);
      event.returnValue = files;
    });
  }
}
