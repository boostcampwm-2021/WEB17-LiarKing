import { Socket } from 'socket.io';
import { roomList } from '../../store/store';

/**
 * 로비에서 방 리스트 정보 보내기
 */
const sendRoomList = (socket: Socket) => {
  socket.on('room list', () => {
    socket.emit('room list', Array.from(roomList));
  });
};

/**
 * 로비에서 방 생성 결과데이터 보내기
 */
const sendRoomCreate = (socket: Socket) => {
  socket.on('room create', function (data) {
    const roomTitle = data.title;

    if (!roomList.get(roomTitle)) {
      roomList.set(roomTitle, Object.assign(data, { client: [] }));

      socket.leave('lobby');
      socket.to('lobby').emit('room list', Array.from(roomList));

      socket.join(roomTitle);
    } else {
      data = false;
    }

    socket.emit('room create', data);
  });
};

/**
 * 로비에서 방 접속여부 데이터 보내기
 */
const sendRoomJoin = (socket: Socket) => {
  socket.on('room join', (title: string) => {
    //방에 들어갈 수 있으면 true 아니면 false를 주는 코드작성해야함.

    socket.emit('room join', true);
  });
};

/**
 * 로비에서 방 데이터 보내기
 */
const sendRoomData = (socket: Socket) => {
  socket.on('room data', (title: string) => {
    const roomInfo = roomList.get(title);

    socket.leave('lobby');

    if (roomInfo) roomList.set(title, { ...roomInfo, client: [...roomInfo.client, socket.id] });

    socket.join(title);
    console.log(roomList.get(title));

    socket.emit('room data', roomList.get(title));
  });
};

/**
 * 로비에서 할 소켓 기능 모음
 */
const lobbyRoom = (socket: Socket) => {
  socket.join('lobby');

  sendRoomList(socket);

  sendRoomCreate(socket);

  sendRoomJoin(socket);

  sendRoomData(socket);
};

export default lobbyRoom;
