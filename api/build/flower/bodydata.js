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
const busboy_1 = __importDefault(require("busboy"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const os_1 = __importDefault(require("os"));
const appspace_1 = require("../appspace");
// EXPORTS
exports.name = 'BodyData';
const flow = function (req, res, flowspace, next) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        switch ((_a = req.method) === null || _a === void 0 ? void 0 : _a.toLowerCase()) {
            case 'post':
            case 'put':
            case 'patch':
                if (((_b = req.headers['content-type']) === null || _b === void 0 ? void 0 : _b.startsWith('multipart/form-data')) || ((_c = req.headers['content-type']) === null || _c === void 0 ? void 0 : _c.startsWith('application/x-www-form-urlencoded'))) {
                    handleMultipart(req, res, flowspace, next);
                }
                else {
                    handleRaw(req, res, flowspace, next);
                }
                break;
            default:
                next();
                break;
        }
    });
};
exports.flow = flow;
// Helpers
const handleRaw = (req, res, flowspace, next) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        try {
            flowspace.body = JSON.parse(body);
        }
        catch (_a) {
            flowspace.body = body;
        }
        next();
    });
};
const handleMultipart = (req, res, flowspace, next) => {
    var _a;
    const limits = {
        fileSize: 100 * 1024 * 1024, // 100 MB limit
    };
    const errors = [];
    if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/medialib')) {
        limits.fileSize = Infinity; // No Limit for Media-Lib
    }
    const bb = (0, busboy_1.default)({
        headers: req.headers,
        highWaterMark: 2 * 1024 * 1024,
        limits,
    });
    bb.on('file', (name, file, info) => {
        const { filename, encoding, mime } = info;
        const saveTo = path_1.default.join(os_1.default.tmpdir(), `${filename}-${(0, crypto_1.randomFillSync)(Buffer.alloc(16)).toString('hex')}`);
        const fstream = fs_1.default.createWriteStream(saveTo);
        fstream.on('error', (e) => {
            appspace_1.logger.error(e);
        });
        // fstream.on('close', () => {
        // });
        var i = 0;
        file.on('data', function (data) {
            try {
                fstream.write(data);
            }
            catch (e) {
                appspace_1.logger.error(e);
            }
        });
        file.on('end', () => {
            fstream.close();
            if (file.truncated) {
                appspace_1.logger.error('Limit triggered');
                fs_1.default.unlinkSync(saveTo);
                errors.push('Diese Datei ist zu groß.');
            }
            else {
                appspace_1.logger.info('Write file to Disk finshed');
            }
        });
        flowspace.body = {
            type: mime,
            name: filename,
            path: saveTo,
        };
    });
    bb.on('close', () => {
        appspace_1.logger.info('Done parsing Upload');
        if (errors.length > 0) {
            res.statusCode = 413;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: res.statusCode, message: errors }));
            return;
        }
        else {
            next();
        }
    });
    req.pipe(bb);
};
exports.default = { flow: exports.flow, name: exports.name };
