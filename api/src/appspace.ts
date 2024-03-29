import { Appspace } from '..';
import { createLogger, format, transports } from 'winston';
import { PostgreSQL_DB } from './classes/dbs/postgresql_db';
import { ACL } from './models/system/acl';

import { WSNamespace } from './classes/wsnamespace';

const loggeroptions = {
  level: 'info',
  format: format.combine(
    format.simple(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),

    format.printf((info) => {
      return `[${info.timestamp}][${info.level}]: ${info.message} ${info.durationMs ? '(' + info.durationMs + 'ms)' : ''}`;
    })
  ),
  //transports: [new transports.File({ filename: 'logs/error.log', level: 'error' }), new transports.File({ filename: 'logs/combined.log' })],
  transports: [new transports.Console()],
};

if (process.env.NODE_ENV == 'test') {
  loggeroptions.transports = [new transports.Console({ silent: true })];
}

export const logger = createLogger(loggeroptions);
export let db: PostgreSQL_DB;

db = new PostgreSQL_DB({ connectionString: process.env.DATABASE_URL });

export const acl = ACL;
export const namespaces = new Map();

export const appspace: Appspace = { logger, db, acl, namespaces };
