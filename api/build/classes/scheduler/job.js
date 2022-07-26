'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const worker_threads_1 = require("worker_threads");
class Job {
    constructor() {
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', this.handleMessage);
    }
    sendMessage(action, value) {
        if (!worker_threads_1.isMainThread) {
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({ action, value });
        }
    }
    handleMessage(e) { }
    die() {
        process.exit(0);
    }
}
exports.Job = Job;
