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
  jobs.push({
    name: 'calc',
    interval: '30m',
    outputWorkerMetadata: true,
    worker: {
      resourceLimits: {
        maxYoungGenerationSizeMb: 4096,
        codeRangeSizeMb: 32,
        stackSizeMb: 2048,
      },
    },
  });

  jobs.push({
    name: 'archive',
    cron: '0 3 * * *',
    timeout: '2s',
    outputWorkerMetadata: true,
    worker: {
      resourceLimits: {
        maxYoungGenerationSizeMb: 4096,
        codeRangeSizeMb: 32,
        stackSizeMb: 2048,
      },
    },
  });
} else {
  jobs.push({
    name: 'archive',
    //cron: '35 13 * * *',
    timeout: '2s',
    outputWorkerMetadata: true,
    worker: {
      resourceLimits: {
        maxYoungGenerationSizeMb: 4096,
        codeRangeSizeMb: 32,
        stackSizeMb: 2048,
      },
    },
  });
}
