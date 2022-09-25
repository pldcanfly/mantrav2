'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersView = exports.del = exports.get = exports.patch = exports.post = exports.name = void 0;
const user_1 = require("../../models/system/user");
const appspace_1 = require("../../appspace");
const zod_1 = require("zod");
exports.name = 'UsersView';
const PostRequest = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string(),
});
const PatchRequest = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string().optional(),
});
const PatchPasswordRequest = zod_1.z.object({
    password: zod_1.z.string(),
});
const post = function (req, res, flowspace) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!((_a = flowspace.session) === null || _a === void 0 ? void 0 : _a.hasPerms('usermanagement'))) {
            res.statusCode = 403;
            return;
        }
        try {
            const user = PostRequest.parse(flowspace.body);
            if (yield user_1.User.getUserByUsername(user.username)) {
                res.statusCode = 500;
                return 'User exists';
            }
            return yield user_1.User.createUser(user.username, user.password);
        }
        catch (e) {
            appspace_1.logger.error(e);
            return;
        }
    });
};
exports.post = post;
const patch = function (req, res, flowspace) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if ((_a = flowspace.params) === null || _a === void 0 ? void 0 : _a.id) {
                if (!((_b = flowspace.session) === null || _b === void 0 ? void 0 : _b.hasPerms('usermanagement'))) {
                    res.statusCode = 403;
                    return;
                }
                const user = PatchRequest.parse(flowspace.body);
                yield user_1.User.updateUser(flowspace.params.id, user);
                if (user.password && user.password != '') {
                    yield user_1.User.setPassword(flowspace.params.id, user.password);
                }
            }
            else {
                if (flowspace.session) {
                    const password = PatchPasswordRequest.parse(flowspace.body);
                    yield user_1.User.setPassword(flowspace.session.user.id.toString(), password.password);
                }
            }
        }
        catch (e) {
            appspace_1.logger.error(e);
            return;
        }
    });
};
exports.patch = patch;
const get = function (req, res, flowspace) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if ((_a = flowspace.params) === null || _a === void 0 ? void 0 : _a.id)
            return;
        return yield user_1.User.getAllUsers();
    });
};
exports.get = get;
const del = function (req, res, flowspace) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!((_a = flowspace.session) === null || _a === void 0 ? void 0 : _a.hasPerms('usermanagement'))) {
            res.statusCode = 403;
            return;
        }
        if ((_b = flowspace.params) === null || _b === void 0 ? void 0 : _b.id) {
            return yield user_1.User.deleteUser(flowspace.params.id);
        }
        return;
    });
};
exports.del = del;
exports.UsersView = { get: exports.get, post: exports.post, patch: exports.patch, del: exports.del, name: exports.name };
