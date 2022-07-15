'use strict';
import { randomFillSync } from 'crypto';
import { appspace, logger } from '../../appspace.js';

type FileRecord = {
  id: number;
  name: string;
  type: string;
  size: number;
  path: string;
  ip: string;
  deletekey: number;
  createdat: Date;
};

class FilesModel {
  async insertFile(filename: string, path: string, type: string, size: string, ip: string) {
    const key = randomFillSync(Buffer.alloc(16)).toString('hex');
    return appspace.db
      .query('files')
      .insert()
      .set('name', filename)
      .set('type', type)
      .set('size', size)
      .set('path', path)
      .set('deletekey', key)
      .set('ip', ip)
      .execute()
      .then((res: Array<FileRecord>) => res[0]);
  }

  async getFile(id: number) {
    return appspace.db
      .query('files')
      .where('id', '=', id)
      .execute()
      .then((res: Array<FileRecord>) => res[0]);
  }

  async deleteFile(deletekey: string) {
    const record = await appspace.db
      .query('files')
      .where('deletekey', '=', deletekey)
      .execute()
      .then((res: Array<FileRecord>) => res[0]);
    await appspace.db.query('files').delete().where('deletekey', '=', deletekey).execute();
    return record.path;
  }
}

export const Files = new FilesModel();
