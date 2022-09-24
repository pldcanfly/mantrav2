import { Namespace, Server } from 'socket.io';

export interface NamespaceConfig {
  name: RegExp | string;
  handler: typeof WSNamespace;
  events: Array<string>;
}

export class WSNamespace {
  namespace: Namespace;

  constructor(wws: Server, namespace: NamespaceConfig) {
    this.namespace = wws.of(namespace.name);
    this.namespace.on('connection', (socket) => {
      socket.on('setAudience', (audience) => {
        socket.join(audience);
      });

      socket.onAny(this.recieve);
    });
  }

  send(event: string, message: any, audience?: string | string[]) {
    if (!this.namespace) return false;

    if (audience) {
      return this.namespace.to(audience).emit(event, message);
    } else {
      return this.namespace.emit(event, message);
    }
  }

  recieve(event: string, message: any) {
    console.log(event, message);
  }
}

// if (room.events) {
//   this.wsserver.of(room.name).on('connection', (socket) => {
//     const namespace = socket.nsp.name;
//     socket.join(namespace);
//     socket.emit('joined', namespace);
//     for (const event of room.events) {
//       if (room.handler[event]) {
//         socket.on(event, (message) => room.handler[event]((event: string, data: any) => socket.to(namespace).emit(event, data), message));
//       }
//     }
//   });
// }
