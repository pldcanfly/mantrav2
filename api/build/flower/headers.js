'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.flow = exports.name = void 0;
const tslib_1 = require("tslib");
// EXPORTS
exports.name = 'Headers';
const flow = function (req, res, flowspace, next) {
    var _a, _b;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', '*');
        // Deal with OPTIONS request here
        if (((_a = req.method) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == 'options') {
            res.statusCode = 200;
            res.end();
            return;
        }
        // DEAL with TRACE request here
        if (((_b = req.method) === null || _b === void 0 ? void 0 : _b.toLowerCase()) == 'trace') {
            res.end('');
            return;
        }
        next();
    });
};
exports.flow = flow;
exports.default = { flow: exports.flow, name: exports.name };
