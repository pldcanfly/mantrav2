"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appspace = exports.acl = exports.db = exports.logger = void 0;
const winston_1 = require("winston");
const postgresql_db_1 = require("./classes/dbs/postgresql_db");
const acl_1 = require("./models/system/acl");
const loggeroptions = {
    level: 'info',
    format: winston_1.format.combine(winston_1.format.simple(), winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }), winston_1.format.printf((info) => {
        return `[${info.timestamp}][${info.level}]: ${info.message} ${info.durationMs ? '(' + info.durationMs + 'ms)' : ''}`;
    })),
    //transports: [new transports.File({ filename: 'logs/error.log', level: 'error' }), new transports.File({ filename: 'logs/combined.log' })],
    transports: [new winston_1.transports.Console()],
};
if (process.env.NODE_ENV == 'test') {
    loggeroptions.transports = [new winston_1.transports.Console({ silent: true })];
}
exports.logger = (0, winston_1.createLogger)(loggeroptions);
exports.db = new postgresql_db_1.PostgreSQL_DB({ connectionString: process.env.DATABASE_URL });
//export const db = new PostgreSQL_DB();
exports.acl = acl_1.ACL;
exports.appspace = { logger: exports.logger, db: exports.db, acl: exports.acl };
