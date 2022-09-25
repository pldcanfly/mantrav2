'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupView = exports.patch = exports.get = exports.name = void 0;
const tslib_1 = require("tslib");
const zod_1 = tslib_1.__importDefault(require("zod"));
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
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return '';
    });
};
exports.get = get;
const patch = function (req, res, flowspace) {
    var _a, _b;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
