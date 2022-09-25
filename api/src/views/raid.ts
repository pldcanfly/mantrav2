'use strict';

import { Flowspace } from '../..';
import http from 'http';
import { Raid } from '../models/raids';
import { z } from 'zod';
import { appspace, logger } from '../appspace';
import { characterparser } from '../models/characters';

export const name = 'RaidView';

const PostRequest = z.object({
  id: z.string().optional(),
  name: z.string(),
  date: z.string(),
  description: z.string().optional(),
  icon: z.string(),
  size: z.number().min(0),
  signups: z
    .object({
      position: z.number(),
      state: z.enum(['invited', 'accepted', 'declined']),
      character: characterparser,
    })
    .array(),
});

export const get = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (flowspace.params?.id) {
    return await Raid.getRaidById(flowspace.params.id);
  }
  return await Raid.getRaids();
};

export const post = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  try {
    const raid = PostRequest.parse(flowspace.body);

    if (!flowspace.session?.hasPerms('manage.raid')) {
      res.statusCode = 403;
      return;
    }

    if (raid.id) {
      appspace.namespaces.get('raid')?.send('updateraid', { ...raid, id: raid.id }, raid.id);

      return await Raid.updateRaid({ ...raid, id: raid.id });
    } else {
      return await Raid.insertRaid(raid);
    }

    // Add Raid
  } catch (e) {
    logger.error(e);
    res.statusCode = 500;
    return '';
  }
};

export const RaidView = { get, post, name };
