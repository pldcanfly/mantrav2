"use strict";
// import { logger } from '../appspace';
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaidNamespaceRoom = void 0;
const room_1 = require("../classes/room");
// const updatestate = (emit: (event: string, data: any) => boolean, message: string) => {
//   logger.info('updatestate triggered');
//   emit('refreshstate', message);
// };
// export const RaidRoom: { [propName: string]: (emit: (event: string, data: any) => boolean, ...args: any[]) => void } = {
//   updatestate,
// };
class RaidNamespaceRoom extends room_1.WSRoom {
    name() {
        return 'raids';
    }
}
exports.RaidNamespaceRoom = RaidNamespaceRoom;
