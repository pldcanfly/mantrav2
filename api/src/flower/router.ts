'use strict';

import { Flowspace } from '../..';
import http from 'http';
import { routes, RouteNode } from '../config/routes.js';
import { appspace, logger } from '../appspace.js';
import fs from 'fs';
import path from 'path';
import { Media } from '../models/system/media.js';

type ParsedRouteNode = RouteNode & {
  parsed: Array<ParsedRoute>;
};

type ParsedRoute = {
  part: string;
  param: boolean;
  methods?: Array<'delete' | 'get' | 'put' | 'post' | 'patch'>;
};

const parsedroutes: Array<ParsedRouteNode> = routes.map((route: RouteNode) => {
  let routeparts = route.path.match(/[0-9a-zA-Z-_]+|:([a-z]*):/gm);
  let parsed: Array<ParsedRoute> = [];
  routeparts?.forEach((routepart: string) => {
    if (routepart.startsWith(':') && routepart.endsWith(':')) {
      parsed.push({ part: routepart.substring(1, routepart.length - 1), param: true });
    } else {
      parsed.push({ part: routepart, param: false });
    }
  });

  return {
    ...route,
    parsed,
  };
});

// EXPORTS
export const name = 'Router v2';
export const flow = function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace, next: Function) {
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

  // Skip auth-routes
  if (req.url?.startsWith('/auth')) {
    logger.info('Route v2: Auth Route skipping');
    next();
    return;
  }

  // Quickly handle static routes
  for (let i = 0; i < parsedroutes.length; i++) {
    if (parsedroutes[i].path == req.url) {
      flowspace.view = parsedroutes[i].view;

      if (parsedroutes[i].params) flowspace.params = parsedroutes[i].params;

      logger.info(`Route v2: Static Route ${parsedroutes[i].view.name}`);
      next();
      return;
    }
  }

  // Now lets look more in deepth
  const url = req.url?.split('?'); // Split of ?get=parameters
  if (url) {
    let urlparts = url[0].match(/[0-9a-zA-Z-_. %]+/gm);

    for (let i = 0; i < parsedroutes.length; i++) {
      // For because we wanna break out later if we found a match
      let route = parsedroutes[i];
      let params: { [propName: string]: string } = {};

      if (route.parsed.length == urlparts?.length) {
        let match = true; // This might be a potential match, now look if it isn't
        urlparts?.forEach((part: string, index: number) => {
          if (part != route.parsed[index].part) {
            // The name does not match up
            if (!route.parsed[index].param) {
              //  ... and its not even a parameter
              match = false;
            } else {
              params[route.parsed[index].part] = part;
            }
          }
        });

        if (match) {
          // Match survived till here, it is a match!
          const getparams: { [propName: string]: string } = {};

          if (url[1]) {
            const pairs = url[1].split('&');

            for (const pair of pairs) {
              const keyval = pair.split('=');

              getparams[keyval[0]] = keyval[1] ? keyval[1] : '';
            }
          }
          logger.info(`Route v2: Dynamic Route ${route.view.name}`);
          flowspace.view = route.view;
          if (route.params) params = { ...params, ...parsedroutes[i].params };
          flowspace.params = { ...getparams, ...params };
          next();
          return;
        }
      }
    }
  }

  logger.error('Route v2: 404');
  res.statusCode = 404; // We coudln't find a route? 404 it..
  res.end('View not found');
};

export default { flow, name };
