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
exports.Media = void 0;
const appspace_1 = require("../../appspace");
class MediaModel {
    saveMedia(name, type, author, mimetype, meta, category) {
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('media')
                .order('createdat', 'DESC')
                .execute()
                .then((res) => res);
        });
    }
    getMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('media')
                .where('id', '=', id)
                .execute()
                .then((res) => res[0]);
        });
    }
    removeMedia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db.query('media').delete().where('id', '=', id).execute();
        });
    }
}
exports.Media = new MediaModel();
