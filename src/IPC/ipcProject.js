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
var output = require("../utils/output");
var project_1 = require("./../../srv/project");
var output_1 = require("./../utils/output");
var IPCProjects = /** @class */ (function () {
    function IPCProjects() {
        this.modules = ITypesModules_1.modulespays;
    }
    IPCProjects.prototype.start = function () {
        var _this = this;
        output_1._console(output.chalk.greenBright.bold('IPCProjects - Start'), output.chalk.bgWhiteBright.green('Ok'));
        // Définition des évènements
        electron_1.ipcMain.on('create-project', function (event, data) {
            _this.createProjectFile(event, data);
        });
    };
    // Méthodes ....
    IPCProjects.prototype.createProjectFile = function (event, data) {
        output._console(output.chalk.redBright('create-project'), data);
        var module = ITypesModules_1.modulespays.modulesPays.filter(function (m) {
            return m.pays === data.pays;
        });
        var moduleImport = module[0].import.filter(function (imp) {
            return imp.nom === data.import;
        });
        var moduleTransfert = module[0].transfert.filter(function (trans) {
            return trans.nom === data.transfert;
        });
        this.projectFile = {
            informations_generales: {
                pays: data.pays,
                folder: path.join("" + data.projectName),
                module_en_cours: 0,
                date_conversion: null,
                date_creation: new Date(),
                page_en_cours: 0,
            },
            module_import: __assign({}, moduleImport[0], { date: null, mode: 0, resultats: [], groupes: [] }),
            module_transfert: __assign({}, moduleTransfert[0], { date: null, mode: 0, resultats: [], groupes: [] }),
        };
        fs.writeFileSync(path.join(data.projectName + "\\commit.pj4"), JSON.stringify(this.projectFile));
        this.createProject(data.projectName);
        event.returnValue = path.join("" + data.projectName);
    };
    IPCProjects.prototype.createProject = function (directory) {
        this.project = new project_1.Project();
        this.project.open(directory);
    };
    return IPCProjects;
}());
exports.IPCProjects = IPCProjects;
//# sourceMappingURL=ipcProject.js.map