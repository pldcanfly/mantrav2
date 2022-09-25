'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_1 = require("../classes/scheduler/job");
const appspace_1 = require("../appspace");
const db = appspace_1.appspace.db;
class TokencleanerJob extends job_1.Job {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
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
