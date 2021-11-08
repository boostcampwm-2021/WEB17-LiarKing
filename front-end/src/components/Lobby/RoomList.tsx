import { useContext, useEffect } from 'react';
import { globalContext } from '../../App';

const RoomList = ({ rooms, filterWord }: any) => {
  const { popModal }: { popModal: any } = useContext(globalContext);
  useEffect(() => {
    if (rooms.length === 0 && filterWord !== '') popModal('error', '조건을 만족하는 방이 없습니다.');
  }, [filterWord]);

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
