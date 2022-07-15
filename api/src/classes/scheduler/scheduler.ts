//'use strict';

import Bree from 'bree';
import { jobs } from '../../config/jobs.js';
import { logger, appspace } from '../../appspace.js';
import path from 'path';
import { Worker } from 'worker_threads';
import { JobMessage } from './job.js';
import { differenceInMilliseconds } from 'date-fns';

// @ts-ignore
import Cabin from 'cabin';

export class JobScheduler {
  private _profilers: { [propName: string]: Date | undefined } = {};
  private _scheduler = new Bree({
    logger: new Cabin(),
    root: false,
    workerMessageHandler: this.handleMessage,
  });

  constructor() {
    for (const job of jobs) {
      this._scheduler.add({
        path: path.resolve(path.join(process.env.JOB_ROOT || '', `${job.name}.js`)),
        ...job,
      });

      logger.info(`Job Scheduler: Adding ${job.name}`);
    }
    this._scheduler.workers;
    this._scheduler.start();
  }

  getWorkerByName(name: string) {
    if ((this._scheduler.workers as { [propName: string]: Worker })[name]) return (this._scheduler.workers as { [propName: string]: Worker })[name];
    return undefined;
  }

  // MESSAGE FORMAT
  handleMessage({ name, message }: { name: string; message: JobMessage }) {
    switch (message.action) {
      case 'log':
        logger.info(`Scheduler v1: ${name} -> ${message.value}`);
        break;

      default:
        logger.info(`Scheduler v1: ${name} -> Unknown Messagetype: ${message.action} ${message.value}`);
    }

    //this.getWorkerByName(name)?.postMessage('die');
  }
}
