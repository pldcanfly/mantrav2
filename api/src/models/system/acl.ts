'use strict';

import { appspace, logger } from '../../appspace.js';

type RoleRecord = {
  id: number;
  name: string;
};

type UserRoleRecord = {
  userid: number;
  roleid: number;
};

class ACLModel {
  async getPermsForUser(id: number) {
    return appspace.db
      .query('acl_permissions')
      .join('user_roles', 'roleid', 'roleid')
      .join('acl_rights', 'rightsid', 'id')
      .where('userid', '=', id)
      .execute()
      .then((res: Array<any>) => res.map((right: any) => right.name));
  }

  async getRolesForUser(id: number) {
    return appspace.db
      .query('user_roles')
      .join('acl_roles', 'roleid', 'id')
      .where('userid', '=', id)
      .execute()
      .then((res: Array<any>) => res.map((role: any) => role.name));
  }

  async addRoleForUser(id: number, rolename: string) {
    const role = await this.getRoleByName(rolename);

    return appspace.db
      .query('user_roles')
      .insert()
      .set('roleid', role.id)
      .set('userid', id)
      .execute()
      .then((res: Array<UserRoleRecord>) => res[0]);
  }

  async getRoleByName(name: string) {
    return appspace.db
      .query('acl_roles')
      .where('name', '=', name)
      .execute()
      .then((res: Array<RoleRecord>) => res[0]);
  }

  async clearRolesForUser(id: number) {
    return appspace.db
      .query('user_roles')
      .delete()
      .where('userid', '=', id)
      .execute()
      .then(() => true);
  }
}

export const ACL = new ACLModel();
