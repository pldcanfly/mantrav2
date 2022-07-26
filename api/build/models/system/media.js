'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
const tslib_1 = require("tslib");
const appspace_1 = require("../../appspace");
class MediaModel {
    saveMedia(name, type, author, mimetype, meta, category) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('media')
                .insert()
                .set('name', name)
                .set('mediatype', type)
                .set('meta', meta)
                .set('author', author)
                .set('mimetype', mimetype)
                .set('category', category || 'all')
                .execute()
                .then((res) => res[0]);
        });
    }
    updateMedia(id, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('media')
                .update()
                .set('name', name)
                .where('id', '=', id)
                .execute()
                .then((res) => res[0]);
        });
    }
    getAllMedia() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('media')
                .order('createdat', 'DESC')
                .execute()
                .then((res) => res);
        });
    }
    getMedia(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('media')
                .where('id', '=', id)
                .execute()
                .then((res) => res[0]);
        });
    }
    removeMedia(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db.query('media').delete().where('id', '=', id).execute();
        });
    }
}
exports.Media = new MediaModel();
