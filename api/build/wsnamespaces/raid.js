"use strict";
// import { logger } from '../appspace';
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaidNamespace = void 0;
const wsnamespace_1 = require("../classes/wsnamespace");
// const updatestate = (emit: (event: string, data: any) => boolean, message: string) => {
//   logger.info('updatestate triggered');
//   emit('refreshstate', message);
// };
// export const RaidRoom: { [propName: string]: (emit: (event: string, data: any) => boolean, ...args: any[]) => void } = {
//   updatestate,
// };
class RaidNamespace extends wsnamespace_1.WSNamespace {
}
exports.RaidNamespace = RaidNamespace;
