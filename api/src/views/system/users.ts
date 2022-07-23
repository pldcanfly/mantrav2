'use strict';

import { Flowspace } from '../../..';
import http from 'http';
import { User } from '../../models/system/user.js';
import { ACL } from '../../models/system/acl.js';
import { acl } from '../../appspace';

export const name = 'UsersView';

export const post = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {};

export const patch = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {};

export const get = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {};

export const del = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {};

export const UsersView = { get, post, patch, del, name };
