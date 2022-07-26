'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.flow = exports.name = void 0;
const tslib_1 = require("tslib");
// EXPORTS
exports.name = 'Headers';
const flow = function (req, res, flowspace, next) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', '*');
        next();
    });
};
exports.flow = flow;
exports.default = { flow: exports.flow, name: exports.name };
