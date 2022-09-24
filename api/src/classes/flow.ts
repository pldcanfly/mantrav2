'use strict';

import http from 'node:http';
import socketio from 'socket.io';
import { Flower, Flowspace } from '../..';
import { namespaces } from '../config/wsnamespaces';

import { logger, appspace } from '../appspace';

class Flow {
  private server: http.Server;
  private wsserver: socketio.Server;

  private flowers: Array<{ name: string; flow: Function }> = [];

  constructor() {
    logger.info('Flow v2: Init');

    this.server = http.createServer(this.flowHandler());

    // WEBSOCKETS
    this.wsserver = new socketio.Server(this.server, {
      cors: { origin: '*' },
    });

    for (const namespace of namespaces) {
      logger.info(`Websocket: Adding namespace: ${namespace.name}`);
      const handler = new namespace.handler(this.wsserver, namespace);
      appspace.namespaces.set(namespace.name, handler);
    }

    return this;
  }

  listen() {
    if (process.env.NODE_PORT) {
      this.server.listen(process.env.NODE_PORT);
    } else {
      this.server.listen();
    }
    logger.info(`Flow v2: Listening on Port ${process.env.NODE_PORT ? process.env.NODE_PORT : 'Default Port'}`);
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
