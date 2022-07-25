import { RaidRoom } from '../rooms/raid';

export const rooms = [
  {
    name: 'raid',
    handler: RaidRoom,
    events: ['updatestate'],
  },
];
