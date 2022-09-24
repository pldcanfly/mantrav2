'use strict';

import { View } from '../..';
import { CharacterView } from '../views/character';
import { GroupView } from '../views/groups';
import { RaidView } from '../views/raid';
import { SignupView } from '../views/signup';
import { FilesView } from '../views/system/files';
import { UsersView } from '../views/system/users';

export interface RouteParams {
  [propName: string]: any;
}

export interface RouteNode {
  path: string;
  view: View;
  params?: RouteParams;
}

export const routes: Array<RouteNode> = [
  {
    path: 'files',
    view: FilesView,
  },
  {
    path: 'files/:id:',
    view: FilesView,
    //methods: ['delete'],
  },
  {
    path: 'static/files/:hash:/:filename:',
    view: FilesView,
    params: { type: 'static' },
    //methods: ['get'],
  },
  {
    path: 'users',
    view: UsersView,
  },
  {
    path: 'users/:id:',
    view: UsersView,
  },
  {
    path: 'raids',
    view: RaidView,
  },
  {
    path: 'raids/:id:',
    view: RaidView,
  },
  {
    path: 'characters',
    view: CharacterView,
  },
  {
    path: 'characters/:id:',
    view: CharacterView,
  },
  {
    path: 'characters/mine',
    view: CharacterView,
    params: { mine: true },
  },
  {
    path: 'groups',
    view: GroupView,
  },
  {
    path: 'groups/:id:',
    view: GroupView,
  },
  {
    path: 'signups/:id:',
    view: SignupView,
  },
];
