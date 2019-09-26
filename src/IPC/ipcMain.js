"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("fs");
var output_1 = require("./../utils/output");
var IpcFiles = /** @class */ (function () {
    function IpcFiles(mainWindow) {
        this.mainWindow = mainWindow;
        this.log = new output_1.LogBase();
    }
    IpcFiles.prototype.start = function () {
        var _this = this;
        this.log.info('IPCMain - Start', output_1.chalk.bgWhiteBright.green('Ok'));
        electron_1.ipcMain.on('init-fichier', function (event, data) {
            _this.log.log('IPCMain ts [message]', event, data);
        });
        electron_1.ipcMain.on('listfiles', function (event, data) {
            _this.log.log('IPCMain ts [message]', data);
            var files = fs.readdirSync(data.path);
            event.returnValue = files;
        });
        electron_1.ipcMain.on('get-files', function (event, data) {
            var path = data;
            fs.readdir(path, function (err, files) {
                files.forEach(function (file) {
                    event.reply('new-file', file);
                });
            });
        });
        electron_1.ipcMain.on('browse-folder', function (event, data) {
            _this.log.log('IPCMain ts [browse-folder]', data);
            var options = {
                title: 'Choisir le répertoire pour le projet',
                defaultPath: data.path,
                properties: ['createDirectory', 'openDirectory'],
            };
            var file = electron_1.dialog.showOpenDialogSync(null, options);
            if (file) {
                event.returnValue = file[0];
            }
            else {
                event.returnValue = undefined;
            }
        });
        electron_1.ipcMain.on('quit', function (event, data) {
            electron_1.app.quit();
        });
    };
    return IpcFiles;
}());
exports.IpcFiles = IpcFiles;
//# sourceMappingURL=ipcMain.js.map