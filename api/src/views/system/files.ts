'use strict';

import { Flowspace } from '../../..';
import { logger } from '../../appspace';

import http from 'http';
import path from 'path';
import fs from 'fs';

import { Files } from '../../models/system/files';
import { randomFillSync } from 'crypto';

export const name = 'FilesView';

export const get = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (flowspace.params?.hash && flowspace.params?.filename) {
    //res.writeHead(200, { 'Content-type': entiy.mimetype });
    const deliverPath = path.join('static', 'files', flowspace.params.hash, decodeURI(flowspace.params.filename));
    console.log(deliverPath);
    if (fs.existsSync(deliverPath)) {
      res.end(fs.readFileSync(deliverPath));

      return;
    }
  } else if (flowspace.params?.id) {
    const file = await Files.getFile(parseInt(flowspace.params.id));
    if (file) {
      return file;
    }
  } else {
    res.statusCode = 404;
    return '';
  }
};

export const put = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (flowspace.body) {
    const body = flowspace.body as {
      type?: string;
      name: string;
      path: string;
    };

    if (body.name) {
      const stats = fs.statSync(body.path);
      const ip = req.socket.remoteAddress || '0.0.0.0';
      const saveToDir = path.join('static', 'files', `${randomFillSync(Buffer.alloc(16)).toString('hex')}`);
      const saveToPath = path.join(saveToDir, `${body.name}`);

      const file = await Files.insertFile(body.name, saveToPath, body.type || 'unknown', stats.size.toString(), ip);

      if (!fs.existsSync(saveToDir)) {
        fs.mkdirSync(saveToDir);
      }

      return await fs.promises
        .copyFile(body.path, saveToPath)
        .then(() => {
          fs.unlinkSync(body.path);
          return { deletekey: file.deletekey, id: file.id };
        })
        .catch(() => {
          res.statusCode = 500;
          return;
        });
    }
  }
  res.statusCode = 500;
  return '';
};

export const del = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (flowspace.params?.id) {
    const filePath = await Files.deleteFile(flowspace.params.id);
    fs.unlinkSync(filePath);
    return;
  }

  res.statusCode = 403;
  return;
};

export const FilesView = { get, put, del, name };
