'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const tslib_1 = require("tslib");
const appspace_js_1 = require("../appspace.js");
class GroupModel {
    getGroups() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('groups')
                .execute()
                .then((res) => res);
        });
    }
    getGroup(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('groups')
                .where('id', '=', id)
                .execute()
                .then((res) => res);
        });
    }
    insertGroup() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () { });
    }
    updateGroup(grp) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db.delete().query('groups').where('id', '=', id).execute();
        });
    }
}
exports.Group = new GroupModel();
