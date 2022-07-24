'use strict';

import { appspace, logger } from '../../appspace';

interface MediaRecord {
  id: number;
  name: string;
  mediatype: MediaType;
  meta: object;
  author: string;
  createdat: Date;
  mimetype: string;
  category: string;
}

type MediaType = 'video' | 'image' | 'unknown';

class MediaModel {
  async saveMedia(name: string, type: MediaType, author: string, mimetype: string, meta: {}, category?: string) {
    return appspace.db
      .query('media')
      .insert()
      .set('name', name)
      .set('mediatype', type)
      .set('meta', meta)
      .set('author', author)
      .set('mimetype', mimetype)
      .set('category', category || 'all')
      .execute()
      .then((res: Array<MediaRecord>) => res[0]);
  }

  async updateMedia(id: number, name: string) {
    return appspace.db
      .query('media')
      .update()
      .set('name', name)
      .where('id', '=', id)
      .execute()
      .then((res: Array<MediaRecord>) => res[0]);
  }

  async getAllMedia() {
    return appspace.db
      .query('media')
      .order('createdat', 'DESC')
      .execute()
      .then((res: Array<MediaRecord>) => res);
  }

  async getMedia(id: number) {
    return appspace.db
      .query('media')
      .where('id', '=', id)
      .execute()
      .then((res: Array<MediaRecord>) => res[0]);
  }

  async removeMedia(id: number) {
    return appspace.db.query('media').delete().where('id', '=', id).execute();
  }
}

export const Media = new MediaModel();
