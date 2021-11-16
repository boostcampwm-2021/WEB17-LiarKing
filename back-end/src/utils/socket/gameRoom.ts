import { Server, Socket } from 'socket.io';
import { roomList, roomSecrets } from '../../store/store';
import shuffle from '../shuffle';
import { getRandomWords } from '../../database/service/wordService';

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
 * 클라이언트에게 카테고리 리스트를 받아 랜덤으로 선정 후 해당 카테고리에서 15개 단어 랜덤으로 추출,
 * 해당 roomSecrets에 저장한다. 그 후, 클라이언트에게 선정된 카테고리를 넘긴다.
 */
const sendSelectWords = (socket: Socket, io: Server) => {
  socket.on('word data', async ({ category, roomTitle }: { category: string[]; roomTitle: string }) => {
    const categoryFix = shuffle(category, 1).pop();

    const words = await getRandomWords(categoryFix);

    const answerWord = shuffle(words, 1).pop();

    const roomSecret = roomSecrets.get(roomTitle);

    console.log(answerWord);

    roomSecrets.set(roomTitle, { ...roomSecret, words, answerWord });

    io.to(roomTitle).emit('word data', { category: categoryFix });
  });
};

/**
 * 게임 방에서 할 소켓 기능 모음
 */
const gameRoom = (socket: Socket, io: Server) => {
  sendUserReady(socket, io);
  sendSelectWords(socket, io);
};

export default gameRoom;
