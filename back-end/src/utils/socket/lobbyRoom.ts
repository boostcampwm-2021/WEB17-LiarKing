import { Server, Socket } from 'socket.io';
import { idList, nicknameList, roomList, socketUser, socketRoom } from '../../store/store';

/**
 * 로비에 입장했다고 보내기
 */
const sendLobbyEntered = (socket: Socket) => {
  socket.on('lobby entered', (userId: string) => {
    socketUser[socket.id] = userId;
  });
};

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
    const title = data.title;

    if (!roomList.get(title)) {
      roomList.set(title, Object.assign(data, { client: [] }));

      socket.leave('lobby');
      socket.to('lobby').emit('room list', Array.from(roomList));

      socket.join(title);
      socketRoom[socket.id] = title;
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
    socketRoom[socket.id] = title;

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

    socket.emit('room data', roomList.get(title));
  });
};

const sendRoomExit = (socket: Socket, io: Server) => {
  socket.on('room exit', (title: string) => {
    socket.leave(title);
    socket.join('lobby');

    const roomInfo = roomList.get(title);

    if (roomInfo && roomInfo.client.length > 1) {
      const client = roomInfo.client.filter((user: string) => user != socket.id);
      roomList.set(title, { ...roomInfo, client });
      io.to(title).emit('room exit', roomList.get(title));
    } else {
      roomList.delete(title);
    }
  });
};

const sendDisconnect = (socket: Socket, io: Server) => {
  socket.on('disconnect', () => {
    const roomTitle = socketRoom[socket.id];
    if (roomTitle) {
      const roomInfo = roomList.get(roomTitle);
      const client = roomInfo.client.filter((user: string) => user != socket.id);
      roomList.set(roomTitle, { ...roomInfo, client });
      io.to(roomTitle).emit('user disconnected', roomList.get(roomTitle));
    }

    const userId = socketUser[socket.id];
    if (userId) {
      idList.splice(idList.indexOf(userId), idList.indexOf(userId) + 1);
      nicknameList.splice(nicknameList.indexOf(userId), nicknameList.indexOf(userId) + 1);
    }

    delete socketRoom[socket.id];
    delete socketUser[socket.id];
  });
};
/**
 * 로비에서 할 소켓 기능 모음
 */
const lobbyRoom = (socket: Socket, io: Server) => {
  socket.join('lobby');

  sendLobbyEntered(socket);

  sendRoomList(socket);

  sendRoomCreate(socket);

  sendRoomJoin(socket);

  sendRoomData(socket);

  sendRoomExit(socket, io);

  sendDisconnect(socket, io);
};

export default lobbyRoom;
