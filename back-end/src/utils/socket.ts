import { Server } from 'socket.io';
import lobbyRoom from './socket/lobbyRoom';

const socketUtil = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('connect id:', socket.id);

    lobbyRoom(socket);
  });
};

export default socketUtil;
