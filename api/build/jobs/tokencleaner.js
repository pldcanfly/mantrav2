'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const job_1 = require("../classes/scheduler/job");
const appspace_1 = require("../appspace");
const db = appspace_1.appspace.db;
class TokencleanerJob extends job_1.Job {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const days = 10;
            this.sendMessage('log', 'Cleaning tokens from before: ' + new Date(now.setTime(now.getTime() - days * 24 * 60 * 60 * 1000)).toISOString());
            yield db
                .query('activetokens')
                .delete()
                .where('createdat', '<', new Date(now.setTime(now.getTime() - days * 24 * 60 * 60 * 1000)).toISOString())
                .execute();
            this.die();
        });
    }
    die() {
        db.close();
        super.die();
    }
}
exports.default = new TokencleanerJob().run();
