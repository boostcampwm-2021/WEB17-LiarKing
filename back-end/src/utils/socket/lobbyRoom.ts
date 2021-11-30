import { Server, Socket } from 'socket.io';
import { roomList, socketDatas, roomSecrets, roomInfoType, socketToPeer, idList, nicknameList } from '../../store/store';
import timer from '../timer';

const LOBBY = 'lobby';

//on
const CREATE_ROOM = 'create room';
const LOBBY_ENTERED = 'lobby entered';
const LOBBY_LOGOUT = 'lobby logout';
const DISCONNECT = 'disconnect';

//emit broadcast
const ROOM_LIST = 'room list';
const REQUEST_USER_OWNER = 'request user owner';
const ROOM_CLIENTS_INFO = 'room clients info';
const ROOM_TITLE_INFO = 'room title info';
const SETTING_CHANGE = 'setting change';
const RTC_DISCONNECT = 'rtc disconnect';
const ROOM_GAME_DISCONNECT = 'room game disconnect';

//emit unicast
const IS_ROOM_CREATE = 'is room create';
const ROOM_JOIN = 'room join';

/**
 * 유저가 로비에 입장했다고 알림
 */
const sendLobbyEntered = (socket: Socket, io: Server) => {
  socket.on(LOBBY_ENTERED, async ({ userId, rank }: { userId: string; rank: string }) => {
    const socketInfo = socketDatas.get(socket.id);

    if (!!socketInfo && !!socketInfo.roomTitle) {
      const { name, roomTitle } = socketInfo;
      const roomInfo = roomList.get(roomTitle);

      socket.leave(roomTitle);
      socket.join(LOBBY);

      if (!!roomInfo && roomInfo.client.length === 1) {
        roomList.delete(roomTitle);
        roomSecrets.delete(roomTitle);

        io.to(LOBBY).emit(ROOM_LIST, { roomList: Array.from(roomList) });
      } else if (!!roomInfo) {
        if (roomInfo.owner === name) {
          const WAITING_TIME = 100;
          const { max, cycle } = roomInfo;

          const client = roomInfo.client.find((v) => v.name !== name);
          client.state = '';
          roomInfo.owner = client.name;

          io.to(roomTitle).emit(REQUEST_USER_OWNER, null);

          await timer(WAITING_TIME);

          io.to(roomTitle).emit(SETTING_CHANGE, { roomOwnerSetting: { max, cycle } });
        }

        if (roomInfo.state === 'start') {
          io.to(roomTitle).emit(ROOM_GAME_DISCONNECT, { userId: socketInfo.name });
          roomInfo.state = 'waiting';
        }
        roomInfo.client = roomInfo.client.filter((v) => v.name !== name);
        roomList.set(roomTitle, roomInfo);

        io.to(roomTitle).emit(ROOM_CLIENTS_INFO, { clients: roomInfo.client });
        io.to(roomTitle).emit(ROOM_TITLE_INFO, { usersAmount: roomInfo.client.length });
        io.to(roomTitle).emit(RTC_DISCONNECT, { peerId: socketToPeer[socket.id] });
        io.to(LOBBY).emit(ROOM_LIST, { roomList: Array.from(roomList) });
      }
    }

    socketDatas.set(socket.id, { name: userId, roomTitle: null, rank });
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
    category: [];
  };

  socket.on(CREATE_ROOM, ({ roomInfo }: { roomInfo: createRoomInfoType }) => {
    const { title } = roomInfo;
    const socketInfo = socketDatas.get(socket.id);
    const isDuplicateRoom: boolean = !roomList.get(title);

    if (isDuplicateRoom && !!socketInfo) {
      const createRoomInfo: roomInfoType = Object.assign(
        {},
        {
          ...roomInfo,
          state: 'waiting',
          chatHistory: [],
          speakerData: { speaker: '', timer: 0 },
          client: [{ socketId: socket.id, name: socketInfo.name, state: '', rank: socketInfo.rank, rtc: 'off' }],
        }
      );

      roomList.set(title, createRoomInfo);
      roomSecrets.set(title, { liar: null, answerWord: '', vote: [], words: [] });

      socket.leave(LOBBY);
      socket.join(title);

      socketDatas.set(socket.id, { ...socketInfo, roomTitle: title });

      io.to(LOBBY).emit(ROOM_LIST, { roomList: Array.from(roomList) });
    }

    socket.emit(IS_ROOM_CREATE, { isRoomCreate: isDuplicateRoom });
  });
};

/**
 * 유저가 방 접속 요청
 */
const sendRoomJoin = (socket: Socket, io: Server) => {
  socket.on(ROOM_JOIN, ({ roomTitle }: { roomTitle: string }) => {
    const roomInfo = roomList.get(roomTitle);
    const socketInfo = socketDatas.get(socket.id);

    if (!roomInfo || roomInfo.client.length === roomInfo.max || roomInfo.state !== 'waiting') {
      socket.emit(ROOM_JOIN, { isEnter: false });
    } else {
      socket.emit(ROOM_JOIN, { isEnter: true });
      socket.leave(LOBBY);
      socket.join(roomTitle);

      roomInfo.client = [...roomInfo.client, { socketId: socket.id, name: socketInfo.name, state: '', rank: socketInfo.rank, rtc: 'off' }];

      roomList.set(roomTitle, roomInfo);
      socketDatas.set(socket.id, { ...socketInfo, roomTitle });

      io.to(roomTitle).emit(ROOM_CLIENTS_INFO, { clients: roomInfo.client });
      io.to(LOBBY).emit(ROOM_LIST, { roomList: Array.from(roomList) });
    }
  });
};

/**
 * 유저가 로비에서 로그아웃을 한다.
 */
const userLogout = (socket: Socket, io: Server) => {
  socket.on(LOBBY_LOGOUT, () => {
    socketDatas.delete(socket.id);
  });
};

/**
 * 유저 강제 종료
 */
const sendDisconnect = (socket: Socket, io: Server) => {
  socket.on(DISCONNECT, async () => {
    const socketInfo = socketDatas.get(socket.id);

    //메인화면에서 강제종료 했을 때.
    if (!socketInfo) return;

    idList.splice(idList.indexOf(socketInfo.name), idList.indexOf(socketInfo.name) + 1);
    nicknameList.splice(nicknameList.indexOf(socketInfo.name), nicknameList.indexOf(socketInfo.name) + 1);

    //로비에서 강제종료 했을 때.
    if (socketInfo.roomTitle === '') {
      socketDatas.delete(socket.id);
      return;
    }

    //게임방에서 강제종료 했을 때.
    const { name, roomTitle } = socketInfo;
    const roomInfo = roomList.get(roomTitle);

    if (!!roomInfo && roomInfo.client.length === 1) {
      roomList.delete(roomTitle);
      roomSecrets.delete(roomTitle);

      io.to(LOBBY).emit(ROOM_LIST, { roomList: Array.from(roomList) });
    } else if (!!roomInfo) {
      if (roomInfo.owner === name) {
        const WAITING_TIME = 100;
        const { max, cycle } = roomInfo;

        const client = roomInfo.client.find((v) => v.name !== name);

        client.state = '';
        roomInfo.owner = client.name;

        io.to(roomTitle).emit(REQUEST_USER_OWNER, null);

        await timer(WAITING_TIME);

        io.to(roomTitle).emit(SETTING_CHANGE, { roomOwnerSetting: { max, cycle } });
      }

      if (roomInfo.state === 'start') {
        io.to(roomTitle).emit(ROOM_GAME_DISCONNECT, { userId: socketInfo.name });
        roomInfo.state = 'waiting';
      }

      roomInfo.client = roomInfo.client.filter((v) => v.name !== name);
      roomList.set(roomTitle, roomInfo);

      io.to(roomTitle).emit(ROOM_CLIENTS_INFO, { clients: roomInfo.client });
      io.to(roomTitle).emit(ROOM_TITLE_INFO, { usersAmount: roomInfo.client.length });
      io.to(roomTitle).emit(RTC_DISCONNECT, { peerId: socketToPeer[socket.id] });
      io.to(LOBBY).emit(ROOM_LIST, { roomList: Array.from(roomList) });
    }

    //나간사람이 라이어일 경우 게임이 종료 및 패널티부여 등의 로직이 들어가야함.

    socketDatas.delete(socket.id);
  });
};

/**
 * 로비에서 할 소켓 기능 모음
 */
const lobbyRoom = (socket: Socket, io: Server) => {
  socket.join(LOBBY);

  sendLobbyEntered(socket, io);

  sendRoomList(socket);

  sendRoomCreate(socket, io);

  sendRoomJoin(socket, io);

  userLogout(socket, io);

  sendDisconnect(socket, io);
};

export default lobbyRoom;
