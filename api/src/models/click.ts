'use strict';
import { appspace, logger } from '../appspace.js';

export type ClickRecord = {
  id: number;
  campaign: string;
  ua: string;
  date: Date;
  mobile: boolean;
  type: string;
  data: ClickData;
};

type ClickData = ClickEventData | ImpressionEventData | undefined;

export type ClickEventData = {
  url: string;
  pos: string;
};

export type ImpressionEventData = {
  ase: string;
};

class ClickModel {
  getClicks() {
    return appspace.db
      .query('clicks')
      .execute()
      .then((res: Array<ClickRecord>) => res);
  }

  getClicksForDateRange(start: Date, end: Date) {
    return appspace.db
      .query('clicks')
      .where('date', '>', start.toISOString())
      .where('date', '<=', end.toISOString())
      .debug()
      .execute()
      .then((res: Array<ClickRecord>) => res);
  }

  getClicksForType(type: string) {
    return appspace.db
      .query('clicks')
      .where('type', '=', type)
      .execute()
      .then((res: Array<ClickRecord>) => res);
  }

  getClick(id: number) {
    return appspace.db
      .query('clicks')
      .where('id', '=', id)
      .execute()
      .then((res: Array<ClickRecord>) => res[0]);
  }

  getClicksForCampain(campaign: string) {
    return appspace.db
      .query('clicks')
      .where('campaign', '=', campaign)
      .execute()
      .then((res: Array<ClickRecord>) => res[0]);
  }

  insertClick(campaign: string, type: string, ua: string, mobile: boolean, data: ClickData) {
    const query = appspace.db.query('clicks').insert().set('campaign', campaign).set('ua', ua).set('mobile', mobile).set('type', type);

    if (data) query.set('data', data);

    return query.execute().then((res: Array<ClickRecord>) => res[0]);
  }
}

export const Click = new ClickModel();
