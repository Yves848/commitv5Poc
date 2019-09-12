const { ipcMain } = require('electron');
const fs = require('fs');
const _console = console.log;

ipcMain.on('init-fichier', (event, data) => {
  _console('IPCMain [message]', event, data);
})

ipcMain.on('listfiles', (event, data) => {
  _console('IPCMain [message]', data);
  const files = fs.readdirSync(data.path);
  _console(files);
  event.returnValue = files;
})



