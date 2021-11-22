import '../../styles/Lobby.css';
import RoomList from '../Lobby/RoomList';
import Profile from '../Lobby/Profile';
import LobbyButtons from '../Lobby/LobbyButtons';
import LightBulb from '../Lobby/LightBulb';
import React, { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../App';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';

import { socketUtilType } from '../../utils/socketUtil'; //수정 필요

import globalSelector from '../../recoilStore/globalSelector';
import { modalPropsType } from '../public/Modal';
import { LOBBY_MESSAGE, ROOM_MEESSAGE } from '../../utils/socketMsgConstants'; //수정 필요


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
    //수정필요
    socket.emit.LOBBY_ENTERED({ userId: user_id });

    socket.on.ROOM_LIST({ setState: setRooms });

    socket.emit.ROOM_LIST();

    //수정필요
    socket.on(ROOM_MEESSAGE.LIST, (roomList) => {
      setRooms(roomList);
    });

    socket.emit(ROOM_MEESSAGE.LIST, null);

    socket.emit(LOBBY_MESSAGE.ENTER, user_id);

    setRoomData({ ...roomData, selectedRoomTitle: '' });

    return () => {
      //수정필요
      socket.off.ROOM_LIST();
      //수정필요
      socket.off(ROOM_MEESSAGE.CREATE);
      socket.off(ROOM_MEESSAGE.LIST);
    };
  }, []);

  return (
    <div id="lobby">
      <div className="lobby-center-items">
        <div className="lobby-header">Liar Game</div>
        <div className="lobby-rooms">
          <RoomList rooms={rooms} fRooms={filterRooms(rooms, filterWord)} filterWord={filterWord} setRooms={setRooms} />
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
