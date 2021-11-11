import { Server } from 'socket.io';
import lobbyRoom from './socket/lobbyRoom';
import gameRoomChat from './socket/gameRoomChat';

const socketUtil = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('connect id:', socket.id);

    lobbyRoom(socket, io);
    gameRoomChat(socket, io);
  });
};

export default socketUtil;
