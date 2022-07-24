'use strict';

import { Flowspace } from '../..';
import http from 'http';
import { User } from '../models/system/user';

export const name = 'TestView';

export const get = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  return await User.getAllUsers();
};

export const TestView = { get, name };
