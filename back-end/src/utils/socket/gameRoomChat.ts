import { Server, Socket } from 'socket.io';
import { roomList } from '../../store/store';

const sendChatMessage = (socket: Socket, io: Server) => {
  socket.on('send message', ({ message, title }: { message: string; title: string }) => {
    const roomInfo = roomList.get(title);
    const { chatHistory } = roomInfo;

    chatHistory.unshift(message);

    roomList.set(title, { ...roomInfo, chatHistory });

    io.to(title).emit('send message', message);
  });

  socket.on('wait room message', (messageInfo: { userId: string; message: string; title: string; clientIdx: number }) => {
    io.to(messageInfo.title).emit('wait room message', {
      userId: messageInfo.userId,
      message: messageInfo.message,
      clientIdx: messageInfo.clientIdx,
    });
  });
};

/**
 * 클라이언트에서 채팅을 할 때 서버에 채팅 데이터를 저장한다.
 * 그 후 채팅 데이터와 현재 발언자, 남은 시간을 전달한다.
 */
const sendChatData = (socket: Socket, io: Server) => {
  socket.on('chat data', async ({ message, roomTitle }: { message?: string; roomTitle: string }) => {
    const roomInfo = roomList.get(roomTitle);
    const { speakerData, client, chatHistory } = roomInfo;

    if (!!message) {
      chatHistory.unshift(message);

      roomList.set(roomTitle, { ...roomInfo, chatHistory });

      io.to(roomTitle).emit('chat data', { chat: { chatHistory, ...speakerData }, roomInfo });
    } else {
      const TALK_TIME = 3;
      const WAITING_TIME = 3;
      const SECOND = 1000;

      setTimeout(async () => {
        roomList.set(roomTitle, { ...roomInfo, state: 'chat' });

        const setTimer = async (name: string) => {
          speakerData.timer = TALK_TIME;

          await new Promise((resolve) => {
            const timer = setInterval(() => {
              speakerData.speaker = name;

              io.to(roomTitle).emit('chat data', { chat: { chatHistory, ...speakerData }, roomInfo });

              speakerData.timer--;

              if (speakerData.timer < 0) {
                resolve('next');
                speakerData.timer = TALK_TIME;
                clearInterval(timer);
              }
            }, SECOND);
          });
        };

        for (let i = 0; i < client.length; i++) {
          await setTimer(client[i].name);
        }

        //투표화면으로 넘어가기.
        setTimeout(() => {
          io.to(roomTitle).emit('chat data', { chat: { chatHistory, speaker: '다음장면', timer: 999 }, roomInfo });
        }, SECOND);
      }, WAITING_TIME * SECOND);
    }
  });
};

/**
 * 게임방 채팅에서 할 소켓 기능 모음
 */
const gameRoomChat = (socket: Socket, io: Server) => {
  sendChatMessage(socket, io);
  sendChatData(socket, io);
};

export default gameRoomChat;
