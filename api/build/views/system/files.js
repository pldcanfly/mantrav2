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
exports.FilesView = exports.del = exports.put = exports.get = exports.name = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const files_1 = require("../../models/system/files");
const crypto_1 = require("crypto");
exports.name = 'FilesView';
const get = function (req, res, flowspace) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_a = flowspace.params) === null || _a === void 0 ? void 0 : _a.hash) && ((_b = flowspace.params) === null || _b === void 0 ? void 0 : _b.filename)) {
            //res.writeHead(200, { 'Content-type': entiy.mimetype });
            const deliverPath = path_1.default.join('static', 'files', flowspace.params.hash, decodeURI(flowspace.params.filename));
            console.log(deliverPath);
            if (fs_1.default.existsSync(deliverPath)) {
                res.end(fs_1.default.readFileSync(deliverPath));
                return;
            }
        }
        else if ((_c = flowspace.params) === null || _c === void 0 ? void 0 : _c.id) {
            const file = yield files_1.Files.getFile(parseInt(flowspace.params.id));
            if (file) {
                return file;
            }
        }
        else {
            res.statusCode = 404;
            return '';
        }
    });
};
exports.get = get;
const put = function (req, res, flowspace) {
    return __awaiter(this, void 0, void 0, function* () {
        if (flowspace.body) {
            const body = flowspace.body;
            if (body.name) {
                const stats = fs_1.default.statSync(body.path);
                const ip = req.socket.remoteAddress || '0.0.0.0';
                const saveToDir = path_1.default.join('static', 'files', `${(0, crypto_1.randomFillSync)(Buffer.alloc(16)).toString('hex')}`);
                const saveToPath = path_1.default.join(saveToDir, `${body.name}`);
                const file = yield files_1.Files.insertFile(body.name, saveToPath, body.type || 'unknown', stats.size.toString(), ip);
                if (!fs_1.default.existsSync(saveToDir)) {
                    fs_1.default.mkdirSync(saveToDir);
                }
                return yield fs_1.default.promises
                    .copyFile(body.path, saveToPath)
                    .then(() => {
                    fs_1.default.unlinkSync(body.path);
                    return { deletekey: file.deletekey, id: file.id };
                })
                    .catch(() => {
                    res.statusCode = 500;
                    return;
                });
            }
        }
        res.statusCode = 500;
        return '';
    });
};
exports.put = put;
const del = function (req, res, flowspace) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if ((_a = flowspace.params) === null || _a === void 0 ? void 0 : _a.id) {
            const filePath = yield files_1.Files.deleteFile(flowspace.params.id);
            fs_1.default.unlinkSync(filePath);
            return;
        }
        res.statusCode = 403;
        return;
    });
};
exports.del = del;
exports.FilesView = { get: exports.get, put: exports.put, del: exports.del, name: exports.name };
