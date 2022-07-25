'use strict';

import http from 'http';
import socketio from 'socket.io';
import { Flower, Flowspace } from '../..';
import { rooms } from '../config/rooms';

import { logger } from '../appspace';

class Flow {
  private server: http.Server;
  private wsserver: socketio.Server;

  private flowers: Array<{ name: string; flow: Function }> = [];

  constructor() {
    logger.info('Flow v2: Init');
    this.server = http.createServer(this.flowHandler());
    this.wsserver = new socketio.Server(this.server, {
      cors: { origin: '*' },
    });
    this.initWSS();
    return this;
  }

  initWSS() {
    for (const room of rooms) {
      logger.info(`Websocket: Adding room: ${room.name}`);
      if (room.events) {
        this.wsserver.of(room.name).on('connection', (socket) => {
          socket.join(room.name);
          socket.emit('joined', room.name);
          for (const event of room.events) {
            if (room.handler[event]) {
              socket.on(event, (message) => room.handler[event]((event: string, data: any) => socket.to(room.name).emit(event, data), message));
            }
          }
        });
      }
    }
  }

  listen() {
    const port = process.env.NODE_PORT;
    this.server.listen(port);
    logger.info(`Flow v2: Listening on Port ${port}`);
  }

  use(flower: Flower) {
    if (flower.flow) {
      logger.info(`Flow v2: Adding - ${flower.name}`);
      this.flowers.push({ flow: flower.flow, name: flower.name });
    } else {
      console.error(`Flow v2: Skipping - ${flower.name} (flow() missing)`);
    }

    return this;
  }

  flowHandler(this: Flow) {
    return (req: http.IncomingMessage, res: http.ServerResponse) => {
      const flowspace: Flowspace = { skip: [], contentType: 'json' };
      let flowstate: number = 0;
      logger.info(`Flow v2: Request Incoming: ${req.method} ${req.url}`);

      const next = () => {
        flowstate++;
        while (this.flowers[flowstate] && flowspace.skip.includes(this.flowers[flowstate].name)) {
          logger.info(`Flow v2: Skipping: ${this.flowers[flowstate].name}`);
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

export default Flow;
