'use strict';

import { View } from '../..';
import { CampaignView } from '../views/campaign.js';
import { ClicktrackView } from '../views/clicktrack.js';
import { ExportView } from '../views/export.js';

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
  {
    path: 'click/:campaign:/:pos:/',
    view: ClicktrackView,
    params: { type: 'click' },
  },
  {
    path: 'impression/:campaign:',
    view: ClicktrackView,
    params: { type: 'impression' },
  },
  {
    path: 'reports/campaigns',
    view: CampaignView,
  },
  {
    path: 'export/:type:/:key:',
    view: ExportView,
  },
];
