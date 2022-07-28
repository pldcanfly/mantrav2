'use strict';

import { Flowspace } from '../..';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { Media } from '../models/system/media';
import { logger } from '../appspace';

// EXPORTS
export const name = 'Static';
export const flow = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace, next: Function) {
  // SERVE STATIC
  if (req.url?.startsWith('/media/')) {
    const id = req.url.split('/').pop();
    if (id) {
      fs.readFile(path.join('static', 'media', id), async function (err, content) {
        if (err) {
          res.statusCode = 404;
          logger.error(`Media: Couldn't serve ${req.url}`, err);
          res.end();
          return;
        } else {
          const intid = parseInt(id);
          if (intid) {
            const entiy = await Media.getMedia(intid);
            res.writeHead(200, { 'Content-type': entiy.mimetype });
            res.end(content);
            logger.info(`Media: Served ${req.url}`, err);
          } else {
            res.statusCode = 404;
            logger.error(`Media: Couldn't serve ${req.url}`);
            res.end();
          }
        }
      });
      return;
    } else {
      res.statusCode = 404;
      logger.error(`Media: Couldn't serve ${req.url}`);
      res.end();
      return;
    }
  }

  next();
};

export default { flow, name };
