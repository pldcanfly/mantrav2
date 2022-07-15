'use strict';

import { Flowspace } from '../..';
import http from 'http';
import { Click, ClickEventData, ImpressionEventData } from '../models/click.js';
import { Campaign } from '../models/campaign.js';
import { Archive, dateformat } from '../models/archive.js';
import pkg from 'date-fns-tz';
import { isAfter, isBefore } from 'date-fns';
const { formatInTimeZone } = pkg;

export const name = 'ExportView';

interface KLZResult {
  campaign: string;
  ase: string;
  impressions: {
    mobile: number;
    desktop: number;
  };
  clicks: {
    mobile: number;
    desktop: number;
    detailed?: Array<{
      date: Date;
      pos: string;
      mobile: boolean;
      url: string;
    }>;
  };
}

const klzexportold = async (params?: { [propName: string]: string }, detailed?: Boolean) => {
  console.time('Whole Export');
  let start = new Date('2022-01-01');
  let end = new Date();
  if (params?.start) start = new Date(params.start);
  if (params?.end) end = new Date(params.end);

  console.time('Get Clicks');
  const clicks = await Click.getClicksForDateRange(start, end);
  console.timeEnd('Get Clicks');
  const result: { [propName: string]: KLZResult } = {};

  console.time('Sort Clicks');
  for (const click of clicks) {
    if (!result[click.campaign]) {
      result[click.campaign] = {
        campaign: click.campaign,
        ase: '',
        impressions: { mobile: 0, desktop: 0 },
        clicks: { mobile: 0, desktop: 0 },
      };
      if (detailed) {
        result[click.campaign].clicks.detailed = [];
      }
    }

    switch (click.type) {
      case 'impression':
        let impressiondata = click.data as ImpressionEventData;

        if (result[click.campaign].ase == '') result[click.campaign].ase = impressiondata.ase;
        if (click.mobile) {
          result[click.campaign].impressions.mobile++;
        } else {
          result[click.campaign].impressions.desktop++;
        }
        break;
      case 'click':
        let clickdata = click.data as ClickEventData;

        if (click.mobile) {
          result[click.campaign].clicks.mobile++;
        } else {
          result[click.campaign].clicks.desktop++;
        }

        if (detailed) {
          result[click.campaign].clicks.detailed?.push({
            date: click.date,
            mobile: click.mobile,
            pos: clickdata.pos,
            url: decodeURIComponent(clickdata.url),
          });
        }
        break;
    }
  }

  console.timeEnd('Sort Clicks');

  const campaigns: Array<KLZResult> = [];

  console.time('Build Campaigns');
  for (const campaign in result) {
    if (result[campaign].ase == '') {
      const camprecord = await Campaign.getCampaignByName(result[campaign].campaign);
      if (!camprecord) continue;
      result[campaign].ase = camprecord.data.ase;
    }
    campaigns.push(result[campaign]);
  }
  console.timeEnd('Build Campaigns');
  console.timeEnd('Whole Export');
  return campaigns;
};

const klzexport = async (params?: { [propName: string]: string }, detailed?: Boolean) => {
  console.log('detailed', detailed);
  let start = new Date(0);
  let end = new Date();
  if (params?.start) start = new Date(decodeURI(params.start));
  if (params?.end) end = new Date(decodeURI(params.end));

  const result: Array<KLZResult> = [];

  const latestarchive = (await Archive.getLatestArchiveDate()).date || new Date(0).toISOString();
  const campaigns = await Campaign.getCampaigns();

  if (isBefore(start, end)) {
    const startdate = formatInTimeZone(start, 'UTC', dateformat);
    const enddate = formatInTimeZone(end, 'UTC', dateformat);

    for (const campaign of campaigns) {
      const firstarchive = await Archive.getNearestBefore(campaign.name, startdate);
      const lastarchive = await Archive.getNearestBefore(campaign.name, enddate);

      // console.log(campaign.name, firstarchive, lastarchive);
      const sums = { impressions: { desktop: 0, mobile: 0 }, clicks: { desktop: 0, mobile: 0 } };

      if (firstarchive && lastarchive) {
        // We have two datapoints in the archive, go for them
        sums.impressions = {
          desktop: lastarchive.data.impressions.desktop - firstarchive.data.impressions.desktop,
          mobile: lastarchive.data.impressions.mobile - firstarchive.data.impressions.mobile,
        };
        sums.clicks = {
          desktop: lastarchive.data.clicks.desktop - firstarchive.data.clicks.desktop,
          mobile: lastarchive.data.clicks.mobile - firstarchive.data.clicks.mobile,
        };
      }

      if (!firstarchive && lastarchive) {
        console.log('Triggered');
        // We have no archive before the range, so wie gonna start with zero
        sums.impressions = {
          desktop: lastarchive.data.impressions.desktop,
          mobile: lastarchive.data.impressions.mobile,
        };
        sums.clicks = {
          desktop: lastarchive.data.clicks.desktop,
          mobile: lastarchive.data.clicks.mobile,
        };
      }

      if (isAfter(end, latestarchive)) {
        // There may be clicks after the last archive, we have to add them
        const clicks = await Click.getClicksForDateRange(latestarchive, end);

        for (const click of clicks) {
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
        }
      }

      // console.log(sums);

      result.push({
        campaign: campaign.name,
        ase: campaign.data.ase,
        ...sums,
      });
    }

    return result;
  }

  // {
  //   "campaign": "Styriate-Te-Deum",
  //   "ase": "1151161",
  //   "impressions": {
  //     "mobile": 90419,
  //     "desktop": 6510
  //   },
  //   "clicks": {
  //     "mobile": 183,
  //     "desktop": 4,
};

export const get = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  switch (flowspace.params?.type) {
    case 'klz':
      if (flowspace.params?.key == 'm3eXpRn7aqdqXwXG') {
        return await klzexport(flowspace.params, flowspace.params?.detailed !== undefined);
      } else {
        res.statusCode = 403;
        return;
      }
      break;
    case 'klzold':
      if (flowspace.params?.key == 'm3eXpRn7aqdqXwXG') {
        return await klzexportold(flowspace.params, true);
      } else {
        res.statusCode = 403;
        return;
      }
      break;
  }
  return '';
};

export const ExportView = { get, name };
