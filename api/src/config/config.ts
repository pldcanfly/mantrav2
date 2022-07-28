'use strict';

interface Config {
  db: DBConfig;
  debug: boolean;
  port: number;
  session: SessionConfig;
  maxLogoFilesize: number;
  maxHeaderFilesize: number;
}

import { DBConfig, SessionConfig } from '../..';

export const useCache = true;

export const session: SessionConfig = {
  salt: '$',
  algorithm: 'HS512',
  accessExpiresIn: '3m',
  accessSecret: process.env.ACCESS_SECRET || 'very secret!',
  refreshExpiresIn: '48h',
  refreshSecret: process.env.REFRESH_SECRET || 'very secret!',
};
