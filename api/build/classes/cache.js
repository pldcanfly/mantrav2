'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const memory_cache_1 = __importDefault(require("memory-cache"));
const config_1 = require("../config/config");
const appspace_1 = require("../appspace");
const default_time = 10000;
class Cache {
    constructor() {
        this.cache = memory_cache_1.default;
    }
    set(key, obj, ttl) {
        return this.cache.put(key, obj, ttl || default_time);
    }
    get(key, fillFunction, ttl) {
        if (!config_1.useCache) {
            appspace_1.logger.info(`Cache disabled: ${key}`);
            return null;
        }
        const value = this.cache.get(key);
        if (value !== null) {
            appspace_1.logger.info(`Cache Fetch: ${key}`);
        }
        else {
            appspace_1.logger.info(`Cache Miss: ${key}`);
            if (fillFunction) {
                const obj = fillFunction();
                this.set(key, obj, ttl || default_time);
                return fillFunction();
            }
        }
        return value;
    }
    delete(key) {
        return this.cache.del(key);
    }
    clear() {
        return this.cache.clear();
    }
}
exports.Cache = Cache;
