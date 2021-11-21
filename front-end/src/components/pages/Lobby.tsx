import '../../styles/Lobby.css';
import RoomList from '../Lobby/RoomList';
import Profile from '../Lobby/Profile';
import LobbyButtons from '../Lobby/LobbyButtons';
import LightBulb from '../Lobby/LightBulb';
import React, { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../App';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import { socketUtilType } from '../../utils/socketUtil';

const ROOM_TITLE_IDX = 0;

export type roomType = {
  0: string;
  1: { client: Array<string>; cycle: number; max: number; owner: string; password: string; title: string; selected?: boolean };
};

const filterRooms = (rooms: Array<roomType>, filterWord: string) => {
  if (filterWord === '') return rooms;
  return rooms.filter((room: roomType) => room[ROOM_TITLE_IDX].includes(filterWord));
};

const Lobby = () => {
  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const [rooms, setRooms] = useState([]);
  const [filterWord, setFilterWord] = useState('');

  const [roomData, setRoomData] = useRecoilState(globalAtom.roomData);
  const { user_id } = useRecoilValue(globalAtom.user);

  const logout = async () => {
    const res = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: user_id }),
    });

    if (res) {
      socket.emit.LOBBY_LOGOUT();
      window.location.href = '/';
    }
  };

  useEffect(() => {
    socket.emit.LOBBY_ENTERED({ userId: user_id });

    socket.on.ROOM_LIST({ setState: setRooms });

    socket.emit.ROOM_LIST();

    setRoomData({ ...roomData, selectedRoomTitle: '' });

    return () => {
      socket.off.ROOM_LIST();
    };
  }, []);

  return (
    <div id="lobby">
      <div className="lobby-center-items">
        <div className="lobby-header">Liar Game</div>
        <div className="lobby-rooms">
          <RoomList rooms={filterRooms(rooms, filterWord)} filterWord={filterWord} setRooms={setRooms} />
        </div>
      </div>
      <div className="lobby-right-items">
        <Profile />
        <LobbyButtons rooms={rooms} setFilterWord={setFilterWord} />
      </div>
      <button className="lobby-button lobby-logout" onClick={logout}>
        로그아웃
      </button>
      <LightBulb />
    </div>
  );
};

export default React.memo(Lobby);
