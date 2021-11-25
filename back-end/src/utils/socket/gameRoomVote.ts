import { Server, Socket } from 'socket.io';
import { roomSecrets, socketDatas } from '../../store/store';

const VOTE_RESULT = 'vote result';

const endVote = (socket: Socket) => {
  socket.on(VOTE_RESULT, ({ voteData }: { voteData: { name: string } }) => {
    const { name } = voteData;
    const socketInfo = socketDatas.get(socket.id);
    const roomSecret = roomSecrets.get(socketInfo?.roomTitle);

    if (!roomSecret) return;

    const { vote } = roomSecret;
    const candidate = vote.find((v) => v.name === name);

    if (!!candidate) candidate.count++;
    else vote.push({ name, count: 1 });

    vote.sort((o1, o2) => {
      if (o1.name === '기권') return 1;
      if (o2.name === '기권') return -1;
      return o2.count - o1.count;
    });
  });
};

/**
 * 게임방 채팅에서 할 소켓 기능 모음
 */
const gameRoomVote = (socket: Socket, io: Server) => {
  endVote(socket);
};

export default gameRoomVote;
