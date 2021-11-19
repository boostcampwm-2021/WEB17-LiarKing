import { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../App';
import { Socket } from 'socket.io-client';

import leftArrow from '../../images/leftArrow.svg';
import rightArrow from '../../images/rightArrow.svg';
import { useRecoilState, useSetRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import { modalPropsType } from '../public/Modal';
import globalSelector from '../../recoilStore/globalSelector';
import { roomType } from '../pages/Lobby';
import { ROOM_MEESSAGE } from '../../utils/socketMsgConstants';

let selectedRoom = -1;
const ROOM_INFO_IDX = 1;
const MAX_ROOM_LIST = 10;

interface roomListInterface {
  rooms: Array<roomType>;
  filterWord: string;
  setRooms: (rooms: Array<roomType>) => void;
}

const RoomList = ({ rooms, filterWord, setRooms }: roomListInterface) => {
  const [pageNumber, setPageNumber] = useState(1);
  const { socket }: { socket: Socket } = useContext(globalContext);

  const [roomData, setRoomData] = useRecoilState(globalAtom.roomData);
  const popModal: (modalProps: modalPropsType) => void = useSetRecoilState(globalSelector.popModal);

  const increasePage = () => {
    if (pageNumber * MAX_ROOM_LIST < rooms.length) {
      setPageNumber(pageNumber + 1);
    }
  };

  const decreasePage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const selectRoom = (index: number) => {
    let newRooms = rooms.map((room: roomType) => {
      room[ROOM_INFO_IDX]['selected'] = false;
      return room;
    });
    if (selectedRoom !== index) {
      newRooms[index][ROOM_INFO_IDX]['selected'] = true;
      selectedRoom = index;
      setRoomData({ ...roomData, selectedRoomTitle: newRooms[index][ROOM_INFO_IDX].title, roomPassword: newRooms[index][ROOM_INFO_IDX].password });
    } else {
      selectedRoom = -1;
      setRoomData({ ...roomData, selectedRoomTitle: '' });
    }
    setRooms([...newRooms]);
  };

  useEffect(() => {
    if (rooms.length === 0 && filterWord !== '') popModal({ type: 'error', ment: '조건을 만족하는 방이 없습니다.' });
  }, [filterWord]);

  useEffect(() => {
    socket.on(ROOM_MEESSAGE.LIST, (roomList) => {
      setRooms(roomList);
    });

    socket.emit(ROOM_MEESSAGE.LIST, null);

    return () => {
      socket.off(ROOM_MEESSAGE.LIST);
    };
  }, []);

  useEffect(() => {}, [pageNumber]);

  return (
    <div id="room-lists">
      {rooms
        .slice()
        .splice((pageNumber - 1) * MAX_ROOM_LIST, MAX_ROOM_LIST)
        .map((room: roomType, i: number) => {
          const [title, client, max, selected] = [
            room[ROOM_INFO_IDX].title,
            room[ROOM_INFO_IDX].client,
            room[ROOM_INFO_IDX].max,
            room[ROOM_INFO_IDX].selected,
          ];
          return (
            <ul
              className={`room-list${client.length === max ? ' room-full' : ''}${selected ? ' room-list-selected' : ''}`}
              onClick={() => {
                selectRoom((pageNumber - 1) * MAX_ROOM_LIST + i);
              }}
              key={i}
            >
              <div className="room-list-name">{title}</div>
              <div className="room-list-persons">{`${client.length} / ${max}`}</div>
            </ul>
          );
        })}
      <div className="room-list-buttons">
        <img className="room-list-arrows" src={leftArrow} onClick={decreasePage}></img>
        <div className="room-list-numbers">{pageNumber + ' / ' + Math.ceil(rooms.length / 10)}</div>
        <img className="room-list-arrows" src={rightArrow} onClick={increasePage}></img>
      </div>
    </div>
  );
};

export default RoomList;
