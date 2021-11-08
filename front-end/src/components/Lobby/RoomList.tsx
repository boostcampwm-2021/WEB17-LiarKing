import { useEffect, useState, useContext } from 'react';
import leftArrow from '../../images/leftArrow.svg';
import rightArrow from '../../images/rightArrow.svg';
import { Socket } from 'socket.io-client';
import { globalContext } from '../../App';

const RoomList = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [rooms, setRooms] = useState([]);
  const { socket }: { socket: Socket } = useContext(globalContext);
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
        .map((room, i) => {
          const [title, roomInfo] = room;
          const { client, max } = roomInfo;

          return (
            <ul className={`room-list${client.length === max ? ' room-full' : ''}`} key={i}>
              <div className="room-list-name">{title}</div>
              <div className="room-list-persons">{`${client.length} / ${max}`}</div>
            </ul>
          );
        })}
      <div className="room-list-buttons">
        <img className="room-list-arrows" src={leftArrow} onClick={decreasePage}></img>
        <img className="room-list-arrows" src={rightArrow} onClick={increasePage}></img>
      </div>
    </div>
  );
};

export default RoomList;
