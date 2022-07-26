"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rooms = void 0;
const raid_1 = require("../rooms/raid");
exports.rooms = [
    {
        name: 'raid',
        handler: raid_1.RaidRoom,
        events: ['updatestate'],
    },
];
