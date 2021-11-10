import { atom } from 'recoil';

const globalAtom = {
  user: atom({ key: 'user', default: { user_id: '', point: 0, rank: '' } }),
  roomData: atom({ key: 'roomData', default: { selectedRoomTitle: '' } }),
  modal: atom({ key: 'modal', default: <></> }),
};

export default globalAtom;
