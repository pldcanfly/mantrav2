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
exports.Group = void 0;
const appspace_js_1 = require("../appspace.js");
class GroupModel {
    getGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('groups')
                .execute()
                .then((res) => res);
        });
    }
    getGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('groups')
                .where('id', '=', id)
                .execute()
                .then((res) => res);
        });
    }
    insertGroup() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updateGroup(grp) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('groups')
                .update()
                .set('name', grp.name)
                .set('members', JSON.stringify(grp.members))
                .where('id', '=', grp.id)
                .execute()
                .then((res) => res);
        });
    }
    deleteGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db.delete().query('groups').where('id', '=', id).execute();
        });
    }
}
exports.Group = new GroupModel();
