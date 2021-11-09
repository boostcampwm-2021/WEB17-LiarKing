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

    socket.on('room join', function (title: string) {
      //방에 들어갈 수 있으면 true 아니면 false를 주는 코드작성해야함.

      socket.emit('room join', true);
    });

    socket.on('room data', function (title: string) {
      const roomInfo = roomList.get(title);
      socket.leave('lobby');
      roomList.set(title, { ...roomInfo, client: [...roomInfo.client, socket.id] });
      socket.join(title);

      socket.emit('room data', roomList.get(title));
    });
  });
};

export default socketUtil;
