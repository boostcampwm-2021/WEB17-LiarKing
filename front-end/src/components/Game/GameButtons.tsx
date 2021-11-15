import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { useRecoilValue } from 'recoil';
import { globalContext } from '../../App';
import globalAtom from '../../recoilStore/globalAtom';

import GameRoomSettings from './GameRoomSettings';

const GameButtons = () => {
  const history = useHistory();
  const [settingsModal, setSettingsModal] = useState([]);
  const { socket } = useContext(globalContext);
  const { selectedRoomTitle } = useRecoilValue(globalAtom.roomData);

  const offModal = () => {
    setSettingsModal([]);
  };

  const exit = () => {
    socket.emit('room exit', selectedRoomTitle);
    history.replace('/lobby');
  };

  const roomSettings = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setSettingsModal([ModalOutLocation, <GameRoomSettings offModal={offModal} key={1} />]);
  };

  return (
    <div className="game-header-buttons">
      <button className="game-header-button" onClick={roomSettings}>
        게임 설정
      </button>
      {settingsModal}
      <button className="game-header-button">준비 완료</button>
      <button className="game-header-button">게임 시작</button>
      <div className="game-header-button-exit" onClick={exit} />
    </div>
  );
};

export default React.memo(GameButtons);
