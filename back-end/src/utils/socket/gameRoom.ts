import { Server, Socket } from 'socket.io';
import { roomInfoType, roomList, roomSecrets, roomSecretType, socketDatas } from '../../store/store';
import shuffle from '../shuffle';
import { getRandomWords } from '../../database/service/wordService';
import timer from '../timer';

const LOBBY = 'lobby';

const ROOM_TITLE_INFO = 'room title info';
const ROOM_READY = 'room ready';
const SETTING_CHANGE = 'setting change';
const IS_USER_OWNER = 'is user owner';
const GAME_START = 'game start';
const CHAT_MESSAGE_DATA = 'chat message data';
const IS_USER_READY = 'is user ready';
const ROOM_LIST = 'room list';
const IS_WAITING_STATE = 'is waiting state';
const IS_ALL_READY = 'is all ready';
const ROOM_CLIENTS_INFO = 'room clients info';
const WAIT_ROOM_MESSAGE = 'wait room message';
const ROOM_STATE_INFO = 'room state info';
const SELECT_DATA = 'select data';
const REQUEST_SELECT_DATA = 'request select data';
const CHAT_HISTORY_DATA = 'chat history data';
const CHAT_SPEAKER_DATA = 'chat speaker data';
const VOTE_TIMER_DATA = 'vote timer data';
const END_VOTE = 'end vote';
const RESULT_DATA = 'result data';
const LIAR_DATA = 'liar data'; //아직 미사용
const CURRENT_SPEAKER = 'current speaker';
const END_SPEAK = 'end speak';

/**
 * 클라이언트에게 요청이오면 해당 방에 있는 모든 클라이언트에게
 * 방의 제목정보(인원수, 인원제한수, 방제목)를 뿌린다.
 */
const sendRoomTitleInfo = (socket: Socket, io: Server) => {
  socket.on(ROOM_TITLE_INFO, () => {
    const socketInfo = socketDatas.get(socket.id);

    if (!socketInfo || socketInfo.roomTitle === null) return;

    const { roomTitle } = socketInfo;

    if (!roomList.get(roomTitle)) return;

    const { client, max } = roomList.get(roomTitle);

    io.to(roomTitle).emit(ROOM_TITLE_INFO, { usersAmount: client.length, maxUsers: max, roomTitle });
  });
};

/**
 * 요청한 유저가 방장인지 여부 데이터를 전송.
 */
const sendIsUserOwner = (socket: Socket) => {
  socket.on(IS_USER_OWNER, () => {
    const socketInfo = socketDatas.get(socket.id);

    if (!socketInfo || socketInfo.roomTitle === null) return;

    const { name, roomTitle } = socketInfo;

    if (!roomList.get(roomTitle)) return;

    const { owner } = roomList.get(roomTitle);

    socket.emit(IS_USER_OWNER, { isUserOwner: owner === name });
  });
};

/**
 * 요청한 유저 방의 클라이언트들 정보를 불러옴.
 */
const sendClientInfo = (socket: Socket, io: Server) => {
  socket.on(ROOM_CLIENTS_INFO, () => {
    const socketInfo = socketDatas.get(socket.id);

    if (!socketInfo || socketInfo.roomTitle === null) return;

    const { roomTitle } = socketInfo;

    io.to(roomTitle).emit(ROOM_CLIENTS_INFO, { clients: roomList.get(roomTitle).client });
  });
};

/**
 * 유저가 레디버튼을 클릭 하였을 때 상태를 서버에서 전파
 */
const sendUserReady = (socket: Socket, io: Server) => {
  socket.on(ROOM_READY, () => {
    const socketInfo = socketDatas.get(socket.id);

    if (!socketInfo || socketInfo.roomTitle === null) return;

    const { name, roomTitle } = socketInfo;

    if (!roomList.get(roomTitle)) return;

    const roomInfo = roomList.get(roomTitle);

    const clientInfo = roomInfo.client.find((v) => v.name === name);

    if (clientInfo.state === 'ready') clientInfo.state = '';
    else clientInfo.state = 'ready';

    roomList.set(roomTitle, roomInfo);

    socket.emit(IS_USER_READY, { isUserReady: clientInfo.state === 'ready' });
    io.to(roomTitle).emit(IS_ALL_READY, {
      isAllReady: !roomInfo.client.find((v) => v.state === '' && v.name !== roomInfo.owner),
    });

    io.to(roomTitle).emit(ROOM_CLIENTS_INFO, { clients: roomInfo.client });
  });
};

