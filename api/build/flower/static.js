'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.flow = exports.name = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const media_1 = require("../models/system/media");
const appspace_1 = require("../appspace");
// EXPORTS
exports.name = 'Static';
const flow = function (req, res, flowspace, next) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // SERVE STATIC
        if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/media/')) {
            const id = req.url.split('/').pop();
            if (id) {
                fs_1.default.readFile(path_1.default.join('static', 'media', id), function (err, content) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            res.statusCode = 404;
                            appspace_1.logger.error(`Media: Couldn't serve ${req.url}`, err);
                            res.end();
                            return;
                        }
                        else {
                            const intid = parseInt(id);
                            if (intid) {
                                const entiy = yield media_1.Media.getMedia(intid);
                                res.writeHead(200, { 'Content-type': entiy.mimetype });
                                res.end(content);
                                appspace_1.logger.info(`Media: Served ${req.url}`, err);
                            }
                            else {
                                res.statusCode = 404;
                                appspace_1.logger.error(`Media: Couldn't serve ${req.url}`);
                                res.end();
                            }
                        }
                    });
                });
                return;
            }
            else {
                res.statusCode = 404;
                appspace_1.logger.error(`Media: Couldn't serve ${req.url}`);
                res.end();
                return;
            }
        }
        next();
    });
};
exports.flow = flow;
exports.default = { flow: exports.flow, name: exports.name };
