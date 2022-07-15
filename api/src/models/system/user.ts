'use strict';

import { session } from '../../config/config.js';
import crypto from 'crypto';
import { appspace, logger } from '../../appspace.js';
import { UserObject } from '../../../index.js';

type UserData = {
  projects?: Array<{
    userid: string;
    text: string;
    note: string;
  }>;
  [propName: number]: {
    // SKill ID
    target?: number; // Cached
    value?: number; // Cached
    leader?: number; // Cached
    self?: number; // Cached
    set?: number;
    detailed: {
      [propName: number]: number; // Cached <UserID>: Value
      history: {
        [propName: number]: {
          // Survey ID
          [propName: number]: number; // <UserID>: value
        };
      };
    };
  };
};

export interface UserRecord extends UserObject {
  firstname: string;
  lastname: string;
  unit_id: number;
  notiz: string;
  files: string;
  hidden: boolean;
  data: UserData;
}

class UserModel {
  getAllUsers(basic: boolean = false) {
    const query = appspace.db.query('user');

    if (basic) {
      query.fields(['id', 'email', 'username', 'firstname', 'lastname']);
    } else {
      query.fields(['"user".id', 'email', 'username', 'firstname', 'lastname', 'unit_id', 'units.name', 'data']).join('units', 'units.id', 'user.unit_id');
    }

    return query
      .where('user.hidden', '=', false)
      .execute()
      .then((result: Array<UserRecord>) => result);
  }

  async deleteUser(id: number) {
    await appspace.db.query('feedback_graders').delete().where('userid', '=', id, 'OR').where('graderid', '=', id, 'OR').execute();
    await appspace.db.query('user_roles').delete().where('userid', '=', id).execute();
    await appspace.db.query('feedback_open').delete().where('userid', '=', id, 'OR').where('graderid', '=', id, 'OR').execute();

    return appspace.db
      .query('user')
      .delete()
      .where('id', '=', id)
      .execute()
      .then((res: any) => res);
  }

  getUserById(id: number) {
    return appspace.db
      .query('user')
      .where('id', '=', id)
      .execute()
      .then((result: Array<UserRecord>) => result[0]);
  }

  getUserByIdWithRoles(id: number) {
    return appspace.db
      .query('user')
      .join('user_roles', 'user.id', 'user_roles.userid')
      .join('acl_roles', 'user_roles.roleid', 'acl_roles.id')
      .where('user.id', '=', id)
      .execute()
      .then((result: Array<UserRecord>) => result[0]);
  }

  getUsersForUnit(id: number) {
    return appspace.db
      .query('user')
      .where('unit_id', '=', id)
      .where('user.hidden', '=', false)
      .execute()
      .then((result: Array<UserRecord>) => result);
  }

  getUserByEmail(mail: string) {
    return appspace.db
      .query('user')
      .where('email', '=', mail)
      .execute()
      .then((result: Array<UserRecord>) => result[0]);
  }

  getUserByUsernameOrEmail(search: string) {
    return appspace.db
      .query('user')
      .where('username', '=', search, 'OR')
      .where('email', '=', search, 'OR')
      .execute()
      .then((result: Array<UserRecord>) => result[0]);
  }

  async checkPassword(login: string, password: string) {
    const user = await this.getUserByUsernameOrEmail(login);

    if (user) {
      const salt = user.password.split(session.salt)[0];
      if (user.password == this.cryptPassword(password, salt)) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  }

  generateSalt() {
    return crypto.randomBytes(512).toString('hex');
  }

  generateRandomPassword() {
    return crypto.randomBytes(16).toString('hex');
  }

  cryptPassword(password: string, salt: string) {
    password = `${salt}${password}`;
    return `${salt}${session.salt}${crypto.createHash('sha256').update(password).digest('base64')}`;
  }

  createUser(name: string, password: string) {
    return appspace.db
      .query('user')
      .insert()
      .set('username', name.trim())
      .set('password', this.cryptPassword(password.trim(), this.generateSalt()))
      .execute()
      .then((result: Array<UserRecord>) => result[0]);
  }

  updateUser(id: number, user: any) {
    const query = appspace.db.query('user').update();

    if (user.username) query.set('username', user.username.trim());
    if (user.firstname) query.set('firstname', user.firstname.trim());
    if (user.lastname) query.set('lastname', user.lastname.trim());
    if (user.notiz) query.set('notiz', user.notiz.trim());
    if (user.email) query.set('email', user.email.trim().toLowerCase());
    if (user.unit_id) query.set('unit_id', user.unit_id);
    if (user.files) query.set('files', user.files);
    if (user.data) query.set('data', user.data);

    return query
      .where('id', '=', id)
      .execute()
      .then((result: Array<UserRecord>) => result[0]);
  }

  updateNote(id: number, notiz: string) {
    return appspace.db
      .query('user')
      .update()
      .set('notiz', notiz)
      .where('id', '=', id)
      .debug()
      .execute()
      .then((res: Array<UserRecord>) => res[0]);
  }

  setPassword(id: number, password: string) {
    return appspace.db
      .query('user')
      .update()
      .set('password', this.cryptPassword(password, this.generateSalt()))
      .where('id', '=', id)
      .execute()
      .then((result: any) => result);
  }

  // setPassword(oldpw: string, newpw: string) {
  //   if (this.namespace.session && this.namespace.session.role == 'unregistered') {
  //     this.namespace.status = 403;
  //     return;
  //   }

  //   const that = this;
  //   return this.getUserById(this.namespace.session && this.namespace.session.currentUser.id).then((results: any) => {
  //     if (that.namespace.session && that.namespace.session.checkPasswords(results.password, oldpw)) {
  //       return appspace.db?.query('users', that.namespace)
  //         .update()
  //         .where('id', '=', results.id)
  //         .set('password', that.cryptPassword(newpw, that.generateSalt()))
  //         .execute()
  //         .then((result: any) => true)
  //         .catch((err: Error) => console.log(err));
  //     } else {
  //       return 'Falsches Passwort';
  //     }
  //   });
  // }

  // resetPassword(email: string) {
  //   var randomPassword = this.generateRandomPassword();
  //   return appspace.db?.query('users', this.namespace)
  //     .update()
  //     .set('password', this.cryptPassword(randomPassword, this.generateSalt()))
  //     .where('email', '=', email)
  //     .execute()
  //     .then((result: any) => randomPassword)
  //     .catch((err: Error) => console.log(err));
  // }

  // validateEmail(email: string) {
  //   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   return re.test(String(email).toLowerCase());
  // }
}

export const User = new UserModel();
