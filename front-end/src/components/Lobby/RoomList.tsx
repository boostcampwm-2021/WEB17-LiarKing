import { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../App';
import { Socket } from 'socket.io-client';

import leftArrow from '../../images/leftArrow.svg';
import rightArrow from '../../images/rightArrow.svg';

let selectedRoom = -1;

const RoomList = ({ rooms, filterWord, setRooms }: any) => {
  const [pageNumber, setPageNumber] = useState(1);
  const { socket, popModal }: { socket: Socket; popModal: any } = useContext(globalContext);
  const MAX_ROOM_LIST = 10;

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
    let newRooms = rooms.map((room: any) => {
      room[1]['selected'] = false;
      return room;
    });
    if (selectedRoom !== index) {
      newRooms[index][1]['selected'] = true;
      selectedRoom = index;
    } else {
      selectedRoom = -1;
    }
    setRooms([...newRooms]);
  };

  useEffect(() => {
    if (rooms.length === 0 && filterWord !== '') popModal('error', '조건을 만족하는 방이 없습니다.');
  }, [filterWord]);

  useEffect(() => {
    socket.on('room list', (roomList) => {
      setRooms(roomList);
    });

    socket.emit('room list', null);
  }, []);

  useEffect(() => {}, [pageNumber]);

  return (
    <div id="room-lists">
      {rooms
        .slice()
        .splice((pageNumber - 1) * MAX_ROOM_LIST, 10)
        .map((room: any, i: number) => {
          const [title, roomInfo] = room;
          const { client, max, selected } = roomInfo;

          return (
            <ul
              className={`room-list${client.length === max ? ' room-full' : ''}${selected ? ' room-list-selected' : ''}`}
              onClick={() => {
                selectRoom(i);
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
