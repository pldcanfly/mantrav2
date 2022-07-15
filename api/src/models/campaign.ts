'use strict';
import { appspace, logger } from '../appspace.js';

export type CampaignRecord = {
  id: number;
  name: string;
  createdat: Date;
  updatedat: Date;
  data: CampaignData;
};

export type CampaignData = {
  details: CampaignDetails;
  ase: string;
  urls: {
    mobile: { [propName: string]: Array<string> };
    desktop: { [propName: string]: Array<string> };
  };
};

export interface CampaignDetails {
  clicks: {
    mobile: number;
    desktop: number;
  };
  impressions: {
    mobile: number;
    desktop: number;
  };
  [propName: string]: {
    mobile: number;
    desktop: number;
  };
}

class CampaignModel {
  getCampaigns() {
    return appspace.db
      .query('campaigns')
      .execute()
      .then((res: Array<CampaignRecord>) => res);
  }

  getCampaign(id: number) {
    return appspace.db
      .query('campaigns')
      .where('id', '=', id)
      .execute()
      .then((res: Array<CampaignRecord>) => res[0]);
  }

  getCampaignByName(name: string) {
    return appspace.db
      .query('campaigns')
      .where('name', '=', name)
      .execute()
      .then((res: Array<CampaignRecord>) => res[0]);
  }
}

export const Campaign = new CampaignModel();
