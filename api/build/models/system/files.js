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
exports.Files = void 0;
const crypto_1 = require("crypto");
const appspace_1 = require("../../appspace");
class FilesModel {
    insertFile(filename, path, type, size, ip) {
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_1.appspace.db
                .query('files')
                .where('id', '=', id)
                .execute()
                .then((res) => res[0]);
        });
    }
    deleteFile(deletekey) {
        return __awaiter(this, void 0, void 0, function* () {
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
