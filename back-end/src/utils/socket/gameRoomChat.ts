import { Server, Socket } from 'socket.io';

const sendChatMessage = (socket: Socket, io: Server) => {
  socket.on('wait room message', (messageInfo: { userId: string; message: string; title: string; clientIdx: number }) => {
    io.to(messageInfo.title).emit('wait room message', {
      userId: messageInfo.userId,
      message: messageInfo.message,
      clientIdx: messageInfo.clientIdx,
    });
  });
};

/**
 * 게임방 채팅에서 할 소켓 기능 모음
 */
const gameRoomChat = (socket: Socket, io: Server) => {
  sendChatMessage(socket, io);
};

export default gameRoomChat;
