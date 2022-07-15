'use strict';

import { Flowspace } from '../../..';
import http from 'http';
import { User } from '../../models/system/user.js';
import { ACL } from '../../models/system/acl.js';
import { acl } from '../../appspace';

export const name = 'UsersView';

type UserSaveRequest = {
  vorname: string;
  nachname: string;
  unit_id: number;
  login: string;
  email: string;
  passwort: string;
  role: string;
  notiz: string;
};
type NoteSaveRequest = {
  notiz: string;
};

// const canSee => (type: "unit" | "user", userid: number, unitid: number){

// }

export const post = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (flowspace.body) {
    const body = flowspace.body as UserSaveRequest;

    if (flowspace.session && (flowspace.session.hasPerms('user.all.manage') || (flowspace.session.hasPerms('user.unit.manage') && flowspace.session.user.unit_id == body.unit_id))) {
      if (body.login && body.login != '' && body.passwort && body.passwort != '') {
        const user = await User.createUser(body.login, body.passwort);
        await User.updateUser(user.id, {
          firstname: body.vorname,
          lastname: body.nachname,
          notiz: body.notiz,
          unit_id: body.unit_id,
          email: body.email,
        });
        await ACL.clearRolesForUser(user.id);
        await ACL.addRoleForUser(user.id, body.role);
        return user;
      }
      res.statusCode = 400;
      return 'User konnte nicht angelegt werden. Benötigte Felder Login, Passwort oder Rolle nicht ausgefüllt.';
    }
  }

  res.statusCode = 403;
  return 'Rechte nicht ausreichend.';
};

export const patch = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (flowspace.params?.id && flowspace.session) {
    const userid = parseInt(flowspace.params.id);
    const user = await User.getUserById(userid);

    if (user && (flowspace.session.hasPerms('user.all.manage') || (flowspace.session.hasPerms('user.unit.manage') && flowspace.session.user.unit_id == user.unit_id))) {
      switch (flowspace.params.type) {
        case 'update':
          const body = flowspace.body as UserSaveRequest;
          if (flowspace.body) {
            if (body.login && body.login != '') {
              const roles = await ACL.getRolesForUser(userid);
              if (roles.includes('gf') && !flowspace.session.hasPerms('user.all.manage')) {
                // In NON-GF edits GF... just seize.
                res.statusCode = 403;
                return;
              }

              if (body.passwort && body.passwort != '') {
                await User.setPassword(userid, body.passwort);
              }

              if (body.role && body.role != 'gf') {
                await ACL.clearRolesForUser(userid);
                await ACL.addRoleForUser(userid, body.role);
              } else if (body.role && body.role == 'gf' && flowspace.session.hasPerms('user.all.manage')) {
                // Only GF should  update GF
                await ACL.clearRolesForUser(userid);
                await ACL.addRoleForUser(userid, body.role);
              }

              return await User.updateUser(userid, {
                username: body.login,
                firstname: body.vorname,
                lastname: body.nachname,
                notiz: body.notiz,
                unit_id: body.unit_id,
                email: body.email,
              });
            }
            res.statusCode = 400;
            return 'User konnte nicht angelegt werden. Benötigte Felder Login oder Rolle nicht ausgefüllt.';
          }
        case 'notiz':
          const notebody = flowspace.body as NoteSaveRequest;

          return await User.updateNote(userid, notebody.notiz);
        case 'file':
          const files = JSON.parse(user.files);
          files.push(parseInt(flowspace.params.file));
          user.files = JSON.stringify(files);

          return await User.updateUser(user.id, user);
      }
    } else {
      res.statusCode = 403;
      return 'Rechte nicht ausreichend.';
    }
  }

  res.statusCode = 500;
  return 'Ungültige UserID.';
};

export const get = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (flowspace.params?.type == 'notiz') {
    if (flowspace.params?.id) {
      const user = await User.getUserById(parseInt(flowspace.params?.id));
      if (flowspace.session?.hasPerms('user.all.manage') || parseInt(flowspace.params?.id) == flowspace.session?.user.id || (flowspace.session?.hasPerms('user.unit.manage') && flowspace.session.user.unit_id == user.unit_id)) {
        return user.notiz;
      }
    }
  } else {
    if (flowspace.params?.id) {
      if (flowspace.params.id == 'all') {
        if (flowspace.session) {
          return await User.getAllUsers(true);
        }
      } else {
        const roles = await ACL.getRolesForUser(parseInt(flowspace.params.id));
        const user = await User.getUserById(parseInt(flowspace.params.id));
        if (flowspace.session) {
          if (flowspace.session?.user.id != parseInt(flowspace.params.id) && !flowspace.session?.hasPerms('user.all.manage') && !(flowspace.session?.hasPerms('user.unit.manage') && flowspace.session.user.unit_id == user.unit_id)) {
            user.data = {};
          }
          user.password = '-';
          return { ...user, roles };
        }
      }
    } else {
      if (flowspace.session?.hasPerms('user.all.manage')) {
        return User.getAllUsers(false);
      } else if (flowspace.session?.hasPerms('user.allbutceo.manage')) {
        const users = await User.getAllUsers(false);
        return users.filter((user) => user.unit_id != 2);
      } else if (flowspace.session?.hasPerms('user.unit.manage')) {
        return User.getUsersForUnit(flowspace.session.user.unit_id);
      }
    }
  }

  res.statusCode = 403;
  return 'Rechte nicht ausreichend.';
};

export const del = async function (req: http.IncomingMessage, res: http.ServerResponse, flowspace: Flowspace) {
  if (flowspace.params?.id) {
    const user = await User.getUserById(parseInt(flowspace.params.id));
    if (user) {
      if (flowspace.session?.hasPerms('user.all.manage') || (flowspace.session?.hasPerms('user.all.manage') && flowspace.session?.user.unit_id == user.unit_id)) {
        return await User.deleteUser(user.id);
      }
    }
  }

  res.statusCode = 500;
  return;
};

export const UsersView = { get, post, patch, del, name };
