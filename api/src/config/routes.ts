'use strict';

import { View } from '../..';

import { FilesView } from '../views/system/files';
import { TestView } from '../views/test';

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
    path: 'test',
    view: TestView,
  },
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
