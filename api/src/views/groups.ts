'use strict';

import { Flowspace } from '../..';
import http from 'http';
import { z } from 'zod';
import { string } from 'pg-format';
import { logger } from '../appspace';
import { Group, GroupRecord } from '../models/groups';
import { group } from 'console';
import { Character, characterparser, CharacterRecord } from '../models/characters';

export const name = 'GroupView';

const GETrequest = z.object({
  id: z.string().optional(),
});

const POSTrequest = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    members: characterparser.array(),
  })
  .array();

interface GroupResponse extends Omit<GroupRecord, 'members'> {
  members: Array<CharacterRecord>;
}

const insertMember = async function (groups: GroupRecord | Array<GroupRecord>) {
  if (Array.isArray(groups)) {
    let result: Array<GroupResponse> = [];
    for (const group of groups) {
      result.push((await insertMember(group)) as GroupResponse);
    }

    return result;
  } else {
    let members: Array<CharacterRecord> = [];
    for (const member of groups.members) {
      const char = await Character.getCharacterById(member);
      members = [...members, char];
    }

    return { ...groups, members };
  }
};

export const get = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  try {
    const params = GETrequest.parse(flowspace.params);
    if (params.id) return insertMember(await Group.getGroup(params.id));

    return insertMember(await Group.getGroups());
  } catch (e) {
    logger.error(e);
    res.statusCode = 500;
    return;
  }
};

export const post = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  try {
    const body = POSTrequest.parse(flowspace.body);
    for (const grp of body) {
      if (grp.id) {
        const ids = grp.members.map((item) => item.id);
        await Group.updateGroup({ id: grp.id, name: grp.name, members: ids });
      } else {
      }
    }
  } catch (e) {
    logger.error(e);
    res.statusCode = 500;
    return;
  }

  return '';
};

export const GroupView = { get, post, name };
