"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespaces = void 0;
const raid_1 = require("../wsnamespaces/raid");
exports.namespaces = [
    {
        name: 'raid',
        handler: raid_1.RaidNamespace,
        events: ['updatestate'],
    },
];
