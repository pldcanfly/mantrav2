'use strict';

import { Flowspace } from '../..';
import http from 'http';
import { User } from '../models/system/user';
import { Token } from '../models/system/token';
import { logger } from '../appspace';
import { ACL } from '../models/system/acl';
import { z } from 'zod';

export interface LoginRequestBody {
  username: string;
  password: string;
}

const login = async function (res: http.ServerResponse, flowspace: Flowspace) {
  try {
    var body = z
      .object({
        username: z.string(),
        password: z.string(),
      })
      .parse(flowspace.body);
  } catch (e) {
    logger.error('Auth: Login failed -> No Valid BodyData');
    res.statusCode = 401;
    flowspace.message = 'Wrong Username or Password';
    return;
  }

  if (body) {
    const username = body.username.toLowerCase();
    const password = body.password;

    if (await User.checkPassword(username, password)) {
      flowspace.message = await Token.issueTokenPairWithCredentials(await User.getUserByUsername(username));
    } else {
      res.statusCode = 401;
      flowspace.message = 'Wrong Username or Password';
      logger.error('Auth: Login failed -> Invalid Password');
    }
  }
};

const logout = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (req.headers.authorization) {
    flowspace.message = await Token.invalidateToken(req.headers.authorization.slice(7)); // Slice "Bearer " off
  } else {
    logger.error('Auth: Logout failed -> No Token supplied');
    res.statusCode = 403;
    flowspace.message = 'Token Error';
  }
  return;
};

const refresh = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (req.headers.authorization) {
    const tokenpair = await Token.issueTokenPairWithRefresh(req.headers.authorization.slice(7)); // Slice "Bearer " off
    if (tokenpair) {
      flowspace.message = tokenpair;
    } else {
      res.statusCode = 403;
      flowspace.message = 'Token Error';
    }
  } else {
    logger.error('Auth: Refresh failed -> No Token supplied');
    res.statusCode = 403;
    flowspace.message = 'Token Error';
  }

  return;
};

const createSession = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (!req.url?.startsWith('/auth')) {
    if (req.headers.authorization) {
      const user = await Token.validateToken(req.headers.authorization.slice(7));

      if (user) {
        const perms = await ACL.getPermsForUser(user.id);
        const roles = await ACL.getRolesForUser(user.id);
        logger.info(`Session initiated for User ${user.id}, Roles: ${roles}`);
        return {
          user,
          perms,
          roles,
          hasPerms: (perm: string) => {
            return perms.includes('acl.bypass') || perms.includes(perm);
          },
        };
      }
    }
  }
  logger.info(`No Session`);
  return undefined;
};

// EXPORTS
export const name = 'Auth';
export const flow = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace, next: Function) {
  // Catch Auth-URLS

  if (req.url?.startsWith('/auth')) {
    logger.info('Auth-URL detected');
    switch (req.url) {
      case '/auth/login':
        logger.info('Login detected');
        await login(res, flowspace);
        break;
      case '/auth/logout':
        await logout(req, res, flowspace);
        break;
      case '/auth/refresh':
        logger.info('Refresh detected');
        await refresh(req, res, flowspace);
        break;
    }
    flowspace.skip.push('Router v2');
  }

  flowspace.session = await createSession(req, res, flowspace);
  next();
};

export default { flow, name };
