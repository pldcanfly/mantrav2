"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSRoom = void 0;
class WSRoom {
    constructor(wws, namespace) {
        wws.of(namespace.name).on('connection', (socket) => {
            socket.join(socket.nsp.name);
        });
    }
    send() { }
    recieve() { }
    name() {
        return 'not implemented?';
    }
}
exports.WSRoom = WSRoom;
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
