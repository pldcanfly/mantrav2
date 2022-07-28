'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.session = exports.useCache = void 0;
exports.useCache = true;
exports.session = {
    salt: '$',
    algorithm: 'HS512',
    accessExpiresIn: '3m',
    accessSecret: process.env.ACCESS_SECRET || 'very secret!',
    refreshExpiresIn: '48h',
    refreshSecret: process.env.REFRESH_SECRET || 'very secret!',
};
