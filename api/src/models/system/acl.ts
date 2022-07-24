'use strict';

import { appspace, logger } from '../../appspace';

interface RoleRecord {
  id: number;
  name: string;
}

interface UserRoleRecord {
  userid: number;
  roleid: number;
}

class ACLModel {
  async getPermsForUser(id: number) {
    return appspace.db
      .query('aclroles_aclrights')
      .join('user_role', 'user_role.roleid', 'aclroles_aclrights.roleid')
      .join('aclrights', 'aclroles_aclrights.rightid', 'aclrights.id')
      .where('user_role.userid', '=', id)
      .execute()
      .then((res: Array<any>) => res.map((right: any) => right.name));
  }

  async getRolesForUser(id: number) {
    return appspace.db
      .query('user_role')
      .join('aclroles', 'user_role.roleid', 'aclroles.id')
      .where('user_role.userid', '=', id)
      .execute()
      .then((res: Array<any>) => res.map((role: any) => role.name));
  }

  async addRoleForUser(id: number, rolename: string) {
    const role = await this.getRoleByName(rolename);

    return appspace.db
      .query('user_role')
      .insert()
      .set('roleid', role.id)
      .set('userid', id)
      .execute()
      .then((res: Array<UserRoleRecord>) => res[0]);
  }

  async getRoleByName(name: string) {
    return appspace.db
      .query('aclroles')
      .where('name', '=', name)
      .execute()
      .then((res: Array<RoleRecord>) => res[0]);
  }

  async clearRolesForUser(id: number) {
    return appspace.db
      .query('user_role')
      .delete()
      .where('userid', '=', id)
      .execute()
      .then(() => true);
  }
}

export const ACL = new ACLModel();
