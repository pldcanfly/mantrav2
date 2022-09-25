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
exports.flow = exports.name = void 0;
const user_1 = require("../models/system/user");
const token_1 = require("../models/system/token");
const appspace_1 = require("../appspace");
const acl_1 = require("../models/system/acl");
const zod_1 = require("zod");
const login = function (res, flowspace) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var body = zod_1.z
                .object({
                username: zod_1.z.string(),
                password: zod_1.z.string(),
            })
                .parse(flowspace.body);
        }
        catch (e) {
            appspace_1.logger.error('Auth: Login failed -> No Valid BodyData');
            res.statusCode = 401;
            flowspace.message = 'Wrong Username or Password';
            return;
        }
        if (body) {
            const username = body.username.toLowerCase();
            const password = body.password;
            if (yield user_1.User.checkPassword(username, password)) {
                flowspace.message = yield token_1.Token.issueTokenPairWithCredentials(yield user_1.User.getUserByUsername(username));
            }
            else {
                res.statusCode = 401;
                flowspace.message = 'Wrong Username or Password';
                appspace_1.logger.error('Auth: Login failed -> Invalid Password');
            }
        }
    });
};
const logout = function (req, res, flowspace) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.authorization) {
            flowspace.message = yield token_1.Token.invalidateToken(req.headers.authorization.slice(7)); // Slice "Bearer " off
        }
        else {
            appspace_1.logger.error('Auth: Logout failed -> No Token supplied');
            res.statusCode = 403;
            flowspace.message = 'Token Error';
        }
        return;
    });
};
const refresh = function (req, res, flowspace) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.authorization) {
            const tokenpair = yield token_1.Token.issueTokenPairWithRefresh(req.headers.authorization.slice(7)); // Slice "Bearer " off
            if (tokenpair) {
                flowspace.message = tokenpair;
            }
            else {
                res.statusCode = 403;
                flowspace.message = 'Token Error';
            }
        }
        else {
            appspace_1.logger.error('Auth: Refresh failed -> No Token supplied');
            res.statusCode = 403;
            flowspace.message = 'Token Error';
        }
        return;
    });
};
const createSession = function (req, res, flowspace) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/auth'))) {
            if (req.headers.authorization) {
                const user = yield token_1.Token.validateToken(req.headers.authorization.slice(7));
                if (user) {
                    const perms = yield acl_1.ACL.getPermsForUser(user.id);
                    const roles = yield acl_1.ACL.getRolesForUser(user.id);
                    appspace_1.logger.info(`Session initiated for User ${user.id}, Roles: ${roles}`);
                    return {
                        user,
                        perms,
                        roles,
                        hasPerms: (perm) => {
                            return perms.includes('acl.bypass') || perms.includes(perm);
                        },
                    };
                }
            }
        }
        appspace_1.logger.info(`No Session`);
        return undefined;
    });
};
// EXPORTS
exports.name = 'Auth';
const flow = function (req, res, flowspace, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // Catch Auth-URLS
        if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/auth')) {
            appspace_1.logger.info('Auth-URL detected');
            switch (req.url) {
                case '/auth/login':
                    appspace_1.logger.info('Login detected');
                    yield login(res, flowspace);
                    break;
                case '/auth/logout':
                    yield logout(req, res, flowspace);
                    break;
                case '/auth/refresh':
                    appspace_1.logger.info('Refresh detected');
                    yield refresh(req, res, flowspace);
                    break;
            }
            flowspace.skip.push('Router v2');
        }
        flowspace.session = yield createSession(req, res, flowspace);
        next();
    });
};
exports.flow = flow;
exports.default = { flow: exports.flow, name: exports.name };
