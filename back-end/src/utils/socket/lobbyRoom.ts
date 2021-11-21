import { Server, Socket } from 'socket.io';
import { idList, nicknameList, roomList, socketData, roomSecrets, roomInfoType } from '../../store/store';

const LOBBY = 'lobby';

//on
const CREATE_ROOM = 'create room';
const LOBBY_ENTERED = 'lobby entered';
const LOBBY_LOGOUT = 'lobby logout';

//emit broadcast
const ROOM_LIST = 'room list';

//emit unicast
const IS_ROOM_CREATE = 'is room create';
const ROOM_JOIN = 'room join';

/**
 * 유저가 로비에 입장했다고 알림
 */
const sendLobbyEntered = (socket: Socket) => {
  socket.on(LOBBY_ENTERED, ({ userId }: { userId: string }) => {
    socketData.set(socket.id, { name: userId, roomTitle: null });
  });
};

/**
 * 유저가 방 리스트 요청
 */
const sendRoomList = (socket: Socket) => {
  socket.on(ROOM_LIST, () => {
    socket.emit(ROOM_LIST, { roomList: Array.from(roomList) });
  });
};

/**
 * 유저가 방 생성 요청
 */
const sendRoomCreate = (socket: Socket, io: Server) => {
  type createRoomInfoType = {
    title: string;
    password: string;
    max: number;
    cycle: number;
    owner: string;
  };

  socket.on(CREATE_ROOM, ({ roomInfo }: { roomInfo: createRoomInfoType }) => {
    const { title } = roomInfo;
    const socketInfo = socketData.get(socket.id);
    const isDuplicateRoom: boolean = !roomList.get(title);

    if (isDuplicateRoom) {
      const createRoomInfo: roomInfoType = Object.assign(
        {},
        {
          ...roomInfo,
          state: 'waiting',
          chatHistory: [],
          speakerData: { speaker: '', timer: 0 },
          client: [{ socketId: socket.id, name: socketInfo.name, state: '' }],
        }
      );

      roomList.set(title, createRoomInfo);
      roomSecrets.set(title, { liar: null, answerWord: '', vote: [], words: [] });

      socket.leave(LOBBY);
      socket.join(title);

      socketData.set(socket.id, { ...socketInfo, roomTitle: title });

      io.to(LOBBY).emit(ROOM_LIST, { roomList: Array.from(roomList) });
    }

    socket.emit(IS_ROOM_CREATE, isDuplicateRoom);
  });
};

/**
 * 유저가 방 접속 요청
 */
const sendRoomJoin = (socket: Socket, io: Server) => {
  socket.on(ROOM_JOIN, (title: string) => {
    const roomInfo = roomList.get(title);
    const socketInfo = socketData.get(socket.id);

    if ((roomInfo && roomInfo.client.length === roomInfo.max) || !roomInfo) {
      socket.emit(ROOM_JOIN, false);
    } else {
      socket.emit(ROOM_JOIN, true);
      socket.leave(LOBBY);
      socket.join(title);

      if (roomInfo) {
        roomList.set(title, { ...roomInfo, client: [...roomInfo.client, { socketId: socket.id, name: socketInfo.name, state: '' }] });
        socketData.set(socket.id, { ...socketInfo, roomTitle: title });
      }

      io.to(LOBBY).emit(ROOM_LIST, Array.from(roomList));
    }
  });
};

/**
 * 유저가 로비에서 로그아웃을 한다.
 */
const userLogout = (socket: Socket, io: Server) => {
  socket.on(LOBBY_LOGOUT, () => {
    socketData.delete(socket.id);
  });
};

/**
 * 유저 강제 종료
 */
const sendDisconnect = (socket: Socket, io: Server) => {
  socket.on('disconnect', () => {
    const socketInfo = socketData.get(socket.id);
    const roomTitle = socketInfo.roomTitle;
    const roomInfo = roomList.get(roomTitle);

    if (roomTitle && roomInfo && roomInfo.client.find((v: { socketId: string }) => v.socketId === socket.id)) {
      const newClients = roomInfo.client.filter((user: { socketId: string; name: string }) => user.socketId !== socket.id);
      if (newClients.length === 0) {
        roomList.delete(roomTitle);
      } else {
        roomList.set(roomTitle, { ...roomInfo, client: newClients });
        if (roomInfo.state === 'waiting') io.to(roomTitle).emit('room data', { roomInfo: roomList.get(roomTitle), tag: 'user disconnected' });
      }
      io.to('lobby').emit('room list', Array.from(roomList));
    }

    const userId = socketInfo.name;

    if (userId) {
      idList.splice(idList.indexOf(userId), idList.indexOf(userId) + 1);
      nicknameList.splice(nicknameList.indexOf(userId), nicknameList.indexOf(userId) + 1);
    }

    socketData.delete(socket.id);
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

  userLogout(socket, io);

  sendDisconnect(socket, io);
};

export default lobbyRoom;
