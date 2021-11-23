import { Server, Socket } from 'socket.io';
import { socketDatas } from '../../store/store';

const sendJoin = (socket: Socket, io: Server) => {
  socket.on('i joined', ({ peerId }) => {
    const socketInfo = socketDatas.get(socket.id);
    const roomTitle = socketInfo.roomTitle;
    socket.broadcast.to(roomTitle).emit('someone joined', { peerId });
  });
};

const gameRoomTalk = (socket: Socket, io: Server) => {
  sendJoin(socket, io);
};

export default gameRoomTalk;
