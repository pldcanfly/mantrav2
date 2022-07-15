'use strict';

import MemoryCache from 'memory-cache';
import { useCache } from '../config/config.js';
import { logger } from '../appspace.js';

type CacheKey = string | number;

const default_time = 10000;

class Cache {
  private cache: any;
  constructor() {
    this.cache = MemoryCache;
  }

  set(key: CacheKey, obj: any, ttl?: number) {
    return this.cache.put(key, obj, ttl || default_time);
  }
  get(key: CacheKey, fillFunction?: Function, ttl?: number) {
    if (!useCache) {
      logger.info(`Cache disabled: ${key}`);
      return null;
    }
    const value = this.cache.get(key);
    if (value !== null) {
      logger.info(`Cache Fetch: ${key}`);
    } else {
      logger.info(`Cache Miss: ${key}`);
      if (fillFunction) {
        const obj = fillFunction();
        this.set(key, obj, ttl || default_time);
        return fillFunction();
      }
    }

    return value;
  }
  delete(key: CacheKey): any {
    return this.cache.del(key);
  }
  clear() {
    return this.cache.clear();
  }
}

export { Cache };
