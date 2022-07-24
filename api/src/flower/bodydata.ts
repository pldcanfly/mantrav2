'use strict';

import { Flowspace } from '../..';
import http from 'http';

import busboy from 'busboy';
import fs from 'fs';
import path from 'path';
import { randomFillSync } from 'crypto';
import os from 'os';

import { logger } from '../appspace';
import internal from 'stream';

interface BusBoyFile extends internal.Readable {
  truncated?: boolean;
}

// EXPORTS
export const name = 'BodyData';

export const flow = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace, next: Function) {
  switch (req.method?.toLowerCase()) {
    case 'post':
    case 'put':
    case 'patch':
      if (req.headers['content-type']?.startsWith('multipart/form-data') || req.headers['content-type']?.startsWith('application/x-www-form-urlencoded')) {
        handleMultipart(req, res, flowspace, next);
      } else {
        handleRaw(req, res, flowspace, next);
      }
      break;
    default:
      next();
      break;
  }
};

// Helpers

const handleRaw = (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace, next: Function) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString(); // convert Buffer to string
  });
  req.on('end', () => {
    try {
      flowspace.body = JSON.parse(body);
    } catch {
      flowspace.body = body;
    }
    next();
  });
};

const handleMultipart = (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace, next: Function) => {
  const limits = {
    fileSize: 100 * 1024 * 1024, // 100 MB limit
  };
  const errors: Array<string> = [];
  if (req.url?.startsWith('/medialib')) {
    limits.fileSize = Infinity; // No Limit for Media-Lib
  }

  const bb = busboy({
    headers: req.headers,
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
    limits,
  });
  bb.on('file', (name, file: BusBoyFile, info: any) => {
    const { filename, encoding, mime } = info;
    const saveTo = path.join(os.tmpdir(), `${filename}-${randomFillSync(Buffer.alloc(16)).toString('hex')}`);
    const fstream = fs.createWriteStream(saveTo);

    fstream.on('error', (e) => {
      logger.error(e);
    });
    // fstream.on('close', () => {

    // });
    var i = 0;
    file.on('data', function (data) {
      try {
        fstream.write(data);
      } catch (e) {
        logger.error(e);
      }
    });

    file.on('end', () => {
      fstream.close();
      if (file.truncated) {
        logger.error('Limit triggered');
        fs.unlinkSync(saveTo);
        errors.push('Diese Datei ist zu groß.');
      } else {
        logger.info('Write file to Disk finshed');
      }
    });

    flowspace.body = {
      type: mime,
      name: filename,
      path: saveTo,
    };
  });

  bb.on('close', () => {
    logger.info('Done parsing Upload');

    if (errors.length > 0) {
      res.statusCode = 413;
      res.setHeader('Content-Type', 'application/json');

      res.end(JSON.stringify({ status: res.statusCode, message: errors }));
      return;
    } else {
      next();
    }
  });
  req.pipe(bb);
};

export default { flow, name };
