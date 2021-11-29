import { Server, Socket } from 'socket.io';
import { socketDatas, socketToPeer } from '../../store/store';

const I_JOINED = 'i joined';
const SOMEONE_JOINED = 'someone joined';

const sendJoin = (socket: Socket, io: Server) => {
  socket.on(I_JOINED, ({ peerId }) => {
    const socketInfo = socketDatas.get(socket.id);
    if (!socketInfo) return;
    const roomTitle = socketInfo.roomTitle;
    socketToPeer[socket.id] = peerId;
    socket.broadcast.to(roomTitle).emit(SOMEONE_JOINED, { peerId });
  });
};

const gameRoomTalk = (socket: Socket, io: Server) => {
  sendJoin(socket, io);
};

export default gameRoomTalk;
