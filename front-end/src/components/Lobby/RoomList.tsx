import { useEffect, useState, useContext } from 'react';
import { Socket } from 'socket.io-client';
import { globalContext } from '../../App';

const RoomList = () => {
  const { socket }: { socket: Socket } = useContext(globalContext);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on('room list', (roomList) => {
      setRooms(roomList);
    });

    socket.emit('room list', null);
  });

  return (
    <div id="room-lists">
      {rooms.map((v, i) => {
        const [title, roomInfo] = v;
        const { client, max } = roomInfo;

        const room = (
          <ul className={`room-list${client.length === max ? ' room-full' : ''}`} key={i}>
            <div className="room-list-name">{title}</div>
            <div className="room-list-persons">{`${client.length} / ${max}`}</div>
          </ul>
        );

        return room;
      })}
    </div>
  );
};

export default RoomList;
