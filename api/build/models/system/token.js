"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const config_1 = require("../../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("./user");
const appspace_1 = require("../../appspace");
const acl_1 = require("./acl");
class TokenModel {
    getTokenPairForIssuer(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('activetokens')
                .where('issuer', '=', token)
                .execute()
                .then((res) => res[0])
                .catch((err) => appspace_1.logger.error(err));
        });
    }
    cleanUp() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield appspace_1.appspace.db
                .query('activetokens')
                .where('createdat', '=', new Date().toISOString())
                .execute()
                .then((res) => console.log(res));
        });
    }
    tokenExists(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('activetokens')
                .where('refreshtoken', '=', token, 'OR')
                .where('accesstoken', '=', token, 'OR')
                .execute()
                .then((res) => res.length > 0)
                .catch(() => false);
        });
    }
    issuerExists(issuer) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('activetokens')
                .where('issuer', '=', issuer)
                .execute()
                .then((res) => res.length > 0)
                .catch(() => false);
        });
    }
    invalidateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db.query('activetokens').delete().where('refreshtoken', '=', token, 'OR').where('accesstoken', '=', token, 'OR').execute();
        });
    }
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.tokenExists(token)) {
                try {
                    var decoded = jsonwebtoken_1.default.verify(token, config_1.session.accessSecret, {
                        algorithms: [config_1.session.algorithm],
                    });
                    const user = yield user_1.User.getUserById(decoded.id);
                    user.password = '-';
                    return user;
                }
                catch (e) {
                    appspace_1.logger.error('Token Error:', e);
                    return false;
                }
            }
        });
    }
    invalidateIssuer(token) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = appspace_1.appspace.db) === null || _a === void 0 ? void 0 : _a.query('activetokens').delete().where('issuer', '=', token).execute();
        });
    }
    issueTokenPairWithCredentials(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenpair = yield this.generateTokenPair(user);
            return appspace_1.appspace.db
                .query('activetokens')
                .insert()
                .set('refreshtoken', tokenpair.refreshToken)
                .set('accesstoken', tokenpair.accessToken)
                .set('username', user.username)
                .execute()
                .then((res) => tokenpair)
                .catch(() => false);
        });
    }
    issueTokenPairWithRefresh(refreshtoken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.tokenExists(refreshtoken)) {
                yield this.invalidateToken(refreshtoken);
                try {
                    var decoded = jsonwebtoken_1.default.verify(refreshtoken, config_1.session.refreshSecret, {
                        algorithms: [config_1.session.algorithm],
                    });
                    const user = yield user_1.User.getUserById(decoded.id);
                    const tokenpair = yield this.generateTokenPair(user);
                    return appspace_1.appspace.db
                        .query('activetokens')
                        .insert()
                        .set('refreshtoken', tokenpair.refreshToken)
                        .set('accesstoken', tokenpair.accessToken)
                        .set('issuer', refreshtoken)
                        .set('username', user.username)
                        .execute()
                        .then((res) => tokenpair)
                        .catch(() => false);
                }
                catch (e) {
                    appspace_1.logger.error('Token Error:', e);
                    return false;
                }
            }
            else if (yield this.issuerExists(refreshtoken)) {
                yield this.invalidateIssuer(refreshtoken);
                appspace_1.logger.error('Token Error: REFRESH TOKEN REUSED!');
                return false;
            }
            else {
                appspace_1.logger.error('Token Error: Unknown Token');
                return false;
            }
        });
    }
    generateTokenPair(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let accessPayload = {
                id: user.id,
                roles: yield acl_1.ACL.getRolesForUser(user.id),
                perms: yield acl_1.ACL.getPermsForUser(user.id),
                username: user.username,
            };
            let refreshPayload = {
                id: user.id,
            };
            return {
                accessToken: jsonwebtoken_1.default.sign(accessPayload, config_1.session.accessSecret, {
                    expiresIn: config_1.session.accessExpiresIn,
                    algorithm: config_1.session.algorithm,
                }),
                refreshToken: jsonwebtoken_1.default.sign(refreshPayload, config_1.session.refreshSecret, {
                    expiresIn: config_1.session.refreshExpiresIn,
                    algorithm: config_1.session.algorithm,
                }),
            };
        });
    }
}
exports.Token = new TokenModel();
