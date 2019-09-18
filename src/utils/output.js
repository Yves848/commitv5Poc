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
//# sourceMappingURL=output.js.map