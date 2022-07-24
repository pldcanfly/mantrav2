//'use strict';

import Bree from 'bree';
import { jobs } from '../../config/jobs';
import { logger } from '../../appspace';
import { JobMessage } from './job';

// @ts-ignore
import Cabin from 'cabin';

export class JobScheduler {
  constructor() {
    for (const job of jobs) {
      logger.info(`Job Scheduler: Adding ${job.name}`);
    }

    new Bree({
      logger: new Cabin(),
      root: false,
      workerMessageHandler: this.handleMessage,
      jobs,
    }).start();
  }

  // MESSAGE FORMAT
  handleMessage({ name, message }: { name: string; message: JobMessage }) {
    switch (message.action) {
      case 'log':
        logger.info(`Scheduler v1: ${name} -> ${message.value}`);
        break;

      default:
        logger.info(`Scheduler v1: ${name} -> ??: ${message.action} ${message.value}`);
    }
  }
}
