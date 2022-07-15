'use strict';

import { DBConfig, DBConfigs } from '../..';
import { env, debug } from './env.js';

const databases: DBConfigs = {
  local: {
    type: 'mysql',
    config: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'styria',
      debug: debug,
    },
  },
  test: {
    type: 'mysql',
    config: {
      host: 'localhost',
      user: 'tarif',
      password: '5zbFQvbbPFUMc7mk',
      database: 'tarif-test',
      debug: debug,
    },
  },
  live: {
    type: 'mysql',
    config: {
      host: 'localhost',
      user: 'tarif',
      password: '5zbFQvbbPFUMc7mk',
      database: 'tarif',
    },
  },
};

export const mysqlconfig: DBConfig = databases[env];
