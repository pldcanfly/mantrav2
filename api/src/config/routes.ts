'use strict';

import { View } from '../..';

import { FilesView } from '../views/system/files.js';

export type RouteParams = {
  [propName: string]: any;
};

export type RouteNode = {
  path: string;
  view: View;
  params?: RouteParams;
};

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
];