/*
 * 방장이 최대 플레이어수 변경 요청
 */
const sendSettingChange = (socket: Socket, io: Server) => {
  socket.on(SETTING_CHANGE, ({ roomSetting }: { roomSetting: { max: number; cycle: number } }) => {
    const socketInfo = socketDatas.get(socket.id);

    if (!socketInfo || socketInfo.roomTitle === null) return;

    const { roomTitle } = socketInfo;

    if (!roomList.get(roomTitle)) return;

    const roomInfo = roomList.get(roomTitle);
    const { max, cycle } = roomSetting;

    if (!roomInfo) return;

    roomInfo.max = max;
    roomInfo.cycle = cycle;

    roomList.set(roomTitle, roomInfo);

    io.to(roomTitle).emit(ROOM_TITLE_INFO, { maxUsers: max });
    io.to(LOBBY).emit(ROOM_LIST, { roomList: Array.from(roomList) });
  });
};

/**
 * 대기상태일 때의 주고받는 메세지를 전파한다.
 */
const waitRoomMessage = (socket: Socket, io: Server) => {
  socket.on(WAIT_ROOM_MESSAGE, (messageInfo: { userId: string; message: string; title: string; clientIdx: number }) => {
    io.to(messageInfo.title).emit(WAIT_ROOM_MESSAGE, messageInfo);
  });
};

const roomResultMap: Map<string, { isWin: boolean; liarAnswer: boolean }> = new Map();

/**
 * 방장이 게임을 시작한다.
 */
