'use strict';
import { appspace, logger } from '../appspace.js';
import { ClickRecord } from './click.js';

interface ArchiveRecord {
  campaign: string;
  date: string;
  data: ArchiveData;
}

export interface ArchiveData {
  impressions: {
    mobile: number;
    desktop: number;
  };
  clicks: {
    mobile: number;
    desktop: number;
  };
  details: Array<ClickRecord>;
}

export const dateformat = 'yyyy-MM-dd-HH';

interface ArchiveHistoryRecord {
  id: number;
  date: Date;
}

class ArchiveModel {
  getArchive(campaign: string, date: string) {
    return appspace.db
      .query('archive')
      .where('campaign', '=', campaign)
      .where('date', '=', date)
      .execute()
      .then((res: Array<ArchiveRecord>) => res[0]);
  }

  getNearestAfter(campaign: string, date: string) {
    return appspace.db
      .query('archive')
      .where('campaign', '=', campaign)
      .where('date', '>=', date)
      .order('date', 'ASC')
      .debug()
      .execute()
      .then((res: Array<ArchiveRecord>) => res[0]);
  }

  getNearestBefore(campaign: string, date: string) {
    return appspace.db
      .query('archive')
      .where('campaign', '=', campaign)
      .where('date', '<=', date)
      .order('date', 'DESC')
      .debug()
      .execute()
      .then((res: Array<ArchiveRecord>) => res[0]);
  }

  getLatestArchiveDate() {
    return appspace.db
      .query('archive_history')
      .order('date', 'DESC')
      .execute()
      .then((res: Array<ArchiveHistoryRecord>) => res[0]);
  }

  getLatestArchive(campaign: string) {
    return appspace.db
      .query('archive')
      .where('campaign', '=', campaign)
      .order('date', 'DESC')
      .execute()
      .then((res: Array<ArchiveRecord>) => res[0]);
  }

  addLatestArchiveDate(date: string) {
    return appspace.db.query('archive_history').insert().set('date', date).execute();
  }

  async saveArchive(campaign: string, date: string, data: ArchiveData) {
    const old = await this.getArchive(campaign, date);

    if (old) {
      return appspace.db
        .query('archive')
        .update()
        .set('data', data)
        .where('campaign', '=', campaign)
        .where('date', '=', date)
        .execute()
        .then((res: Array<ArchiveRecord>) => res);
    } else {
      return appspace.db
        .query('archive')
        .insert()
        .set({ campaign, date })
        .set('data', data)
        .execute()
        .then((res: Array<ArchiveRecord>) => res);
    }
  }
}

export const Archive = new ArchiveModel();
