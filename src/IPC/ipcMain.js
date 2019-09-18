"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("fs");
var output_1 = require("../utils/output");
var IpcFiles = /** @class */ (function () {
    function IpcFiles() {
    }
    IpcFiles.prototype.start = function () {
        output_1.bigText('IPCFiles start');
        electron_1.ipcMain.on('init-fichier', function (event, data) {
            output_1._console('IPCMain ts [message]', event, data);
        });
        electron_1.ipcMain.on('listfiles', function (event, data) {
            output_1._console('IPCMain ts [message]', data);
            var files = fs.readdirSync(data.path);
            output_1._console(files);
            event.returnValue = files;
        });
        electron_1.ipcMain.on('browse-folder', function (event, data) {
            output_1._console('IPCMain ts [browse-folder]', data);
            var options = {
                title: 'Choisir le répertoire pour le projet',
                defaultPath: data.path,
                properties: ['createDirectory', 'openDirectory'],
            };
            var file = electron_1.dialog.showOpenDialogSync(null, options);
            event.returnValue = file[0];
        });
    };
    return IpcFiles;
}());
exports.IpcFiles = IpcFiles;
//# sourceMappingURL=ipcMain.js.map