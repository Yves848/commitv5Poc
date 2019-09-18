"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
var ITypesModules_1 = require("../models/ITypesModules");
//import * as fs from 'fs';
var _console = console.log;
var IPCProjects = /** @class */ (function () {
    function IPCProjects() {
        this.modules = ITypesModules_1.modulespays;
    }
    IPCProjects.prototype.start = function () {
        var _this = this;
        _console('IPCProjects Start');
        electron_1.ipcMain.on('create-project', function (event, data) {
            _console('create-project', data);
            var module = ITypesModules_1.modulespays.modulesPays.filter(function (m) {
                return m.pays === data.pays;
            });
            var moduleImport = module[0].import.filter(function (imp) {
                return imp.nom === data.import;
            });
            var moduleTransfert = module[0].transfert.filter(function (trans) {
                return trans.nom === data.transfert;
            });
            _this.project = {
                informations_generales: {
                    pays: data.pays,
                    folder: path.join("" + data.projectName),
                    module_en_cours: 0,
                    date_conversion: null,
                    date_creation: new Date(),
                    page_en_cours: 0,
                },
                module_import: __assign({}, moduleImport[0], { date: null, mode: 0, resultats: [] }),
                module_transfert: __assign({}, moduleTransfert[0], { date: null, mode: 0, resultats: [] }),
            };
            _console('module', module);
            _console('project', _this.project);
            fs.writeFileSync(path.join("" + data.projectName), JSON.stringify(_this.project));
            event.returnValue = path.join("" + data.projectName);
        });
    };
    return IPCProjects;
}());
exports.IPCProjects = IPCProjects;
//# sourceMappingURL=ipcProject.js.map