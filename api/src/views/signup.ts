'use strict';

import { Flowspace } from '../..';
import http from 'http';
import z from 'zod';
import { appspace } from '../appspace';
import { Raid } from '../models/raids';
import { characterparser } from '../models/characters';

export const name = 'SignupView';

const PostRequest = z.object({
  position: z.number(),
  state: z.enum(['invited', 'accepted', 'declined']),
  comment: z.string().optional(),
  character: characterparser,
});

export const get = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  return '';
};

export const patch = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (flowspace.params?.id) {
    try {
      const request = PostRequest.parse(flowspace.body);
      appspace.namespaces.get('raid')?.send('updatestate', request, flowspace.params.id);
      const raid = await Raid.getRaidById(flowspace.params.id);
      for (const index in raid.signups) {
        if (raid.signups[index].character.id === request.character.id) {
          raid.signups[index] = request;
          break;
        }
      }
      return await Raid.updateRaid(raid);
    } catch (e) {
      res.statusCode = 500;
      return;
    }
  }

  return '';
};

export const SignupView = { get, patch, name };
