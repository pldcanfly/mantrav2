'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestView = exports.get = exports.name = void 0;
const tslib_1 = require("tslib");
const user_1 = require("../models/system/user");
exports.name = 'TestView';
const get = function (req, res, flowspace) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return yield user_1.User.getAllUsers();
    });
};
exports.get = get;
exports.TestView = { get: exports.get, name: exports.name };
