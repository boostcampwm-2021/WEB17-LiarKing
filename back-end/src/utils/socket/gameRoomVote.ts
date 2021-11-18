import { Server, Socket } from 'socket.io';
import { roomList, roomSecrets } from '../../store/store';

const voteResult = {};
let voteCount = {};

const endVote = (socket: Socket, io: Server) => {
  socket.on('vote result', (voteUser: any) => {
    const { index, name, roomtitle } = voteUser;
    const roomInfo = roomList.get(roomtitle);
    const roomPeopleNum = roomInfo.client.length;

    if (!voteResult[roomtitle]) {
      voteResult[roomtitle] = {};
      voteCount[roomtitle] = 0;
    }
    voteCount[roomtitle] += 1;
    if (!voteResult[roomtitle][name]) {
      voteResult[roomtitle][name] = 1;
    } else {
      voteResult[roomtitle][name] += 1;
    }

    let maxCnt = 0;
    let maxVal = -1;
    let maxName = '';
    for (let name in voteResult[roomtitle]) {
      const val = voteResult[roomtitle][name];
      if (name === '기권') continue;
      if (val > maxVal) {
        maxName = name;
        maxVal = val;
        maxCnt = 1;
      } else if (val === maxVal) {
        maxCnt += 1;
      }
    }

    let gameResult;
    if (maxCnt === 1 && roomSecrets.get(roomtitle).liar.name === maxName) gameResult = true;
    else gameResult = false;
    if (roomPeopleNum === voteCount[roomtitle]) {
      let resultArray = [];
      for (const [key, value] of Object.entries(voteResult[roomtitle])) {
        resultArray.push(key + ' ' + value + '표');
      }
      io.to(roomtitle).emit('end vote', {
        gameResult: gameResult,
        liarName: roomSecrets.get(roomtitle).liar.name,
        voteResult: resultArray,
        roomInfo,
      });
    }
  });
};

/**
 * 게임방 채팅에서 할 소켓 기능 모음
 */
const gameRoomVote = (socket: Socket, io: Server) => {
  endVote(socket, io);
};

export default gameRoomVote;
