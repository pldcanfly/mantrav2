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
exports.flow = exports.name = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const media_1 = require("../models/system/media");
const appspace_1 = require("../appspace");
// EXPORTS
exports.name = 'Static';
const flow = function (req, res, flowspace, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // SERVE STATIC
        if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/media/')) {
            const id = req.url.split('/').pop();
            if (id) {
                fs_1.default.readFile(path_1.default.join('static', 'media', id), function (err, content) {
                    return __awaiter(this, void 0, void 0, function* () {
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
