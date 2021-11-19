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

const sendSettingChange = (socket: Socket, io: Server) => {
  socket.on('setting change', ({ category, max, cycle, title }) => {
    const roomInfo = roomList.get(title);

    if (roomInfo) {
      roomInfo.max = max;
      roomInfo.cycle = cycle;
      roomList.set(title, roomInfo);
      io.to(title).emit('room data', { roomInfo });
      io.to('lobby').emit('room list', Array.from(roomList));
    }
  });
};

/**
 * 클라이언트에게 카테고리 리스트를 받아 랜덤으로 선정 후 해당 카테고리에서 15개 단어 랜덤으로 추출,
 * 해당 roomSecrets에 저장한다. 그 후, 클라이언트에게 선정된 카테고리를 넘긴다.
 */
const sendSelectWords = (socket: Socket, io: Server) => {
  socket.on('word select', async ({ category, roomTitle }: { category: string[]; roomTitle: string }) => {
    const categoryFix = shuffle(category, 1).pop();

    const words = await getRandomWords(categoryFix);

    const answerWord = shuffle(words, 1).pop();

    const roomSecret = roomSecrets.get(roomTitle);
    const roomInfo = roomList.get(roomTitle);

    const liar = shuffle(roomInfo.client, 1).pop();

    roomSecrets.set(roomTitle, { ...roomSecret, words, answerWord, liar });
    roomList.set(roomTitle, {
      ...roomInfo,
      client: roomInfo.client.map((v) => {
        v.state = '';
        return v;
      }),
      state: 'select',
    });

    io.to(roomTitle).emit('word select', { category: categoryFix, roomInfo: roomList.get(roomTitle) });
  });
};

/**
 * 각각의 클라이언트 들에게 요청을 받아 해당 방의 단어를 3초뒤에 보내준다.
 * 만약 그 방에 라이어인 경우에는 라이어를 보내준다.
 */
const sendWords = (socket: Socket, io: Server) => {
  socket.on('get word', ({ roomTitle }: { roomTitle: string }) => {
    const WAITING_TIME = 3 * 1000;

    const roomSecret = roomSecrets.get(roomTitle);

    const word = roomSecret.liar.socketId === socket.id ? '라이어' : roomSecret.answerWord;

    setTimeout(() => {
      socket.emit('get word', { word, roomInfo: roomList.get(roomTitle) });
    }, WAITING_TIME);
  });
};

/**
 * 게임 방에서 할 소켓 기능 모음
 */
const gameRoom = (socket: Socket, io: Server) => {
  sendUserReady(socket, io);
  sendSettingChange(socket, io);
  sendSelectWords(socket, io);
  sendWords(socket, io);
};

export default gameRoom;
