'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const files_1 = require("../views/system/files");
const test_1 = require("../views/test");
exports.routes = [
    {
        path: 'test',
        view: test_1.TestView,
    },
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
];