const gameStart = (socket: Socket, io: Server) => {
  const STATE_WAITING_TIME = 100;
  const SECONDS = 1000;

  const state = {
    select: async (roomInfo: roomInfoType, roomSecret: roomSecretType, categorys: string[]) => {
      if (roomList.get(roomInfo.title)?.state !== 'start') return false;

      const ROOM_STATE = 'select';
      const WAITING_TIME = 5 * 1000;

      const { title } = roomInfo;

      io.to(title).emit(ROOM_STATE_INFO, { roomState: ROOM_STATE });

      await timer(STATE_WAITING_TIME);

      const categoryFix = shuffle(categorys, 1).pop();
      const words = await getRandomWords(categoryFix);
      const answerWord = shuffle(words, 1).pop();
      const liar = shuffle(roomInfo.client, 1).pop();

      Object.assign(roomSecret, { ...roomSecret, words, answerWord, liar });

      io.to(title).emit(SELECT_DATA, { select: { word: categoryFix } });

      await timer(WAITING_TIME);

      io.to(title).emit(REQUEST_SELECT_DATA, null);

      await timer(WAITING_TIME);

      return true;
    },
    chat: async (roomInfo: roomInfoType) => {
      if (roomList.get(roomInfo.title)?.state !== 'start') return false;

      const ROOM_STATE = 'chat';
      const SPEAK_TIME = 15;
      const SUB_TIME = 1;

      const { title } = roomInfo;

      io.to(title).emit(ROOM_STATE_INFO, { roomState: ROOM_STATE });

      await timer(STATE_WAITING_TIME);

      const randomClients = shuffle(roomInfo.client, roomInfo.client.length);

      for (let j = 0; j < roomInfo.cycle; j++) {
        for (let i = 0; i < randomClients.length; i++) {
          if (roomList.get(roomInfo.title)?.state !== 'start') return false;
          io.to(title).emit(CHAT_SPEAKER_DATA, { speakerData: { speaker: randomClients[i].name, timer: SPEAK_TIME } });
          io.to(title).emit(CURRENT_SPEAKER, { speaker: randomClients[i].name });
          await timer((SPEAK_TIME + SUB_TIME) * SECONDS);
        }
      }

      return true;
    },
    vote: async (roomInfo: roomInfoType) => {
      if (roomList.get(roomInfo.title)?.state !== 'start') return false;

      const ROOM_STATE = 'vote';
      const VOTE_TIME_OUT = 10;
      const SUB_TIME = 1;

      const { title, client } = roomInfo;

      client.map((client: any) => (client.state = 'vote'));

      io.to(title).emit(ROOM_STATE_INFO, { roomState: ROOM_STATE });

      await timer(STATE_WAITING_TIME);

      io.to(title).emit(END_SPEAK);
      io.to(title).emit(VOTE_TIMER_DATA, { timer: VOTE_TIME_OUT });
      io.to(title).emit(ROOM_CLIENTS_INFO, { clients: client });

      await timer((VOTE_TIME_OUT + SUB_TIME) * SECONDS);

      io.to(title).emit(END_VOTE, null);

      await timer(SUB_TIME * SECONDS);

      return true;
    },
    voteResult: async (roomInfo: roomInfoType) => {
      const ROOM_STATE = 'result';
      const WAIT_VOTE_RESULT = 5;

      const { title, client } = roomInfo;
      const { liar, vote } = roomSecrets.get(title);

      if (roomList.get(roomInfo.title)?.state !== 'start') return false;

      io.to(title).emit(ROOM_STATE_INFO, { roomState: ROOM_STATE });

      await timer(STATE_WAITING_TIME);

      const MENT = {
        LIAR: `라이어는 ${liar.name} 였습니다.`,
        SUCCESS: '라이어 검거에 성공하였습니다.',
        FAIL: '라이어 검거에 실패하였습니다.',
      };

      const isWin = vote[0].name === liar.name && (!!vote[1] ? (vote[1].name === '기권' ? true : vote[0].count !== vote[1].count) : true);

      roomResultMap.set(title, { isWin, liarAnswer: null });

      io.to(title).emit(RESULT_DATA, {
        resultData: {
          results: vote.map((v) => `${v.name} ${v.count}표`),
          totalResult: `${MENT.LIAR} ${isWin ? MENT.SUCCESS : MENT.FAIL}`,
        },
      });

      client.forEach((v) => (v.state = ''));

      io.to(title).emit(ROOM_CLIENTS_INFO, { clients: client });

      await timer(WAIT_VOTE_RESULT * SECONDS);

      return true;
    },
    liar: async (roomInfo: roomInfoType, roomSecret: roomSecretType) => {
      if (roomList.get(roomInfo.title)?.state !== 'start') return false;

      const ROOM_STATE = 'liar';
      const WAIT_TIME = 10;

      const { title } = roomInfo;

      io.to(title).emit(ROOM_STATE_INFO, { roomState: ROOM_STATE });

      await timer(STATE_WAITING_TIME);

      const { answerWord, words, liar } = roomSecret;

      const suffleWords = shuffle(words, words.length);

      const answerNumber = suffleWords.indexOf(answerWord);

      io.to(title).emit(LIAR_DATA, { liarData: { category: suffleWords, answer: answerNumber, liar: liar.name } });

      await new Promise((resolve) => {
        let count = WAIT_TIME - 1;

        const waiting = setInterval(() => {
          count--;

          if (count <= 0 || roomResultMap.get(title).liarAnswer !== null) {
            resolve(null);
            clearInterval(waiting);
          }
        }, SECONDS);
      });

      return true;
    },
    result: async (roomInfo: roomInfoType, roomSecret: roomSecretType) => {
      if (roomList.get(roomInfo.title)?.state !== 'start') return false;

      const ROOM_STATE = 'result';
      const RESULT_TIMER = 5;
      const SECONDS = 1000;
      const { title } = roomInfo;
      const { isWin, liarAnswer } = roomResultMap.get(title);

      let results = [`정답: ${roomSecret.answerWord}`];
      let totalResult = '라이어가 제시어를 맞춰서 승리하였습니다!';
      let liarWins = true;
      if (isWin) {
        if (liarAnswer) {
          results.unshift('라이어가 정답을 맞췄습니다!');
        } else {
          results.unshift('라이어가 정답을 맞추지 못했습니다!');
          totalResult = '라이어가 제시어를 맞추지 못해서 패배하였습니다!';
          liarWins = false;
        }
      } else {
        results.unshift('라이어 검거에 실패하였으므로 라이어의 승리입니다!');
        totalResult = `${roomSecret.liar.name}님의 승리입니다!`;
      }

      const tempData = { results: results, totalResult: totalResult, liar: roomSecret.liar.name, liarWins: liarWins };
      io.to(title).emit(ROOM_STATE_INFO, { roomState: ROOM_STATE });
      io.to(title).emit(RESULT_DATA, { resultData: tempData });
      await timer(RESULT_TIMER * SECONDS);

      return true;
    },
  };

  socket.on(GAME_START, async ({ categorys }: { categorys: string[] }) => {
    const socketInfo = socketDatas.get(socket.id);

    if (!socketInfo || socketInfo.roomTitle === null) return;

    const { roomTitle } = socketInfo;

    roomResultMap.set(roomTitle, { isWin: null, liarAnswer: null });

    const roomInfo = roomList.get(roomTitle);
    const roomSecret = roomSecrets.get(roomTitle);

    roomInfo.client.forEach((v) => (v.state = ''));
    roomInfo.state = 'start';
    roomList.set(roomTitle, roomInfo);

    io.to(roomTitle).emit(IS_WAITING_STATE, { isWaitingState: false });
    io.to(roomTitle).emit(ROOM_CLIENTS_INFO, { clients: roomInfo.client });
    io.to(LOBBY).emit(ROOM_LIST, { roomList: Array.from(roomList) });

    let isGamePlaying: boolean = true;
    if (isGamePlaying) isGamePlaying = await state.select(roomInfo, roomSecret, categorys);
    if (isGamePlaying) isGamePlaying = await state.chat(roomInfo);
    if (isGamePlaying) isGamePlaying = await state.vote(roomInfo);
    if (isGamePlaying) isGamePlaying = await state.voteResult(roomInfo);
    if (roomResultMap.get(roomTitle).isWin && isGamePlaying) isGamePlaying = await state.liar(roomInfo, roomSecret);
    if (isGamePlaying) isGamePlaying = await state.result(roomInfo, roomSecret);

    roomInfo.client.forEach((v) => (v.state = ''));
    roomInfo.state = 'waiting';
    roomInfo.chatHistory.length = 0;

    roomList.set(roomTitle, roomInfo);
    roomSecrets.set(roomTitle, { liar: null, answerWord: '', vote: [], words: [] });
    roomResultMap.delete(roomTitle);

    io.to(roomTitle).emit(IS_WAITING_STATE, { isWaitingState: true });
    io.to(roomTitle).emit(ROOM_STATE_INFO, { roomState: 'waiting' });
    io.to(LOBBY).emit(ROOM_LIST, { roomList: Array.from(roomList) });
  });

  /**
   * 게임방에서 라이어가 마지막에 단어를 골랐을 때 결과를 저장.
   */
  socket.on(LIAR_DATA, ({ liarResult }: { liarResult: { isAnswer: boolean } }) => {
    const { roomTitle } = socketDatas.get(socket.id);
    roomResultMap.set(roomTitle, { isWin: true, liarAnswer: liarResult.isAnswer });
  });
};

