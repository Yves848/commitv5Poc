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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
var ITypesModules_1 = require("../models/ITypesModules");
var output_1 = require("../utils/output");
var project_1 = require("./../../srv/project");
var IPCProjects = /** @class */ (function () {
    function IPCProjects(mainWindow) {
        this.mainWindow = mainWindow;
        this.modules = ITypesModules_1.modulespays;
        this.log = new output_1.LogBase();
    }
    IPCProjects.prototype.start = function () {
        var _this = this;
        this.log.info('IPCProjects - Start', output_1.chalk.bgWhiteBright.green('Ok'));
        // Définition des évènements
        electron_1.ipcMain.on('create-project', function (event, data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.log.info('create-project - senderId', event.sender.id);
                this.createProjectFile(event, data);
                return [2 /*return*/];
            });
        }); });
        electron_1.ipcMain.on('open-project', function (event, data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.info('open-project - senderId', event.sender.id);
                        return [4 /*yield*/, this.openProject(event, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    IPCProjects.prototype.openProject = function (event, data) {
        return __awaiter(this, void 0, void 0, function () {
            var project;
            return __generator(this, function (_a) {
                this.log.info('openProject', data);
                project = new project_1.Project(event);
                project.open(data);
                event.reply('popup', { message: "Projet " + data + " ouvert" });
                event.returnValue = project;
                return [2 /*return*/];
            });
        });
    };
    // Méthodes ....
    IPCProjects.prototype.createProjectFile = function (event, data) {
        this.log.info('createProjectFile', data);
        event.reply('progress');
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
        this.createProject(event, data.projectName);
        event.returnValue = path.join("" + data.projectName);
    };
    IPCProjects.prototype.createProject = function (event, directory) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.project = new project_1.Project(event);
                this.project.create(directory);
                return [2 /*return*/];
            });
        });
    };
    return IPCProjects;
}());
exports.IPCProjects = IPCProjects;
//# sourceMappingURL=ipcProject.js.map