import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

const RoomList = ({ socket }: { socket: Socket }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on('room list', (roomList) => {
      setRooms(roomList);
    });

    socket.emit('room list', null);
  }, []);

  return (
    <div id="room-lists">
      {rooms.map((v) => {
        const { roomInfo, client } = v.value;

        const room = (
          <ul className={`room-list${client.lenght === roomInfo.max ? ' room-full' : ''}`}>
            <div className="room-list-name">{v.title}</div>
            <div className="room-list-persons">{`${client.length} / ${roomInfo.max}`}</div>
          </ul>
        );

        return room;
      })}
    </div>
  );
};

export default RoomList;
