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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupView = exports.patch = exports.get = exports.name = void 0;
const zod_1 = __importDefault(require("zod"));
const appspace_1 = require("../appspace");
const raids_1 = require("../models/raids");
const characters_1 = require("../models/characters");
exports.name = 'SignupView';
const PostRequest = zod_1.default.object({
    position: zod_1.default.number(),
    state: zod_1.default.enum(['invited', 'accepted', 'declined']),
    comment: zod_1.default.string().optional(),
    character: characters_1.characterparser,
});
const get = function (req, res, flowspace) {
    return __awaiter(this, void 0, void 0, function* () {
        return '';
    });
};
exports.get = get;
const patch = function (req, res, flowspace) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if ((_a = flowspace.params) === null || _a === void 0 ? void 0 : _a.id) {
            try {
                const request = PostRequest.parse(flowspace.body);
                (_b = appspace_1.appspace.namespaces.get('raid')) === null || _b === void 0 ? void 0 : _b.send('updatestate', request, flowspace.params.id);
                const raid = yield raids_1.Raid.getRaidById(flowspace.params.id);
                for (const index in raid.signups) {
                    if (raid.signups[index].character.id === request.character.id) {
                        raid.signups[index] = request;
                        break;
                    }
                }
                return yield raids_1.Raid.updateRaid(raid);
            }
            catch (e) {
                res.statusCode = 500;
                return;
            }
        }
        return '';
    });
};
exports.patch = patch;
exports.SignupView = { get: exports.get, patch: exports.patch, name: exports.name };
