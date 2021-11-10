import { atom } from 'recoil';
import { io } from 'socket.io-client';

const globalAtom = {
  user: atom({ key: 'user', default: { user_id: '', point: 0, rank: '' } }),
  roomData: atom({ key: 'roomData', default: { selectedRoomTitle: '' } }),
  modal: atom({ key: 'modal', default: <></> }),
  socket: atom({ key: 'socket', default: io(process.env.REACT_APP_SOCKET_HOST, { path: '/socket' }) }),
};

export default globalAtom;
