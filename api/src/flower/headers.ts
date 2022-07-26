'use strict';

import { Flowspace } from '../..';
import http from 'http';

// EXPORTS
export const name = 'Headers';
export const flow = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace, next: Function) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Deal with OPTIONS request here
  if (req.method?.toLowerCase() == 'options') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // DEAL with TRACE request here
  if (req.method?.toLowerCase() == 'trace') {
    res.end('');
    return;
  }

  next();
};

export default { flow, name };
