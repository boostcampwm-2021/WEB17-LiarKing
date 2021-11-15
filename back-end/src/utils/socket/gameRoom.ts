import { Server, Socket } from 'socket.io';
import { roomList } from '../../store/store';

/**
 * 유저가 레디버튼을 클릭 하였을 때 상태를 서버에서 전파
 */
const sendUserReady = (socket: Socket, io: Server) => {
  socket.on('user ready', (title: string) => {
    const roomInfo = roomList.get(title);

    roomInfo.client = roomInfo.client.map((v: { socketId: string; state: string; name: string }) => {
      if (v.socketId === socket.id) {
        if (v.state === 'ready') {
          v.state = '';
        } else {
          v.state = 'ready';
        }
      }
      return v;
    });

    roomList.set(title, roomInfo);

    io.to(title).emit('room data', { roomInfo: roomInfo, tag: 'user ready' });
  });
};

/**
 * 게임 방에서 할 소켓 기능 모음
 */
const gameRoom = (socket: Socket, io: Server) => {
  sendUserReady(socket, io);
};

export default gameRoom;
