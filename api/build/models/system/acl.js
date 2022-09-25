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
exports.ACL = void 0;
const appspace_1 = require("../../appspace");
class ACLModel {
    getPermsForUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('aclroles_aclrights')
                .join('user_role', 'user_role.roleid', 'aclroles_aclrights.roleid')
                .join('aclrights', 'aclroles_aclrights.rightid', 'aclrights.id')
                .where('user_role.userid', '=', id)
                .execute()
                .then((res) => res.map((right) => right.name));
        });
    }
    getRolesForUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('user_role')
                .join('aclroles', 'user_role.roleid', 'aclroles.id')
                .where('user_role.userid', '=', id)
                .execute()
                .then((res) => res.map((role) => role.name));
        });
    }
    addRoleForUser(id, rolename) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.getRoleByName(rolename);
            return appspace_1.appspace.db
                .query('user_role')
                .insert()
                .set('roleid', role.id)
                .set('userid', id)
                .execute()
                .then((res) => res[0]);
        });
    }
    getRoleByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('aclroles')
                .where('name', '=', name)
                .execute()
                .then((res) => res[0]);
        });
    }
    clearRolesForUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('user_role')
                .delete()
                .where('userid', '=', id)
                .execute()
                .then(() => true);
        });
    }
}
exports.ACL = new ACLModel();
