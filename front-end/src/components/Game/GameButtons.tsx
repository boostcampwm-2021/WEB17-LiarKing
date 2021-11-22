import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { globalContext } from '../../App';
import globalAtom from '../../recoilStore/globalAtom';
import globalSelector from '../../recoilStore/globalSelector';
import { GAME_MESSAGE, ROOM_MEESSAGE } from '../../utils/socketMsgConstants';
import { modalPropsType } from '../public/Modal';

import GameRoomSettings from './GameRoomSettings';
type GameButtonsPropsType = { isOwner: boolean; isAllReady?: boolean; isReady?: boolean; roomTitle: string };

const GameButtons = (props: GameButtonsPropsType) => {
  const { isOwner, roomTitle } = props;
  const history = useHistory();
  const [settingsModal, setSettingsModal] = useState([]);
  const [roomSettings, setRoomSettings] = useRecoilState(globalAtom.roomSettings);
  const { socket } = useContext(globalContext);
  const popModal: (modalProps: modalPropsType) => void = useSetRecoilState(globalSelector.popModal);

  const offModal = () => {
    setSettingsModal([]);
  };

  const exit = () => {
    socket.emit(ROOM_MEESSAGE.EXIT, roomTitle);
    history.replace('/lobby');
  };

  const roomSettingsUpdate = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setSettingsModal([ModalOutLocation, <GameRoomSettings offModal={offModal} key={1} />]);
  };

  const roomGameStart = () => {
    if (!props.isAllReady) {
      popModal({ type: 'error', ment: '아직 준비가 되지않은 플레이어가 있습니다.' });
      return;
    }

    const category: string[] = roomSettings.category
      .map(({ category, include }) => {
        if (include) return category;
      })
      .filter((category) => category !== undefined);
    socket.emit(GAME_MESSAGE.WORD_SELECT, { category, roomTitle });
  };

  const roomGameReady = () => {
    socket.emit(GAME_MESSAGE.USER_READY, props.roomTitle);
  };

  return (
    <div className="game-header-buttons">
      {isOwner && (
        <>
          <button className="game-header-button" onClick={roomSettingsUpdate}>
            게임 설정
          </button>
          {settingsModal}
        </>
      )}
      {isOwner && (
        <button className={`game-header-button ${!props.isAllReady ? 'not-ready-to-start' : ''}`} onClick={roomGameStart}>
          게임 시작
        </button>
      )}
      {!isOwner && (
        <button className="game-header-button" onClick={roomGameReady}>
          {props.isReady ? '준비 완료' : '준비 하기'}
        </button>
      )}
      <div className="game-header-button-exit" onClick={exit} />
    </div>
  );
};

export default React.memo(GameButtons);
