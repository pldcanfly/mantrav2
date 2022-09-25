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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const config_1 = require("../../config/config");
const crypto_1 = __importDefault(require("crypto"));
const appspace_1 = require("../../appspace");
class UserModel {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('user')
                .execute()
                .then((result) => result);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('user')
                .delete()
                .where('id', '=', id)
                .execute()
                .then((res) => res);
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('user')
                .where('id', '=', id)
                .execute()
                .then((result) => result[0]);
        });
    }
    getUserByUsername(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('user')
                .where('username', '=', search)
                .execute()
                .then((result) => result[0]);
        });
    }
    checkPassword(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserByUsername(login);
            if (user) {
                const salt = user.password.split(config_1.session.salt)[0];
                if (user.password == this.cryptPassword(password, salt)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            return false;
        });
    }
    generateSalt() {
        return crypto_1.default.randomBytes(512).toString('hex');
    }
    generateRandomPassword() {
        return crypto_1.default.randomBytes(16).toString('hex');
    }
    cryptPassword(password, salt) {
        password = `${salt}${password}`;
        return `${salt}${config_1.session.salt}${crypto_1.default.createHash('sha256').update(password).digest('base64')}`;
    }
    createUser(name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('user')
                .insert()
                .set('username', name.trim())
                .set('password', this.cryptPassword(password.trim(), this.generateSalt()))
                .execute()
                .then((result) => result[0]);
        });
    }
    updateUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = appspace_1.appspace.db.query('user').update();
            if (user.username)
                query.set('username', user.username.trim());
            if (user.data)
                query.set('data', user.data);
            return query
                .where('id', '=', id)
                .execute()
                .then((result) => result[0]);
        });
    }
    setPassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('user')
                .update()
                .set('password', this.cryptPassword(password, this.generateSalt()))
                .where('id', '=', id)
                .execute()
                .then((result) => result);
        });
    }
}
exports.User = new UserModel();
