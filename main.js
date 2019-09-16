"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var ipcMain_1 = require("./src/IPC/ipcMain");
var ipcProject_1 = require("./src/IPC/ipcProject");
var mainWindow;
var serve;
var ipcFiles;
var ipcProjects;
var args = process.argv.slice(1);
serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
        darkTheme: true,
    });
    ipcFiles = new ipcMain_1.IpcFiles();
    ipcFiles.start();
    ipcProjects = new ipcProject_1.IPCProjects();
    ipcProjects.start();
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron"),
        });
        mainWindow.loadURL('http://localhost:4200');
    }
    else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true,
        }));
    }
    if (serve) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map