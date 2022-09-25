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
exports.RaidView = exports.post = exports.get = exports.name = void 0;
const raids_1 = require("../models/raids");
const zod_1 = require("zod");
const appspace_1 = require("../appspace");
const characters_1 = require("../models/characters");
exports.name = 'RaidView';
const PostRequest = zod_1.z.object({
    id: zod_1.z.string().optional(),
    name: zod_1.z.string(),
    date: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string(),
    size: zod_1.z.number().min(0),
    signups: zod_1.z
        .object({
        position: zod_1.z.number(),
        state: zod_1.z.enum(['invited', 'accepted', 'declined']),
        character: characters_1.characterparser,
    })
        .array(),
});
const get = function (req, res, flowspace) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if ((_a = flowspace.params) === null || _a === void 0 ? void 0 : _a.id) {
            return yield raids_1.Raid.getRaidById(flowspace.params.id);
        }
        return yield raids_1.Raid.getRaids();
    });
};
exports.get = get;
const post = function (req, res, flowspace) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const raid = PostRequest.parse(flowspace.body);
            if (!((_a = flowspace.session) === null || _a === void 0 ? void 0 : _a.hasPerms('manage.raid'))) {
                res.statusCode = 403;
                return;
            }
            if (raid.id) {
                (_b = appspace_1.appspace.namespaces.get('raid')) === null || _b === void 0 ? void 0 : _b.send('updateraid', Object.assign(Object.assign({}, raid), { id: raid.id }), raid.id);
                return yield raids_1.Raid.updateRaid(Object.assign(Object.assign({}, raid), { id: raid.id }));
            }
            else {
                return yield raids_1.Raid.insertRaid(raid);
            }
            // Add Raid
        }
        catch (e) {
            appspace_1.logger.error(e);
            res.statusCode = 500;
            return '';
        }
    });
};
exports.post = post;
exports.RaidView = { get: exports.get, post: exports.post, name: exports.name };
