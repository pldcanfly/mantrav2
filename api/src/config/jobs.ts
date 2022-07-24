'use strict';

import { JobOptions } from 'bree/types';

export const jobs: Array<JobOptions> = [];

if (process.env.NODE_ENV != 'local') {
} else {
}
