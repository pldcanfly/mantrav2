'use strict';

import { Flowspace } from '../..';
import http from 'http';

import mobile from 'is-mobile';

import { Click } from '../models/click.js';

export const name = 'ClicktrackView';

export const get = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  switch (flowspace.params?.type) {
    case 'click':
      if (flowspace.params?.campaign && flowspace.params?.pos) {
        const isMobile = mobile({ ua: req.headers['user-agent'] ?? '' });
        await Click.insertClick(flowspace.params.campaign, 'click', req.headers['user-agent'] || '', isMobile, { pos: flowspace.params.pos, url: flowspace.params?.ref });
        if (flowspace.params?.ref) {
          if (!flowspace.params?.xhr) res.writeHead(301, { Location: decodeURIComponent(flowspace.params.ref) });
          res.end();
        }
      }

      break;
    case 'impression':
      if (flowspace.params?.campaign) {
        const isMobile = mobile({ ua: req.headers['user-agent'] ?? '' });
        await Click.insertClick(flowspace.params.campaign, 'impression', req.headers['user-agent'] || '', isMobile, { ase: flowspace.params?.ase || '0' });
      }
      break;
  }

  return;
};

export const ClicktrackView = { get, name };
