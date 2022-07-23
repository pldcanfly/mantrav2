import { Appspace } from '..';
import winston from 'winston';
const { createLogger, format, transports } = winston;
import { PostgreSQL_DB } from './classes/dbs/postgresql_db.js';
import { ACL } from './models/system/acl.js';

const loggeroptions = {
  level: 'info',
  format: format.combine(
    format.simple(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),

    format.printf((info) => {
      return `[${info.timestamp}] ${info.level}: ${info.message} ${info.durationMs ? '(' + info.durationMs + 'ms)' : ''}`;
    })
  ),
  //transports: [new transports.File({ filename: 'logs/error.log', level: 'error' }), new transports.File({ filename: 'logs/combined.log' })],
  transports: [new transports.Console()],
};

if (process.env.NODE_ENV == 'test') {
  loggeroptions.transports = [new transports.Console({ silent: true })];
}

export const logger = createLogger(loggeroptions);

export const db = new PostgreSQL_DB();

export const acl = ACL;

export const appspace: Appspace = { logger, db, acl };
