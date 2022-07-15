'use strict';

console.log('\n\npowered by:\n  ___');
console.log(' |  _|   _____ _____ ____           _____ _____ _____');
console.log(' | |    |   __|     |    \\   ____  |  ___|     |   __|');
console.log(' | |    |__   | | | |  |  | |____| | |___| | | |__   |');
console.log(' | |_   |_____|_|_|_|____/         |_____|_|_|_|_____|');
console.log(' |___|    Tina was here\n\n');

console.log('Starting up SMD-CMS...');
console.log('Environment:', process.env.NODE_ENV);
logger.info('Starting up SMD-CMS...', { env: process.env.NODE_ENV });
console.log('Logs are saved to /logs');

import { appspace, logger } from './appspace.js';

/* Scheduler */
import { jobs } from './config/jobs.js';
import { JobScheduler } from './classes/scheduler/scheduler.js';

if (jobs.length > 0) {
  logger.info('Job Scheduler: Found jobs, starting Scheduler');
  appspace.scheduler = new JobScheduler();
}

/* Flow */
import Flow from './classes/flow.js';
import Headers from './flower/headers.js';
import View from './flower/view.js';
import Router from './flower/router.js';
import BodyData from './flower/bodydata.js';

const flow = new Flow();

flow.use(Headers);
flow.use(Router);
flow.use(BodyData);
//flow.use(Auth);
flow.use(View);
flow.listen();
logger.info('Listening...');
