'use strict';

import { session } from '../../config/config';
import crypto from 'crypto';
import { appspace, logger } from '../../appspace';
import { UserData } from '../../..';

export interface UserRecord {
  id: number;
  username: string;
  password: string;
  data: UserData;
}

class UserModel {
  async getAllUsers() {
    return appspace.db
      .query('user')
      .execute()
      .then((result: Array<UserRecord>) => result);
  }

  async deleteUser(id: number) {
    return appspace.db
      .query('user')
      .delete()
      .where('id', '=', id)
      .execute()
      .then((res: any) => res);
  }

  async getUserById(id: number) {
    return appspace.db
      .query('user')
      .where('id', '=', id)
      .execute()
      .then((result: Array<UserRecord>) => result[0]);
  }

  async getUserByUsername(search: string) {
    return appspace.db
      .query('user')
      .where('username', '=', search, 'OR')
      .execute()
      .then((result: Array<UserRecord>) => result[0]);
  }

  async checkPassword(login: string, password: string) {
    const user = await this.getUserByUsername(login);

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

  async createUser(name: string, password: string) {
    return appspace.db
      .query('user')
      .insert()
      .set('username', name.trim())
      .set('password', this.cryptPassword(password.trim(), this.generateSalt()))
      .execute()
      .then((result: Array<UserRecord>) => result[0]);
  }

  async updateUser(id: number, user: any) {
    const query = appspace.db.query('user').update();

    if (user.username) query.set('username', user.username.trim());
    if (user.data) query.set('data', user.data);

    return query
      .where('id', '=', id)
      .execute()
      .then((result: Array<UserRecord>) => result[0]);
  }

  async setPassword(id: number, password: string) {
    return appspace.db
      .query('user')
      .update()
      .set('password', this.cryptPassword(password, this.generateSalt()))
      .where('id', '=', id)
      .execute()
      .then((result: any) => result);
  }
}

export const User = new UserModel();
