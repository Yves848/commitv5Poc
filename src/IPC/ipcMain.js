"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("fs");
var output = require("./../utils/output");
var IpcFiles = /** @class */ (function () {
    function IpcFiles() {
    }
    IpcFiles.prototype.start = function () {
        output._console(output.chalk.greenBright.bold('IPCMain - Start'), output.chalk.bgWhiteBright.green('Ok'));
        electron_1.ipcMain.on('init-fichier', function (event, data) {
            output._console('IPCMain ts [message]', event, data);
        });
        electron_1.ipcMain.on('listfiles', function (event, data) {
            output._console('IPCMain ts [message]', data);
            var files = fs.readdirSync(data.path);
            output._console(files);
            event.returnValue = files;
        });
        electron_1.ipcMain.on('browse-folder', function (event, data) {
            output._console('IPCMain ts [browse-folder]', data);
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