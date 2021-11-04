import '../styles/Lobby.css';
import RoomList from './RoomList';
import Profile from './Profile';
import LobbyButtons from './LobbyButtons';
import React, { useContext, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { globalContext } from '../App';

const Lobby = () => {
  const { socket }: { socket: Socket } = useContext(globalContext);
  useEffect(() => {
    socket.on('room create', (data) => {
      //방으로 페이지 이동 history
    });
  }, []);

  return (
    <div id="lobby">
      <div className="lobby-center-items">
        <div className="lobby-header">Liar Game</div>
        <div className="lobby-rooms">
          <RoomList />
        </div>
      </div>
      <div className="lobby-right-items">
        <Profile />
        <LobbyButtons />
      </div>
    </div>
  );
};

export default React.memo(Lobby);
