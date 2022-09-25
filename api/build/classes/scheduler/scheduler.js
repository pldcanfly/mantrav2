"use strict";
//'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobScheduler = void 0;
const bree_1 = __importDefault(require("bree"));
const jobs_1 = require("../../config/jobs");
const appspace_1 = require("../../appspace");
// @ts-ignore
const cabin_1 = __importDefault(require("cabin"));
class JobScheduler {
    constructor() {
        for (const job of jobs_1.jobs) {
            appspace_1.logger.info(`Job Scheduler: Adding ${job.name}`);
        }
        new bree_1.default({
            logger: new cabin_1.default(),
            root: false,
            workerMessageHandler: this.handleMessage,
            jobs: jobs_1.jobs,
        }).start();
    }
    // MESSAGE FORMAT
    handleMessage({ name, message }) {
        switch (message.action) {
            case 'log':
                appspace_1.logger.info(`Scheduler v1: ${name} -> ${message.value}`);
                break;
            default:
                appspace_1.logger.info(`Scheduler v1: ${name} -> ??: ${message.action} ${message.value}`);
        }
    }
}
exports.JobScheduler = JobScheduler;
