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
var childprocess = require("child_process");
var electron_1 = require("electron");
var fs = require("fs-extra");
var firebird = require("node-firebird");
var path = require("path");
var output_1 = require("../src/utils/output");
function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < array.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, callback(array[index], index, array)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    index++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var Project = /** @class */ (function () {
    function Project() {
        this.C_CHEMIN_BASE = path.resolve(__dirname + "\\..");
        this.C_CHEMIN_BASE_SCRIPT_SQL = this.C_CHEMIN_BASE + "\\sql";
        this.C_OPTIONS_PHA = {
            host: '127.0.0.1',
            port: 3050,
            database: '\\PHA3.FDB',
            user: 'SYSDBA',
            password: 'masterkey',
            lowercase_keys: false,
            role: null,
            pageSize: 4096,
            commit: null,
        };
        this.log = new output_1.LogBase();
        this.log.info('Project Object créé', this.C_OPTIONS_PHA);
    }
    Project.prototype.execFile = function (fichier, params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            childprocess.execFile("" + fichier, params, function (error, stdout, stderr) {
                                _this.log.log("execFile " + fichier + " : " + stdout);
                                resolve();
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    Project.prototype.executeScript = function (username, password, sql, db) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var p;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    p = ['-u', username, '-p', password];
                                    if (db) {
                                        p.push(db);
                                    }
                                    Array.prototype.push.apply(p, ['-i', sql]);
                                    electron_1.ipcMain.emit('message', { message: sql });
                                    return [4 /*yield*/, this.execFile(this.C_CHEMIN_BASE + "\\fb3\\isql.exe", p)];
                                case 1:
                                    _a.sent();
                                    this.log.info("Execution du script " + sql);
                                    //output._console(output.chalk.blueBright(new Date().toISOString()), `Execution du script ${sql}`);
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Project.prototype.executeDirectoryScripts = function (db, username, password, directory) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var files;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(directory && fs.pathExistsSync(directory))) return [3 /*break*/, 2];
                                    files = fs.readdirSync(directory);
                                    return [4 /*yield*/, asyncForEach(files, function (file) { return __awaiter(_this, void 0, void 0, function () {
                                            var sql;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        sql = directory + '\\' + file;
                                                        if (!!fs.statSync(sql).isDirectory()) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, this.executeScript(username, password, sql, db)];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Project.prototype.executeScripts = function (pha) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var chemindb;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.log.log('executeScripts');
                                    chemindb = pha.database;
                                    return [4 /*yield*/, this.executeDirectoryScripts(chemindb, pha.user, pha.password, this.C_CHEMIN_BASE_SCRIPT_SQL)];
                                case 1:
                                    _a.sent();
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Project.prototype.createDatabase = function (pha) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            this.log.info('Creation DB');
                            //output._console(output.chalk.blueBright('Creation DB'));
                            firebird.create(pha, function (err, db) {
                                _this.log.info('Database Created', pha.database, output_1.chalk.greenBright.bold('OK'));
                                /* output._console(
                                  output.chalk.blueBright('database created'),
                                  output.chalk.redBright.bold.underline(pha.database),
                                  output.chalk.greenBright.blue('OK')
                                ); */
                                resolve();
                            });
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    Project.prototype.getTreatments = function (type, module) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var m, m2;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    m = JSON.parse(fs.readFileSync(this.C_CHEMIN_BASE + "/modules/" + type + "/" + module + "/" + module + ".json").toString());
                                    m2 = [];
                                    return [4 /*yield*/, asyncForEach(m, function (p) {
                                            var traitements;
                                            traitements = JSON.parse(fs.readFileSync(_this.C_CHEMIN_BASE + "/modules/" + type + "/" + module + "/" + p.traitements).toString());
                                            m2.push({
                                                libelle: p.libelle,
                                                Suppression: p.Suppression,
                                                traitements: traitements,
                                            });
                                        })];
                                case 1:
                                    _a.sent();
                                    resolve(m2);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Project.prototype.open = function (directory) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var pha, _a, _b, error_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    pha = __assign({}, this.C_OPTIONS_PHA);
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 6, , 7]);
                                    pha.database = "" + directory + pha.database;
                                    pha.commit = JSON.parse(fs.readFileSync(directory + "\\commit.pj4").toString());
                                    this.log.info('Pha Created');
                                    //output._console(output.chalk.blueBright('Pha created'));
                                    _a = pha.commit.module_import;
                                    return [4 /*yield*/, this.getTreatments('import', pha.commit.module_import.nom)];
                                case 2:
                                    //output._console(output.chalk.blueBright('Pha created'));
                                    _a.groupes = _c.sent();
                                    _b = pha.commit.module_transfert;
                                    return [4 /*yield*/, this.getTreatments('transfert', pha.commit.module_transfert.nom)];
                                case 3:
                                    _b.groupes = _c.sent();
                                    pha.commit.informations_generales.folder = directory;
                                    this.log.info('Pha Loaded');
                                    //output._console(output.chalk.redBright('Pha loaded'));
                                    return [4 /*yield*/, this.createDatabase(pha)];
                                case 4:
                                    //output._console(output.chalk.redBright('Pha loaded'));
                                    _c.sent();
                                    return [4 /*yield*/, this.executeScripts(pha)];
                                case 5:
                                    _c.sent();
                                    resolve(pha);
                                    return [3 /*break*/, 7];
                                case 6:
                                    error_1 = _c.sent();
                                    reject(error_1);
                                    return [3 /*break*/, 7];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Project.prototype.execute = function (directory, type, id) {
        return __awaiter(this, void 0, void 0, function () {
            var prj;
            return __generator(this, function (_a) {
                this.open(directory).then(function (pha) { return (prj = pha); });
                return [2 /*return*/];
            });
        });
    };
    return Project;
}());
exports.Project = Project;
//# sourceMappingURL=project.js.map