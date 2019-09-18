import { dialog, ipcMain } from 'electron';
import * as fs from 'fs';

const _console = console.log;

export class IpcFiles {
  start() {
    console.log('IPCFiles start');
    ipcMain.on('init-fichier', (event, data) => {
      _console('IPCMain ts [message]', event, data);
    });

    ipcMain.on('listfiles', (event, data) => {
      _console('IPCMain ts [message]', data);
      const files = fs.readdirSync(data.path);
      _console(files);
      event.returnValue = files;
    });

    ipcMain.on('browse-folder', (event, data) => {
      _console('IPCMain ts [browse-folder]', data);

      const options: Electron.OpenDialogSyncOptions = {
        title: 'Choisir le répertoire pour le projet',
        defaultPath: data.path,
        properties: ['createDirectory', 'openDirectory', 'openFile', 'promptToCreate'],
      };
      const file = dialog.showSaveDialogSync(null, options);
      event.returnValue = file;
    });
  }
}
