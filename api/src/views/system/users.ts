'use strict';

import { Flowspace } from '../../..';
import http from 'http';
import { User } from '../../models/system/user';
import { ACL } from '../../models/system/acl';
import { acl, logger } from '../../appspace';
import { z } from 'zod';
import { session } from '../../config/config';
import { flow } from '../../flower/headers';

export const name = 'UsersView';

const PostRequest = z.object({
  username: z.string(),
  password: z.string(),
});

const PatchRequest = z.object({
  username: z.string(),
  password: z.string().optional(),
});

const PatchPasswordRequest = z.object({
  password: z.string(),
});

export const post = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (!flowspace.session?.hasPerms('usermanagement')) {
    res.statusCode = 403;
    return;
  }
  try {
    const user = PostRequest.parse(flowspace.body);
    if (await User.getUserByUsername(user.username)) {
      res.statusCode = 500;
      return 'User exists';
    }

    return await User.createUser(user.username, user.password);
  } catch (e) {
    logger.error(e);
    return;
  }
};

export const patch = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  try {
    if (flowspace.params?.id) {
      if (!flowspace.session?.hasPerms('usermanagement')) {
        res.statusCode = 403;
        return;
      }

      const user = PatchRequest.parse(flowspace.body);

      await User.updateUser(flowspace.params.id, user);
      if (user.password && user.password != '') {
        await User.setPassword(flowspace.params.id, user.password);
      }
    } else {
      if (flowspace.session) {
        const password = PatchPasswordRequest.parse(flowspace.body);
        await User.setPassword(flowspace.session.user.id.toString(), password.password);
      }
    }
  } catch (e) {
    logger.error(e);
    return;
  }
};

export const get = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (flowspace.params?.id) return;

  return await User.getAllUsers();
};

export const del = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (!flowspace.session?.hasPerms('usermanagement')) {
    res.statusCode = 403;
    return;
  }

  if (flowspace.params?.id) {
    return await User.deleteUser(flowspace.params.id);
  }

  return;
};

export const UsersView = { get, post, patch, del, name };
