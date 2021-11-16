import { Server, Socket } from 'socket.io';
import { roomList } from '../../store/store';

const VOTE_TIME_OUT = 10;
const voteResult = {};
let voteCount = {};

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

const endVote = (socket: Socket, io: Server) => {
  socket.on('vote result', (voteUser: any) => {
    const { index, name, roomtitle } = voteUser;
    const roomPeopleNum = roomList.get(roomtitle).client.length;
    if (!voteResult[roomtitle]) {
      voteResult[roomtitle] = {};
      voteCount[roomtitle] = 0;
    }
    voteCount[roomtitle] += 1;
    if (!voteResult[name]) {
      voteResult[roomtitle][name] = 1;
    } else {
      voteResult[roomtitle][name] += 1;
    }

    if (roomPeopleNum === voteCount[roomtitle]) {
      io.to(roomtitle).emit('end vote', voteResult[roomtitle]);
    }
  });
};

/**
 * 게임방 채팅에서 할 소켓 기능 모음
 */
const gameRoomVote = (socket: Socket, io: Server) => {
  startVote(socket, io);
  endVote(socket, io);
};

export default gameRoomVote;
