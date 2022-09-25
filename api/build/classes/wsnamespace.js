"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSNamespace = void 0;
class WSNamespace {
    constructor(wws, namespace) {
        this.namespace = wws.of(namespace.name);
        this.namespace.on('connection', (socket) => {
            socket.on('setAudience', (audience) => {
                socket.join(audience);
            });
            socket.onAny(this.recieve);
        });
    }
    send(event, message, audience) {
        if (!this.namespace)
            return false;
        if (audience) {
            return this.namespace.to(audience).emit(event, message);
        }
        else {
            return this.namespace.emit(event, message);
        }
    }
    recieve(event, message) {
        console.log(event, message);
    }
}
exports.WSNamespace = WSNamespace;
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
