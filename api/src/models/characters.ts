'use strict';
import { z } from 'zod';
import { appspace, logger } from '../appspace.js';

export interface CharacterRecord {
  id: string;
  name: string;
  race: Race;
  clazz: Clazz;
  specc: Specc;
  offspecc?: Specc | null;
  female: boolean;
  accountid: string;
}

type Clazz = 'warrior' | 'paladin' | 'hunter' | 'rogue' | 'priest' | 'shaman' | 'mage' | 'warlock' | 'druid' | 'deathknight' | 'unknown';

type Race = 'orc' | 'tauren' | 'troll' | 'undead' | 'bloodelf' | 'unknown';

type Specc =
  | 'warms'
  | 'wfury'
  | 'wprot'
  | 'pholy'
  | 'pprot'
  | 'pretri'
  | 'hbm'
  | 'hmm'
  | 'hsv'
  | 'rassa'
  | 'rcombat'
  | 'rsub'
  | 'prdisc'
  | 'prshadow'
  | 'sele'
  | 'sench'
  | 'sresto'
  | 'marcane'
  | 'mfire'
  | 'mfrost'
  | 'waffli'
  | 'wdemo'
  | 'wdestro'
  | 'dbalance'
  | 'dferal'
  | 'dresto'
  | 'dbear'
  | 'dkblood'
  | 'dkfrost'
  | 'dkunholy'
  | 'unknown';

export const characterparser = z.object({
  id: z.string(),
  name: z.string(),
  race: z.enum(['orc', 'tauren', 'troll', 'undead', 'bloodelf', 'unknown']),
  clazz: z.enum(['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'shaman', 'mage', 'warlock', 'druid', 'deathknight', 'unknown']),
  specc: z.enum([
    'warms',
    'wfury',
    'wprot',
    'pholy',
    'pprot',
    'pretri',
    'hbm',
    'hmm',
    'hsv',
    'rassa',
    'rcombat',
    'rsub',
    'prdisc',
    'prshadow',
    'sele',
    'sench',
    'sresto',
    'marcane',
    'mfire',
    'mfrost',
    'waffli',
    'wdemo',
    'wdestro',
    'dbalance',
    'dferal',
    'dresto',
    'dbear',
    'dkblood',
    'dkfrost',
    'dkunholy',
    'unknown',
  ]),
  offspecc: z
    .enum([
      'warms',
      'wfury',
      'wprot',
      'pholy',
      'pprot',
      'pretri',
      'hbm',
      'hmm',
      'hsv',
      'rassa',
      'rcombat',
      'rsub',
      'prdisc',
      'prshadow',
      'sele',
      'sench',
      'sresto',
      'marcane',
      'mfire',
      'mfrost',
      'waffli',
      'wdemo',
      'wdestro',
      'dbalance',
      'dferal',
      'dresto',
      'dbear',
      'dkblood',
      'dkfrost',
      'dkunholy',
      'unknown',
    ])
    .nullish(),
  female: z.boolean(),
  accountid: z.string(),
});

class CharacterModel {
  async getCharacters() {
    return appspace.db
      .query('characters')
      .execute()
      .then((res: Array<CharacterRecord>) => res);
  }

  async getCharactersForAccount(id: string) {
    return appspace.db
      .query('characters')
      .where('accountid', '=', id)
      .execute()
      .then((res: Array<CharacterRecord>) => res);
  }

  async getCharacterById(id: string) {
    return appspace.db
      .query('characters')
      .where('id', '=', id)
      .execute()
      .then((res: Array<CharacterRecord>) => res[0]);
  }

  async updateCharacter(char: CharacterRecord) {
    return appspace.db
      .query('characters')
      .update()
      .set(char)
      .where('id', '=', char.id)
      .execute()
      .then((res: Array<CharacterRecord>) => res);
  }

  async insertCharacter(char: CharacterRecord) {
    return appspace.db
      .query('characters')
      .insert()
      .set('name', char.name)
      .set('race', char.race)
      .set('clazz', char.clazz)
      .set('specc', char.specc)
      .set('offspecc', char.offspecc)
      .set('female', char.female)
      .set('accountid', char.accountid)
      .execute()
      .then((res: Array<CharacterRecord>) => res[0]);
  }

  async deleteCharacter(id: string) {
    return appspace.db.query('characters').delete().where('id', '=', id).execute();
  }
}

export const Character = new CharacterModel();
