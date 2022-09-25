'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_http_1 = tslib_1.__importDefault(require("node:http"));
const socket_io_1 = tslib_1.__importDefault(require("socket.io"));
const wsnamespaces_1 = require("../config/wsnamespaces");
const appspace_1 = require("../appspace");
class Flow {
    constructor() {
        this.flowers = [];
        appspace_1.logger.info('Flow v2: Init');
        this.server = node_http_1.default.createServer(this.flowHandler());
        // WEBSOCKETS
        this.wsserver = new socket_io_1.default.Server(this.server, {
            cors: { origin: '*' },
        });
        for (const namespace of wsnamespaces_1.namespaces) {
            appspace_1.logger.info(`Websocket: Adding namespace: ${namespace.name}`);
            const handler = new namespace.handler(this.wsserver, namespace);
            appspace_1.appspace.namespaces.set(namespace.name, handler);
        }
        return this;
    }
    listen() {
        if (process.env.NODE_PORT) {
            this.server.listen(process.env.NODE_PORT);
        }
        else {
            this.server.listen();
        }
        appspace_1.logger.info(`Flow v2: Listening on Port ${process.env.NODE_PORT ? process.env.NODE_PORT : 'Default Port'}`);
    }
    use(flower) {
        if (flower.flow) {
            appspace_1.logger.info(`Flow v2: Adding - ${flower.name}`);
            this.flowers.push({ flow: flower.flow, name: flower.name });
        }
        else {
            console.error(`Flow v2: Skipping - ${flower.name} (flow() missing)`);
        }
        return this;
    }
    flowHandler() {
        return (req, res) => {
            const flowspace = { skip: [], contentType: 'json' };
            let flowstate = 0;
            appspace_1.logger.info(`Flow v2: Request Incoming: ${req.method} ${req.url}`);
            const next = () => {
                flowstate++;
                while (this.flowers[flowstate] && flowspace.skip.includes(this.flowers[flowstate].name)) {
                    appspace_1.logger.info(`Flow v2: Skipping: ${this.flowers[flowstate].name}`);
                    flowstate++;
                }
                if (this.flowers[flowstate]) {
                    // END
                    this.flowers[flowstate].flow(req, res, flowspace, next);
                }
            };
            this.flowers[flowstate].flow(req, res, flowspace, next);
        };
    }
}
exports.default = Flow;
