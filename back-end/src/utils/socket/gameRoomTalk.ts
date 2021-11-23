import { Server, Socket } from 'socket.io';

const sendJoin = (socket: Socket, io: Server) => {
  socket.on('i joined', ({ id }) => {
    socket.broadcast.to('123123123').emit('someone joined', { id });
  });
};

const gameRoomTalk = (socket: Socket, io: Server) => {
  sendJoin(socket, io);
};

export default gameRoomTalk;
