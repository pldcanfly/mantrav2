'use strict';

import { Flowspace } from '../..';
import http from 'http';
import { Character, characterparser } from '../models/characters';
import { logger } from '../appspace';

export const name = 'CharacterView';

export const get = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (flowspace.params?.mine && flowspace.session) return await Character.getCharactersForAccount(flowspace.session.user.id.toString());

  return await Character.getCharacters();
};

export const post = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  try {
    if (flowspace.params?.id && flowspace.params.id !== '-1') {
      const char = characterparser.parse((flowspace.body as any)?.character);
      return await Character.updateCharacter(char);
    } else {
      const char = characterparser.parse((flowspace.body as any)?.character);
      return await Character.insertCharacter(char);
    }
  } catch (e) {
    logger.error(e);
    res.statusCode = 500;
    return;
  }
};

export const del = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (flowspace.params?.id) {
    return await Character.deleteCharacter(flowspace.params.id);
  }

  return;
};

export const CharacterView = { get, post, del, name };
