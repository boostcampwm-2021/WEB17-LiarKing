import { Server, Socket } from 'socket.io';
import { socketDatas, socketToPeer, roomList } from '../../store/store';

const I_JOINED = 'i joined';
const SOMEONE_JOINED = 'someone joined';
const RTC_INFO = 'rtc info';
const ROOM_CLIENTS_INFO = 'room clients info';

const sendJoin = (socket: Socket, io: Server) => {
  socket.on(I_JOINED, ({ peerId }) => {
    const socketInfo = socketDatas.get(socket.id);
    if (!socketInfo) return;
    const roomTitle = socketInfo.roomTitle;
    socketToPeer[socket.id] = peerId;
    socket.broadcast.to(roomTitle).emit(SOMEONE_JOINED, { peerId });
  });
};

const sendRtcInfo = (socket: Socket, io: Server) => {
  socket.on(RTC_INFO, ({ state }: { state: boolean }) => {
    const socketInfo = socketDatas.get(socket.id);
    if (!socketInfo) return;
    const roomTitle = socketInfo.roomTitle;
    if (!roomTitle) return;
    const roomInfo = roomList.get(roomTitle);

    if (state) {
      roomInfo.client.map((v) => {
        if (v.name === socketInfo.name) v.rtc = 'on';
      });
    } else {
      roomInfo.client.map((v) => {
        if (v.name === socketInfo.name) v.rtc = 'off';
      });
    }

    roomList.set(roomTitle, roomInfo);

    io.to(roomTitle).emit(ROOM_CLIENTS_INFO, { clients: roomList.get(roomTitle).client });
  });
};

const gameRoomTalk = (socket: Socket, io: Server) => {
  sendJoin(socket, io);
  sendRtcInfo(socket, io);
};

export default gameRoomTalk;
