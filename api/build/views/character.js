'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterView = exports.del = exports.post = exports.get = exports.name = void 0;
const tslib_1 = require("tslib");
const characters_1 = require("../models/characters");
const appspace_1 = require("../appspace");
exports.name = 'CharacterView';
const get = function (req, res, flowspace) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (((_a = flowspace.params) === null || _a === void 0 ? void 0 : _a.mine) && flowspace.session)
            return yield characters_1.Character.getCharactersForAccount(flowspace.session.user.id.toString());
        return yield characters_1.Character.getCharacters();
    });
};
exports.get = get;
const post = function (req, res, flowspace) {
    var _a, _b, _c;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            if (((_a = flowspace.params) === null || _a === void 0 ? void 0 : _a.id) && flowspace.params.id !== '-1') {
                const char = characters_1.characterparser.parse((_b = flowspace.body) === null || _b === void 0 ? void 0 : _b.character);
                return yield characters_1.Character.updateCharacter(char);
            }
            else {
                const char = characters_1.characterparser.parse((_c = flowspace.body) === null || _c === void 0 ? void 0 : _c.character);
                return yield characters_1.Character.insertCharacter(char);
            }
        }
        catch (e) {
            appspace_1.logger.error(e);
            res.statusCode = 500;
            return;
        }
    });
};
exports.post = post;
const del = function (req, res, flowspace) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if ((_a = flowspace.params) === null || _a === void 0 ? void 0 : _a.id) {
            return yield characters_1.Character.deleteCharacter(flowspace.params.id);
        }
        return;
    });
};
exports.del = del;
exports.CharacterView = { get: exports.get, post: exports.post, del: exports.del, name: exports.name };
