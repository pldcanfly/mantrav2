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
exports.Character = exports.characterparser = void 0;
const zod_1 = require("zod");
const appspace_js_1 = require("../appspace.js");
exports.characterparser = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    race: zod_1.z.enum(['orc', 'tauren', 'troll', 'undead', 'bloodelf', 'unknown']),
    clazz: zod_1.z.enum(['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'shaman', 'mage', 'warlock', 'druid', 'deathknight', 'unknown']),
    specc: zod_1.z.enum([
        'warms',
        'wfury',
        'wprot',
        'pholy',
        'pprot',
        'pretri',
        'hbm',
        'hmm',
        'hsv',
        'rassa',
        'rcombat',
        'rsub',
        'prdisc',
        'prshadow',
        'sele',
        'sench',
        'sresto',
        'marcane',
        'mfire',
        'mfrost',
        'waffli',
        'wdemo',
        'wdestro',
        'dbalance',
        'dferal',
        'dresto',
        'dbear',
        'dkblood',
        'dkfrost',
        'dkunholy',
        'unknown',
    ]),
    offspecc: zod_1.z
        .enum([
        'warms',
        'wfury',
        'wprot',
        'pholy',
        'pprot',
        'pretri',
        'hbm',
        'hmm',
        'hsv',
        'rassa',
        'rcombat',
        'rsub',
        'prdisc',
        'prshadow',
        'sele',
        'sench',
        'sresto',
        'marcane',
        'mfire',
        'mfrost',
        'waffli',
        'wdemo',
        'wdestro',
        'dbalance',
        'dferal',
        'dresto',
        'dbear',
        'dkblood',
        'dkfrost',
        'dkunholy',
        'unknown',
    ])
        .nullish(),
    female: zod_1.z.boolean(),
    accountid: zod_1.z.string(),
});
class CharacterModel {
    getCharacters() {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('characters')
                .execute()
                .then((res) => res);
        });
    }
    getCharactersForAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('characters')
                .where('accountid', '=', id)
                .execute()
                .then((res) => res);
        });
    }
    getCharacterById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('characters')
                .where('id', '=', id)
                .execute()
                .then((res) => res[0]);
        });
    }
    updateCharacter(char) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('characters')
                .update()
                .set(char)
                .where('id', '=', char.id)
                .execute()
                .then((res) => res);
        });
    }
    insertCharacter(char) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db
                .query('characters')
                .insert()
                .set('name', char.name)
                .set('race', char.race)
                .set('clazz', char.clazz)
                .set('specc', char.specc)
                .set('offspecc', char.offspecc)
                .set('female', char.female)
                .set('accountid', char.accountid)
                .execute()
                .then((res) => res[0]);
        });
    }
    deleteCharacter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return appspace_js_1.appspace.db.query('characters').delete().where('id', '=', id).execute();
        });
    }
}
exports.Character = new CharacterModel();
