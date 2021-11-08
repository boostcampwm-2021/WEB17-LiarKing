import { Server } from 'socket.io';
import { roomList } from '../store/store';

const socketUtil = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('connect id:', socket.id);

    socket.join('lobby');

    socket.on('room list', function () {
      socket.emit('room list', Array.from(roomList));
    });

    socket.on('room create', function (data) {
      socket.leave('lobby');

      const roomTitle = data.title;

      if (!roomList.get(roomTitle)) {
        roomList.set(roomTitle, Object.assign(data, { client: [] }));

        io.to('lobby').emit('room list', Array.from(roomList));

        socket.join(roomTitle);
      } else {
        data = false;
      }

      socket.emit('room create', data);
    });
  });
};

export default socketUtil;
