import { Server, Socket } from 'socket.io';

const sendChatMessage = (socket: Socket, io: Server) => {
  socket.on('send message', (messageInfo: { message: string; title: string }) => {
    io.to(messageInfo.title).emit('send message', messageInfo.message);
  });
};

/**
 * 게임방 채팅에서 할 소켓 기능 모음
 */
const gameRoomChat = (socket: Socket, io: Server) => {
  sendChatMessage(socket, io);
};

export default gameRoomChat;
