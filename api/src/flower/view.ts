'use strict';

import { Flowspace } from '../..';
import http from 'http';
import { logger } from '../appspace';
import jstoxml from 'jstoxml';

// EXPORTS
export const name = 'View';

const executeview = async (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) => {
  if (flowspace.view) {
    switch (req.method?.toLowerCase()) {
      case 'post':
        logger.info(`View v2: Using ${req.method}: ${flowspace.view.name}  `);
        return flowspace.view.post?.(req, res, flowspace);
      case 'patch':
        logger.info(`View v2: Using ${req.method}: ${flowspace.view.name}  `);
        return flowspace.view.patch?.(req, res, flowspace);
      case 'delete':
        logger.info(`View v2: Using ${req.method}: ${flowspace.view.name}  `);
        return flowspace.view.del?.(req, res, flowspace);
      case 'put':
        logger.info(`View v2: Using ${req.method}: ${flowspace.view.name}  `);
        return flowspace.view.put?.(req, res, flowspace);
      case 'get':
      default:
        logger.info(`View v2: Using ${req.method}: ${flowspace.view.name}  `);
        return flowspace.view.get?.(req, res, flowspace);
    }
  }
};

export const flow = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace, next: Function) {
  if (flowspace.view) {
    flowspace.message = await executeview(req, res, flowspace);
    logger.info(`View v2: Executed ${flowspace.view.name} ${res.statusCode}`);
  } else if (flowspace.message) {
    logger.info('View v2: Using Message');
  } else {
    logger.error('View v2: No view, no message, no service.');
    res.statusCode = 404;
  }

  if (!flowspace.message) {
    switch (res.statusCode) {
      case 404:
        flowspace.message = 'Not Found';
        break;
      case 403:
        flowspace.message = 'Forbidden';
        break;
      case 500:
        flowspace.message = 'Internal Server Error';
        break;
    }
  }
  if (!res.writableEnded) {
    if (flowspace.contentType == 'xml') {
      res.setHeader('Content-Type', 'application/xml');
      res.end(
        jstoxml.toXML(flowspace.message, {
          header: true,
          indent: '  ',
        })
      );
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: res.statusCode, message: flowspace.message }));
    }
  } else {
    logger.info('View v2: Writable Ended, Skipping View');
  }

  next();
};

export default { flow, name };
