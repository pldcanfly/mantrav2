import { logger } from '../appspace';

const updatestate = (emit: (event: string, data: any) => boolean, message: string) => {
  logger.info('updatestate triggered');
  emit('refreshstate', message);
};

export const RaidRoom: { [propName: string]: (emit: (event: string, data: any) => boolean, ...args: any[]) => void } = {
  updatestate,
};
