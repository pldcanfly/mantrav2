'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Files = void 0;
const tslib_1 = require("tslib");
const crypto_1 = require("crypto");
const appspace_1 = require("../../appspace");
class FilesModel {
    insertFile(filename, path, type, size, ip) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const key = (0, crypto_1.randomFillSync)(Buffer.alloc(16)).toString('hex');
            return appspace_1.appspace.db
                .query('files')
                .insert()
                .set('name', filename)
                .set('type', type)
                .set('size', size)
                .set('path', path)
                .set('deletekey', key)
                .set('ip', ip)
                .execute()
                .then((res) => res[0]);
        });
    }
    getFile(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('files')
                .where('id', '=', id)
                .execute()
                .then((res) => res[0]);
        });
    }
    deleteFile(deletekey) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const record = yield appspace_1.appspace.db
                .query('files')
                .where('deletekey', '=', deletekey)
                .execute()
                .then((res) => res[0]);
            yield appspace_1.appspace.db.query('files').delete().where('deletekey', '=', deletekey).execute();
            return record.path;
        });
    }
}
exports.Files = new FilesModel();
