import { dialog, ipcMain } from 'electron';
import * as fs from 'fs';

import * as output from './../utils/output';

export class IpcFiles {
  start() {
    output._console(output.chalk.greenBright.bold('IPCMain - Start'), output.chalk.bgWhiteBright.green('Ok'));
    ipcMain.on('init-fichier', (event, data) => {
      output._console('IPCMain ts [message]', event, data);
    });

    ipcMain.on('listfiles', (event, data) => {
      output._console('IPCMain ts [message]', data);
      const files = fs.readdirSync(data.path);
      output._console(files);
      event.returnValue = files;
    });

    ipcMain.on('browse-folder', (event, data) => {
      output._console('IPCMain ts [browse-folder]', data);

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
