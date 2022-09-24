'use strict';
import { appspace, logger } from '../appspace.js';
import { CharacterRecord } from './characters.js';

export interface RaidRecord {
  id: string;
  name: string;
  date: string;
  description?: string;
  icon: string;
  size: number;
  signups: Array<Signup>;
}

export interface InsertRaidRecord extends Omit<RaidRecord, 'id'> {
  id?: string;
}

interface Signup {
  state: 'invited' | 'accepted' | 'declined';
  position: number;
  comment?: string;
  character: CharacterRecord;
}

//id: 1,
// 		name: 'Toller Raid',
// 		date: '2022-08-12T18:00:52.405Z',
// 		description: 'Beschreibung',
// 		icon: 'naxx',
// 		size: 25,
// 		signups: [
// 			{
// 				state: 'declined',
// 				position: -1,
// 				actions: false,
// 				character: {
// 					id: 1,
// 					name: 'Feralface',
// 					clazz: 'druid',
// 					specc: 'dferal',
// 					offspecc: 'dbear',
// 					race: 'tauren',
// 					female: true
// 				}
// 			},

class RaidModel {
  async getRaids() {
    return appspace.db
      .query('raids')
      .fields(['id', 'name', 'size', 'date'])
      .execute()
      .then((res: Array<RaidRecord>) => res);
  }

  async getRaidById(id: string) {
    return appspace.db
      .query('raids')
      .where('id', '=', id)
      .execute()
      .then((res: Array<RaidRecord>) => res[0]);
  }

  async insertRaid(raid: InsertRaidRecord) {
    delete raid.id;

    return appspace.db
      .query('raids')
      .insert()
      .set({
        ...raid,
        signups: JSON.stringify(raid.signups),
      })
      .execute()
      .then((res: Array<RaidRecord>) => res[0]);
  }

  async updateRaid(raid: RaidRecord) {
    return appspace.db
      .query('raids')
      .update()
      .set({
        ...raid,
        signups: JSON.stringify(raid.signups),
      })
      .where('id', '=', raid.id)
      .execute()
      .then((res: Array<RaidRecord>) => res[0]);
  }
}

export const Raid = new RaidModel();
