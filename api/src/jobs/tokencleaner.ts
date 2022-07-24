'use strict';

import { Job } from '../classes/scheduler/job';
import { PostgreSQL_DB } from '../classes/dbs/postgresql_db';

const db = new PostgreSQL_DB();

class TokencleanerJob extends Job {
  async run() {
    const now = new Date();
    const days = 10;
    this.sendMessage('log', 'Cleaning tokens from before: ' + new Date(now.setTime(now.getTime() - days * 24 * 60 * 60 * 1000)).toISOString());
    await db
      .query('activetokens')
      .delete()
      .where('createdat', '<', new Date(now.setTime(now.getTime() - days * 24 * 60 * 60 * 1000)).toISOString())
      .execute();

    this.die();
  }

  die() {
    db.close();
    super.die();
  }
}

export default new TokencleanerJob().run();
