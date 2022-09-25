'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appspace_1 = require("./appspace");
appspace_1.logger.info('  ___   powered by:');
appspace_1.logger.info(' |  _|   _____ _____ ____           _____ _____ _____');
appspace_1.logger.info(' | |    |   __|     |    \\   ____  |  ___|     |   __|');
appspace_1.logger.info(' | |    |__   | | | |  |  | |____| | |___| | | |__   |');
appspace_1.logger.info(' | |_   |_____|_|_|_|____/         |_____|_|_|_|_____|');
appspace_1.logger.info(' |___|    Tina was here\n');
appspace_1.logger.info('Starting up SMD-CMS...');
appspace_1.logger.info(`Environment: ${process.env.NODE_ENV}`);
/* Scheduler */
const jobs_1 = require("./config/jobs");
const scheduler_1 = require("./classes/scheduler/scheduler");
if (jobs_1.jobs.length > 0) {
    appspace_1.logger.info('Job Scheduler: Found jobs, starting Scheduler');
    appspace_1.appspace.scheduler = new scheduler_1.JobScheduler();
}
/* Flow */
const flow_1 = __importDefault(require("./classes/flow"));
const headers_1 = __importDefault(require("./flower/headers"));
const view_1 = __importDefault(require("./flower/view"));
const router_1 = __importDefault(require("./flower/router"));
const bodydata_1 = __importDefault(require("./flower/bodydata"));
const auth_1 = __importDefault(require("./flower/auth"));
const static_1 = __importDefault(require("./flower/static"));
const flow = new flow_1.default();
flow.use(headers_1.default);
flow.use(static_1.default);
flow.use(bodydata_1.default);
flow.use(auth_1.default);
flow.use(router_1.default);
flow.use(view_1.default);
flow.listen();
appspace_1.logger.info('Listening...');
