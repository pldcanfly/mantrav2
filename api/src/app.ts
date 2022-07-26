'use strict';

import { appspace, logger } from './appspace';

logger.info('  ___   powered by:');
logger.info(' |  _|   _____ _____ ____           _____ _____ _____');
logger.info(' | |    |   __|     |    \\   ____  |  ___|     |   __|');
logger.info(' | |    |__   | | | |  |  | |____| | |___| | | |__   |');
logger.info(' | |_   |_____|_|_|_|____/         |_____|_|_|_|_____|');
logger.info(' |___|    Tina was here\n');

logger.info('Starting up SMD-CMS...');
logger.info(`Environment: ${process.env.NODE_ENV}`);

/* Scheduler */
import { jobs } from './config/jobs';
import { JobScheduler } from './classes/scheduler/scheduler';

if (jobs.length > 0) {
  logger.info('Job Scheduler: Found jobs, starting Scheduler');
  appspace.scheduler = new JobScheduler();
}

/* Flow */
import Flow from './classes/flow';
import Headers from './flower/headers';
import View from './flower/view';
import Router from './flower/router';
import BodyData from './flower/bodydata';
import Auth from './flower/auth';
import Static from './flower/static';

const flow = new Flow();

flow.use(Headers);
flow.use(Static);
flow.use(BodyData);
flow.use(Auth);
flow.use(Router);
flow.use(View);
flow.listen();
logger.info('Listening...');
