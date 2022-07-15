'use strict';

import { Job } from '../classes/scheduler/job.js';
import { PostgreSQL_DB } from '../classes/dbs/postgresql_db.js';
import { ClickRecord } from '../models/click.js';
import { Campaign } from '../models/campaign.js';
import { format, sub } from 'date-fns';
import pkg from 'date-fns-tz';
const { formatInTimeZone } = pkg;
import { Archive, ArchiveData, dateformat } from '../models/archive.js';

const db = new PostgreSQL_DB();
const cutoff = 30 * 24; // 30 Days
const batchsize = 50000;

class ArchiveJob extends Job {
  async run() {
    this.sendMessage('profile', 'Archiving');
    // await this.cleanup();
    await this.archive();
    this.sendMessage('profile', 'Archiving');
  }

  async cleanup() {
    const deldate = sub(new Date(), { hours: cutoff }).toISOString();
    this.sendMessage('log', `Cleaning up everything before ${deldate}`);
    await db.query('clicks').delete().where('date', '<', deldate).execute();
  }

  async archive() {
    let archive: { [propName: string]: ArchiveData } = {};
    const archivedate = new Date().toISOString();
    const latestarchive = (await Archive.getLatestArchiveDate())?.date || new Date(0).toISOString();

    const campaigns = await Campaign.getCampaigns();
    for (const campaign of campaigns) {
      let batch = true;
      let page = 0;
      const sums = { impressions: { mobile: 0, desktop: 0 }, clicks: { mobile: 0, desktop: 0 } };
      archive = {};
      while (batch) {
        let clicks = await db
          .query('clicks')
          .limit(batchsize, page * batchsize)
          .where('campaign', '=', campaign.name)
          .where('date', '>=', latestarchive)
          .where('date', '<', archivedate)
          .order('id')
          .execute()
          .then((res: Array<ClickRecord>) => res);

        if (clicks.length <= 0) {
          batch = false;
          break;
        }

        this.sendMessage('log', `${campaign.name}  Page: ${page}`);

        for (const click of clicks) {
          const date = formatInTimeZone(click.date, 'UTC', dateformat);

          if (!archive[date]) archive[date] = { impressions: { mobile: 0, desktop: 0 }, clicks: { mobile: 0, desktop: 0 } };

          switch (click.type) {
            case 'impression':
              if (click.mobile) {
                sums.impressions.mobile++;
              } else {
                sums.impressions.desktop++;
              }
              break;
            case 'click':
              if (click.mobile) {
                sums.clicks.mobile++;
              } else {
                sums.clicks.desktop++;
              }
              break;
          }

          archive[date] = {
            impressions: {
              mobile: sums.impressions.mobile,
              desktop: sums.impressions.desktop,
            },
            clicks: {
              mobile: sums.clicks.mobile,
              desktop: sums.clicks.desktop,
            },
          };
        }

        page++;
      }

      const latest = await Archive.getLatestArchive(campaign.name);
      for (const date in archive) {
        if (latest?.date == date) {
          archive[date].impressions.mobile += latest.data.impressions.mobile;
          archive[date].impressions.desktop += latest.data.impressions.desktop;
          archive[date].clicks.mobile += latest.data.clicks.mobile;
          archive[date].clicks.desktop += latest.data.clicks.desktop;
        }
        Archive.saveArchive(campaign.name, date, archive[date]);
      }
    }
    await Archive.addLatestArchiveDate(archivedate);
  }

  die() {
    db.close();
    super.die();
  }
}

export default new ArchiveJob().run();