/**
 * 각각의 클라이언트 들에게 요청을 받아 해당 방의 단어를 3초뒤에 보내준다.
 * 만약 그 방에 라이어인 경우에는 라이어를 보내준다.
 */
const sendWords = (socket: Socket, io: Server) => {
  socket.on(REQUEST_SELECT_DATA, () => {
    const { roomTitle } = socketDatas.get(socket.id);

    const roomSecret = roomSecrets.get(roomTitle);

    const word = roomSecret.liar.socketId === socket.id ? '라이어' : roomSecret.answerWord;

    socket.emit(SELECT_DATA, { select: { word } });
  });
};

/**
 * 게임방의 발언시간 때 채팅 내역을 기록하고 전파한다.
 */
const sendChat = (socket: Socket, io: Server) => {
  const COLORS = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'navy', 'purple'];

  socket.on(CHAT_MESSAGE_DATA, ({ message }: { message: string }) => {
    const { name, roomTitle } = socketDatas.get(socket.id);
    const roomInfo = roomList.get(roomTitle);
    const client = roomInfo.client.find((v) => v.name === name);
    const { chatHistory } = roomInfo;

    chatHistory.unshift({
      userName: name,
      ment: message,
      color: COLORS[roomInfo.client.indexOf(client)],
    });

    io.to(roomTitle).emit(CHAT_HISTORY_DATA, { chatHistory });

    roomList.set(roomTitle, roomInfo);
  });
};

/**
 * 게임 방에서 할 소켓 기능 모음
 */
const gameRoom = (socket: Socket, io: Server) => {
  sendRoomTitleInfo(socket, io);
  sendIsUserOwner(socket);
  sendClientInfo(socket, io);
  sendUserReady(socket, io);

  waitRoomMessage(socket, io);
  gameStart(socket, io);
  sendSettingChange(socket, io);
  sendWords(socket, io);
  sendChat(socket, io);
};

export default gameRoom;
