"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaidRoom = void 0;
const appspace_1 = require("../appspace");
const updatestate = (emit, message) => {
    appspace_1.logger.info('updatestate triggered');
    emit('refreshstate', message);
};
exports.RaidRoom = {
    updatestate,
};
