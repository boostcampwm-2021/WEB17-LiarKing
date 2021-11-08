import '../../styles/Lobby.css';
import RoomList from '../Lobby/RoomList';
import Profile from '../Lobby/Profile';
import LobbyButtons from '../Lobby/LobbyButtons';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Socket } from 'socket.io-client';
import { globalContext } from '../../App';

const Lobby = () => {
  const { socket, popModal }: { socket: Socket; popModal: any } = useContext(globalContext);
  const history = useHistory();

  useEffect(() => {
    socket.on('room create', (data) => {
      if (data) {
        history.push('/game');
      } else {
        popModal('error', '중복된 방제가 있습니다.');
      }
    });
  });

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
