import { RaidRoom } from '../rooms/raid';

export const rooms = [
  {
    name: /^\/raid-\d+$/,
    handler: RaidRoom,
    events: ['updatestate'],
  },
];
