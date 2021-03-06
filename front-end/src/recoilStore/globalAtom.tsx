import { atom } from 'recoil';

const globalAtom = {
  user: atom({ key: 'user', default: { user_id: '', point: 0, rank: '', socketId: '' } }),
  roomData: atom({ key: 'roomData', default: { selectedRoomTitle: '', roomPassword: '' } }),
  modal: atom({ key: 'modal', default: <></> }),
  roomSettings: atom({ key: 'roomSettings', default: { category: [], max: 1, cycle: 1 } }),
  lobbyBulb: atom({ key: 'lobbyBulb', default: { bulbState: false } }),
  client: atom({ key: 'client', default: [] }),
  vote: atom({ key: 'vote', default: false }),
};

export default globalAtom;
