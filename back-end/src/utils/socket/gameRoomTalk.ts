import { Server, Socket } from 'socket.io';
import { socketDatas, socketToPeer } from '../../store/store';

const sendJoin = (socket: Socket, io: Server) => {
  socket.on('i joined', ({ peerId }) => {
    const socketInfo = socketDatas.get(socket.id);
    const roomTitle = socketInfo.roomTitle;
    socketToPeer[socket.id] = peerId;
    socket.broadcast.to(roomTitle).emit('someone joined', { peerId, socketId: socket.id });
  });
};

const gameRoomTalk = (socket: Socket, io: Server) => {
  sendJoin(socket, io);
};

export default gameRoomTalk;
