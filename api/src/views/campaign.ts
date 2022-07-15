'use strict';

import { Flowspace } from '../..';
import http from 'http';
import { Campaign } from '../models/campaign.js';

export const name = 'CampaignView';

export const get = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  return await Campaign.getCampaigns();
};

export const CampaignView = { get, name };
