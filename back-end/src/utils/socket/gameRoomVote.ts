import { Server, Socket } from 'socket.io';

const VOTE_TIME_OUT = 10;

const startVote = (socket: Socket, io: Server) => {
  socket.on('end game', (title: string) => {
    for (let cnt = 0; cnt <= VOTE_TIME_OUT + 1; cnt++) {
      let leftSecond = VOTE_TIME_OUT - cnt;
      setTimeout(() => {
        io.to(title).emit('start vote', leftSecond);
      }, 1000 * cnt);
    }
  });
};

/**
 * 게임방 채팅에서 할 소켓 기능 모음
 */
const gameRoomVote = (socket: Socket, io: Server) => {
  startVote(socket, io);
};

export default gameRoomVote;
