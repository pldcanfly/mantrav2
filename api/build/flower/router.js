'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.flow = exports.name = void 0;
const routes_1 = require("../config/routes");
const appspace_1 = require("../appspace");
const parsedroutes = routes_1.routes.map((route) => {
    let routeparts = route.path.match(/[0-9a-zA-Z-_]+|:([a-z]*):/gm);
    let parsed = [];
    routeparts === null || routeparts === void 0 ? void 0 : routeparts.forEach((routepart) => {
        if (routepart.startsWith(':') && routepart.endsWith(':')) {
            parsed.push({ part: routepart.substring(1, routepart.length - 1), param: true });
        }
        else {
            parsed.push({ part: routepart, param: false });
        }
    });
    return Object.assign(Object.assign({}, route), { parsed });
});
// EXPORTS
exports.name = 'Router v2';
const flow = function (req, res, flowspace, next) {
    var _a;
    // Quickly handle static routes
    for (let i = 0; i < parsedroutes.length; i++) {
        if (parsedroutes[i].path == req.url) {
            flowspace.view = parsedroutes[i].view;
            if (parsedroutes[i].params)
                flowspace.params = parsedroutes[i].params;
            appspace_1.logger.info(`Route v2: Static Route ${parsedroutes[i].view.name}`);
            next();
            return;
        }
    }
    // Now lets look more in deepth
    const url = (_a = req.url) === null || _a === void 0 ? void 0 : _a.split('?'); // Split of ?get=parameters
    if (url) {
        let urlparts = url[0].match(/[0-9a-zA-Z-_. %]+/gm);
        for (let i = 0; i < parsedroutes.length; i++) {
            // For because we wanna break out later if we found a match
            let route = parsedroutes[i];
            let params = {};
            if (route.parsed.length == (urlparts === null || urlparts === void 0 ? void 0 : urlparts.length)) {
                let match = true; // This might be a potential match, now look if it isn't
                urlparts === null || urlparts === void 0 ? void 0 : urlparts.forEach((part, index) => {
                    if (part != route.parsed[index].part) {
                        // The name does not match up
                        if (!route.parsed[index].param) {
                            //  ... and its not even a parameter
                            match = false;
                        }
                        else {
                            params[route.parsed[index].part] = part;
                        }
                    }
                });
                if (match) {
                    // Match survived till here, it is a match!
                    const getparams = {};
                    if (url[1]) {
                        const pairs = url[1].split('&');
                        for (const pair of pairs) {
                            const keyval = pair.split('=');
                            getparams[keyval[0]] = keyval[1] ? keyval[1] : '';
                        }
                    }
                    appspace_1.logger.info(`Route v2: Dynamic Route ${route.view.name}`);
                    flowspace.view = route.view;
                    if (route.params)
                        params = Object.assign(Object.assign({}, params), parsedroutes[i].params);
                    flowspace.params = Object.assign(Object.assign({}, getparams), params);
                    next();
                    return;
                }
            }
        }
    }
    appspace_1.logger.error('Route v2: 404');
    res.statusCode = 404; // We coudln't find a route? 404 it..
    res.end('View not found');
};
exports.flow = flow;
exports.default = { flow: exports.flow, name: exports.name };
