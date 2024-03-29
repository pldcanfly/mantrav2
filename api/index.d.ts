import jwt from 'jsonwebtoken';

import { PostgreSQL_DB } from './src/classes/dbs/postgresql_db.js';

import { JobScheduler } from './src/classes/scheduler/scheduler.js';
import { WSNamespace } from './src/classes/wsnamespace.js';
import { ACL } from './src/models/system/acl.js';
import { UserRecord } from './src/models/system/user.js';

type Appspace = {
  db: PostgreSQL_DB;
  acl: typeof ACL;
  scheduler?: JobScheduler;
  namespaces: Map<string | RegExp, WSNamespace>;
  [propName: string]: any;
};

type Flowspace = {
  session?: Session;
  message?: any;
  contentType: 'xml' | 'json';
  view?: View;
  methods?: 'any' | 'get' | 'post' | 'patch' | 'put' | 'delete';
  params?: { [propName: string]: string };
  body?: string | LoginRequestBody | PasswordChangeRequestBody | object;
  skip: Array<string>;
};

type PasswordChangeRequestBody = {
  password: string;
};

type View = {
  name: string;
  get: Function;
  post?: Function;
  patch?: Function;
  put?: Function;
  del?: Function;
};

type Session = {
  user: UserRecord;
  perms: Array<string>;
  roles: Array<string>;
  hasPerms: Function;
};

type LoginRequestBody = {
  username: string;
  password: string;
};

type Flower = {
  name: string;
  flow: Function;
};

interface DBConfigs {
  [propName: string]: DBConfig;
}

interface DBConfig {
  type: string;
  config: MysqlDBConfig;
}

interface MysqlDBConfig {
  host?: string;
  user?: string;
  password?: string;
  database?: string;
  debug?: boolean;
}

interface SessionConfig {
  salt: string;
  accessSecret: jwt.Secret;
  accessExpiresIn: string;
  refreshSecret: jwt.Secret;
  refreshExpiresIn: string;
  algorithm: jwt.Algorithm;
}

interface Filters {
  fulltext?: string;
  filter?: Array<FilterParams>;
}

interface FilterParams {
  [propName: string]: any;
}

interface LoginParams {
  token?: string;
  user?: string;
  password?: string;
}

interface ModelObject {
  [propName: string]: any;
}

interface RequestParams {
  [propName: string]: any;
}

interface UserData {}

type FileUploads = [{ filename: string; size: number; file: any }];
