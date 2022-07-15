'use strict';

import { parentPort, isMainThread } from 'worker_threads';

export type JobMessage = {
  action: 'log' | 'profile' | 'profileEnd';
  value: any;
};

export class Job {
  constructor() {
    parentPort?.on('message', this.handleMessage);
  }

  sendMessage(action: any, value: any) {
    if (!isMainThread) {
      parentPort?.postMessage({ action, value });
    }
  }

  handleMessage(e: JobMessage) {}

  die() {
    process.exit(0);
  }
}
