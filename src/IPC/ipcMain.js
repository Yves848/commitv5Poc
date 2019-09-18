"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("fs");
var _console = console.log;
var IpcFiles = /** @class */ (function () {
    function IpcFiles() {
    }
    IpcFiles.prototype.start = function () {
        console.log('IPCFiles start');
        electron_1.ipcMain.on('init-fichier', function (event, data) {
            _console('IPCMain ts [message]', event, data);
        });
        electron_1.ipcMain.on('listfiles', function (event, data) {
            _console('IPCMain ts [message]', data);
            var files = fs.readdirSync(data.path);
            _console(files);
            event.returnValue = files;
        });
        electron_1.ipcMain.on('browse-folder', function (event, data) {
            _console('IPCMain ts [browse-folder]', data);
            var options = {
                title: 'Choisir le répertoire pour le projet',
                defaultPath: data.path,
                properties: ['createDirectory', 'openDirectory', 'openFile', 'promptToCreate'],
            };
            var file = electron_1.dialog.showSaveDialogSync(null, options);
            event.returnValue = file;
        });
    };
    return IpcFiles;
}());
exports.IpcFiles = IpcFiles;
//# sourceMappingURL=ipcMain.js.map