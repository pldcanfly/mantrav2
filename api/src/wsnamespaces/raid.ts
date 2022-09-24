// import { logger } from '../appspace';

import { WSNamespace } from '../classes/wsnamespace';

// const updatestate = (emit: (event: string, data: any) => boolean, message: string) => {
//   logger.info('updatestate triggered');
//   emit('refreshstate', message);
// };

// export const RaidRoom: { [propName: string]: (emit: (event: string, data: any) => boolean, ...args: any[]) => void } = {
//   updatestate,
// };

export class RaidNamespace extends WSNamespace {}
