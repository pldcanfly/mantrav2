'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_http_1 = tslib_1.__importDefault(require("node:http"));
const socket_io_1 = tslib_1.__importDefault(require("socket.io"));
const rooms_1 = require("../config/rooms");
const appspace_1 = require("../appspace");
class Flow {
    constructor() {
        this.flowers = [];
        appspace_1.logger.info('Flow v2: Init');
        this.server = node_http_1.default.createServer(this.flowHandler());
        this.wsserver = new socket_io_1.default.Server(this.server, {
            cors: { origin: '*' },
        });
        this.initWSS();
        return this;
    }
    initWSS() {
        for (const room of rooms_1.rooms) {
            appspace_1.logger.info(`Websocket: Adding room: ${room.name}`);
            if (room.events) {
                this.wsserver.of(room.name).on('connection', (socket) => {
                    const namespace = socket.nsp.name;
                    socket.join(namespace);
                    socket.emit('joined', namespace);
                    for (const event of room.events) {
                        if (room.handler[event]) {
                            socket.on(event, (message) => room.handler[event]((event, data) => socket.to(namespace).emit(event, data), message));
                        }
                    }
                });
            }
        }
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
