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
const appspace_1 = require("../appspace");
const jstoxml_1 = __importDefault(require("jstoxml"));
// EXPORTS
exports.name = 'View';
const executeview = (req, res, flowspace) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (flowspace.view) {
        switch ((_a = req.method) === null || _a === void 0 ? void 0 : _a.toLowerCase()) {
            case 'post':
                appspace_1.logger.info(`View v2: Using ${req.method}: ${flowspace.view.name}  `);
                return (_c = (_b = flowspace.view).post) === null || _c === void 0 ? void 0 : _c.call(_b, req, res, flowspace);
            case 'patch':
                appspace_1.logger.info(`View v2: Using ${req.method}: ${flowspace.view.name}  `);
                return (_e = (_d = flowspace.view).patch) === null || _e === void 0 ? void 0 : _e.call(_d, req, res, flowspace);
            case 'delete':
                appspace_1.logger.info(`View v2: Using ${req.method}: ${flowspace.view.name}  `);
                return (_g = (_f = flowspace.view).del) === null || _g === void 0 ? void 0 : _g.call(_f, req, res, flowspace);
            case 'put':
                appspace_1.logger.info(`View v2: Using ${req.method}: ${flowspace.view.name}  `);
                return (_j = (_h = flowspace.view).put) === null || _j === void 0 ? void 0 : _j.call(_h, req, res, flowspace);
            case 'get':
            default:
                appspace_1.logger.info(`View v2: Using ${req.method}: ${flowspace.view.name}  `);
                return (_l = (_k = flowspace.view).get) === null || _l === void 0 ? void 0 : _l.call(_k, req, res, flowspace);
        }
    }
});
const flow = function (req, res, flowspace, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (flowspace.view) {
            flowspace.message = yield executeview(req, res, flowspace);
            appspace_1.logger.info(`View v2: Executed ${flowspace.view.name} ${res.statusCode}`);
        }
        else if (flowspace.message) {
            appspace_1.logger.info('View v2: Using Message');
        }
        else {
            appspace_1.logger.error('View v2: No view, no message, no service.');
            res.statusCode = 404;
        }
        if (!flowspace.message) {
            switch (res.statusCode) {
                case 404:
                    flowspace.message = 'Not Found';
                    break;
                case 403:
                    flowspace.message = 'Forbidden';
                    break;
                case 500:
                    flowspace.message = 'Internal Server Error';
                    break;
            }
        }
        if (!res.writableEnded) {
            if (flowspace.contentType == 'xml') {
                res.setHeader('Content-Type', 'application/xml');
                res.end(jstoxml_1.default.toXML(flowspace.message, {
                    header: true,
                    indent: '  ',
                }));
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: res.statusCode, message: flowspace.message }));
            }
        }
        else {
            appspace_1.logger.info('View v2: Writable Ended, Skipping View');
        }
        next();
    });
};
exports.flow = flow;
exports.default = { flow: exports.flow, name: exports.name };
