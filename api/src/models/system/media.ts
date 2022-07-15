'use strict';

import { MediaModelEntry, MediaType } from '../../../index.js';
import { appspace, logger } from '../../appspace.js';

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
      .then((res: Array<MediaModelEntry>) => res[0]);
  }

  async updateMedia(id: number, name: string) {
    return appspace.db
      .query('media')
      .update()
      .set('name', name)
      .where('id', '=', id)
      .execute()
      .then((res: Array<MediaModelEntry>) => res[0]);
  }

  async getAllMedia() {
    return appspace.db
      .query('media')
      .order('createdat', 'DESC')
      .execute()
      .then((res: Array<MediaModelEntry>) => res);
  }

  async getMedia(id: number) {
    return appspace.db
      .query('media')
      .where('id', '=', id)
      .execute()
      .then((res: Array<MediaModelEntry>) => res[0]);
  }

  async removeMedia(id: number) {
    return appspace.db.query('media').delete().where('id', '=', id).execute();
  }
}

export const Media = new MediaModel();
