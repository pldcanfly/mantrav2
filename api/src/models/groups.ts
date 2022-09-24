'use strict';
import { appspace, logger } from '../appspace.js';

export interface GroupRecord {
  id: string;
  name: string;
  members: Array<string>;
}

class GroupModel {
  async getGroups() {
    return appspace.db
      .query('groups')
      .execute()
      .then((res: Array<GroupRecord>) => res);
  }

  async getGroup(id: string) {
    return appspace.db
      .query('groups')
      .where('id', '=', id)
      .execute()
      .then((res: Array<GroupRecord>) => res);
  }

  async insertGroup() {}

  async updateGroup(grp: GroupRecord) {
    return appspace.db
      .query('groups')
      .update()

      .set('name', grp.name)
      .set('members', JSON.stringify(grp.members))
      .where('id', '=', grp.id)
      .execute()
      .then((res) => res);
  }

  async deleteGroup(id: string) {
    return appspace.db.delete().query('groups').where('id', '=', id).execute();
  }
}

export const Group = new GroupModel();
