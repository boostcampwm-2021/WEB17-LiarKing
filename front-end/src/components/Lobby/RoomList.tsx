import { useEffect } from 'react';

const RoomList = ({ rooms }: any) => {
  useEffect(() => {}, []);

  return (
    <div id="room-lists">
      {rooms.map((v: any, i: any) => {
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
