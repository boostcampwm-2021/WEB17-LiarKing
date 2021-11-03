import '../styles/Lobby.css';
import RoomList from './RoomList';
import Profile from './Profile';
import LobbyButtons from './LobbyButtons';
import React, { useContext } from 'react';
import { globalContext } from '../App';

const Lobby = () => {
  const { user } = useContext(globalContext);

  alert(JSON.stringify(user));

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
