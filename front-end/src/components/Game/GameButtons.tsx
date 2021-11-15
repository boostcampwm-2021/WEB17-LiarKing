import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { useRecoilValue } from 'recoil';
import { globalContext } from '../../App';
import globalAtom from '../../recoilStore/globalAtom';

import GameRoomSettings from './GameRoomSettings';
export type GameButtonsPropsType = { isOwner: boolean; gameSetting?: () => void; gameStart?: () => void; gameReady?: () => void };

const GameButtons = (props: GameButtonsPropsType) => {
  const { isOwner } = props;
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
      {isOwner && (
        <button className="game-header-button" onClick={roomSettings}>
          게임 설정
        </button>
        {settingsModal}
      )}
      {isOwner && (
        <button className="game-header-button" onClick={props.gameStart}>
          게임 시작
        </button>
      )}
      {!isOwner && (
        <button className="game-header-button" onClick={props.gameReady}>
          준비 완료
        </button>
      )}
      <div className="game-header-button-exit" onClick={exit} />
    </div>
  );
};

export default React.memo(GameButtons);
