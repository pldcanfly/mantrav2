'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupView = exports.post = exports.get = exports.name = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const appspace_1 = require("../appspace");
const groups_1 = require("../models/groups");
const characters_1 = require("../models/characters");
exports.name = 'GroupView';
const GETrequest = zod_1.z.object({
    id: zod_1.z.string().optional(),
});
const POSTrequest = zod_1.z
    .object({
    id: zod_1.z.string().optional(),
    name: zod_1.z.string(),
    members: characters_1.characterparser.array(),
})
    .array();
const insertMember = function (groups) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(groups)) {
            let result = [];
            for (const group of groups) {
                result.push((yield insertMember(group)));
            }
            return result;
        }
        else {
            let members = [];
            for (const member of groups.members) {
                const char = yield characters_1.Character.getCharacterById(member);
                members = [...members, char];
            }
            return Object.assign(Object.assign({}, groups), { members });
        }
    });
};
const get = function (req, res, flowspace) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const params = GETrequest.parse(flowspace.params);
            if (params.id)
                return insertMember(yield groups_1.Group.getGroup(params.id));
            return insertMember(yield groups_1.Group.getGroups());
        }
        catch (e) {
            appspace_1.logger.error(e);
            res.statusCode = 500;
            return;
        }
    });
};
exports.get = get;
const post = function (req, res, flowspace) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const body = POSTrequest.parse(flowspace.body);
            for (const grp of body) {
                if (grp.id) {
                    const ids = grp.members.map((item) => item.id);
                    yield groups_1.Group.updateGroup({ id: grp.id, name: grp.name, members: ids });
                }
                else {
                }
            }
        }
        catch (e) {
            appspace_1.logger.error(e);
            res.statusCode = 500;
            return;
        }
        return '';
    });
};
exports.post = post;
exports.GroupView = { get: exports.get, post: exports.post, name: exports.name };
