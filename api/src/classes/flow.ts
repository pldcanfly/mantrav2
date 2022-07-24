'use strict';

import http from 'http';
import { Flower, Flowspace } from '../..';

import { logger } from '../appspace';

class Flow {
  private server: http.Server;
  private flowers: Array<{ name: string; flow: Function }> = [];

  constructor() {
    logger.info('Flow v2: Init');
    this.server = http.createServer(this.flowHandler());
    return this;
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
