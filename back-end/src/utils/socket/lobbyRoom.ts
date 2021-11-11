import { Server, Socket } from 'socket.io';
import { idList, nicknameList, roomList, socketUser, socketRoom } from '../../store/store';

/**
 * 유저가 로비에 입장했다고 알림
 */
const sendLobbyEntered = (socket: Socket) => {
  socket.on('lobby entered', (userId: string) => {
    socketUser[socket.id] = userId;
  });
};

/**
 * 유저가 방 리스트 요청
 */
const sendRoomList = (socket: Socket) => {
  socket.on('room list', () => {
    socket.emit('room list', Array.from(roomList));
  });
};

/**
 * 유저가 방 생성 요청
 */
const sendRoomCreate = (socket: Socket, io: Server) => {
  socket.on('room create', function (data) {
    const title = data.title;

    if (!roomList.get(title)) {
      roomList.set(title, Object.assign(data, { client: [] }));

      socket.leave('lobby');
      socket.join(title);
      console.log('join완료');

      socketRoom[socket.id] = title;
    } else {
      data = false;
    }
    socket.emit('room create', data);
  });
};

/**
 * 유저가 방 접속 요청
 */
const sendRoomJoin = (socket: Socket, io: Server) => {
  socket.on('room join', (title: string) => {
    socketRoom[socket.id] = title;
    const roomInfo = roomList.get(title);
    if ((roomInfo && roomInfo.client.length === roomInfo.max) || !roomInfo) {
      socket.emit('room join', false);
    } else {
      socket.emit('room join', true);
      socket.leave('lobby');
      socket.join(title);

      if (roomInfo) roomList.set(title, { ...roomInfo, client: [...roomInfo.client, socket.id] });

      io.to('lobby').emit('room list', Array.from(roomList));
    }
  });
};

/**
 * 유저가 방에 입장하면서 방 정보 요청
 */
const sendRoomData = (socket: Socket, io: Server) => {
  socket.on('room data', (title: string) => {
    io.to(title).emit('room data', roomList.get(title));
  });
};

/**
 * 유저가 방에서 나간다고 알림
 */
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

    io.to('lobby').emit('room list', Array.from(roomList));
  });
};

/**
 * 유저 강제 종료
 */
const sendDisconnect = (socket: Socket, io: Server) => {
  socket.on('disconnect', () => {
    const roomTitle = socketRoom[socket.id];
    const roomInfo = roomList.get(roomTitle);
    if (roomTitle && roomInfo) {
      const client = roomInfo.client;
      if (client.includes(socket.id)) {
        const newClients = client.filter((user: string) => user != socket.id);
        roomList.set(roomTitle, { ...roomInfo, client: newClients });
        io.to(roomTitle).emit('user disconnected', roomList.get(roomTitle));
      }
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

  sendRoomCreate(socket, io);

  sendRoomJoin(socket, io);

  sendRoomData(socket, io);

  sendRoomExit(socket, io);

  sendDisconnect(socket, io);
};

export default lobbyRoom;
