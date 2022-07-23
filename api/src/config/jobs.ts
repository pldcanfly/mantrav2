'use strict';

interface JobOptions {
  name?: string | undefined;
  path?: string | (() => void) | undefined;
  timeout?: number | string | boolean | undefined;
  interval?: number | string | undefined;
  date?: Date | undefined;
  cron?: string | undefined;
  hasSeconds?: boolean | undefined;
  cronValidate?: object | undefined;
  closeWorkerAfterMs?: number | undefined;
  worker?: object | undefined;
  outputWorkerMetadata?: boolean | undefined;
}

export const jobs: Array<JobOptions> = [];

if (process.env.NODE_ENV != 'local') {
} else {
}
