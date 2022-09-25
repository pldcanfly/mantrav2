'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raid = void 0;
const tslib_1 = require("tslib");
const appspace_js_1 = require("../appspace.js");
//id: 1,
// 		name: 'Toller Raid',
// 		date: '2022-08-12T18:00:52.405Z',
// 		description: 'Beschreibung',
// 		icon: 'naxx',
// 		size: 25,
// 		signups: [
// 			{
// 				state: 'declined',
// 				position: -1,
// 				actions: false,
// 				character: {
// 					id: 1,
// 					name: 'Feralface',
// 					clazz: 'druid',
// 					specc: 'dferal',
// 					offspecc: 'dbear',
// 					race: 'tauren',
// 					female: true
// 				}
// 			},
class RaidModel {
    getRaids() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('raids')
                .fields(['id', 'name', 'size', 'date'])
                .execute()
                .then((res) => res);
        });
    }
    getRaidById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('raids')
                .where('id', '=', id)
                .execute()
                .then((res) => res[0]);
        });
    }
    insertRaid(raid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            delete raid.id;
            return appspace_js_1.appspace.db
                .query('raids')
                .insert()
                .set(Object.assign(Object.assign({}, raid), { signups: JSON.stringify(raid.signups) }))
                .execute()
                .then((res) => res[0]);
        });
    }
    updateRaid(raid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('raids')
                .update()
                .set(Object.assign(Object.assign({}, raid), { signups: JSON.stringify(raid.signups) }))
                .where('id', '=', raid.id)
                .execute()
                .then((res) => res[0]);
        });
    }
}
exports.Raid = new RaidModel();
