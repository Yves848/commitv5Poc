"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Chalk = require("ansi-colors");
var figlet = require("figlet");
// tslint:disable-next-line: variable-name
exports._console = console.log;
exports.chalk = Chalk;
exports.colorText = function (text, color) {
    return color(text);
};
exports.bigText = function (text, color) {
    if (color === void 0) { color = 'white'; }
    figlet(text, function (error, data) {
        if (error) {
            return process.exit(1);
        }
        exports._console(exports.chalk[color](data));
    });
};
exports.smallText = function (text, color) {
    if (color === void 0) { color = 'white'; }
    exports._console(exports.chalk[color](text));
};
var LogBase = /** @class */ (function () {
    function LogBase() {
    }
    LogBase.prototype.log = function (message) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        console.log.apply(console, [exports.chalk.white.bgBlack(new Date().toISOString()), message].concat(params));
    };
    LogBase.prototype.warning = function (message) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        console.log.apply(console, [exports.chalk.red.bgBlack(new Date().toISOString()), message].concat(params));
    };
    LogBase.prototype.error = function (message) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        console.log.apply(console, [exports.chalk.whiteBright.bgRedBright(new Date().toISOString()), message].concat(params));
    };
    LogBase.prototype.info = function (message) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        console.log.apply(console, [exports.chalk.whiteBright.bgGreenBright(new Date().toISOString()), message].concat(params));
    };
    return LogBase;
}());
exports.LogBase = LogBase;
//# sourceMappingURL=output.js.map