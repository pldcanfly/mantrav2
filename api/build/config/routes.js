'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const character_1 = require("../views/character");
const groups_1 = require("../views/groups");
const raid_1 = require("../views/raid");
const signup_1 = require("../views/signup");
const files_1 = require("../views/system/files");
const users_1 = require("../views/system/users");
exports.routes = [
    {
        path: 'files',
        view: files_1.FilesView,
    },
    {
        path: 'files/:id:',
        view: files_1.FilesView,
        //methods: ['delete'],
    },
    {
        path: 'static/files/:hash:/:filename:',
        view: files_1.FilesView,
        params: { type: 'static' },
        //methods: ['get'],
    },
    {
        path: 'users',
        view: users_1.UsersView,
    },
    {
        path: 'users/:id:',
        view: users_1.UsersView,
    },
    {
        path: 'raids',
        view: raid_1.RaidView,
    },
    {
        path: 'raids/:id:',
        view: raid_1.RaidView,
    },
    {
        path: 'characters',
        view: character_1.CharacterView,
    },
    {
        path: 'characters/:id:',
        view: character_1.CharacterView,
    },
    {
        path: 'characters/mine',
        view: character_1.CharacterView,
        params: { mine: true },
    },
    {
        path: 'groups',
        view: groups_1.GroupView,
    },
    {
        path: 'groups/:id:',
        view: groups_1.GroupView,
    },
    {
        path: 'signups/:id:',
        view: signup_1.SignupView,
    },
];
