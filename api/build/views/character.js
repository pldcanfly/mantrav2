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
exports.CharacterView = exports.del = exports.post = exports.get = exports.name = void 0;
const characters_1 = require("../models/characters");
const appspace_1 = require("../appspace");
exports.name = 'CharacterView';
const get = function (req, res, flowspace) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_a = flowspace.params) === null || _a === void 0 ? void 0 : _a.mine) && flowspace.session)
            return yield characters_1.Character.getCharactersForAccount(flowspace.session.user.id.toString());
        return yield characters_1.Character.getCharacters();
    });
};
exports.get = get;
const post = function (req, res, flowspace) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
        if ((_a = flowspace.params) === null || _a === void 0 ? void 0 : _a.id) {
            return yield characters_1.Character.deleteCharacter(flowspace.params.id);
        }
        return;
    });
};
exports.del = del;
exports.CharacterView = { get: exports.get, post: exports.post, del: exports.del, name: exports.name };
