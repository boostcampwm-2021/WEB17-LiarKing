import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useSetRecoilState } from 'recoil';
import { globalContext } from '../../App';
import globalSelector from '../../recoilStore/globalSelector';
import { socketUtilType } from '../../utils/socketUtil';
import { modalPropsType } from '../public/Modal';
import GameRoomSettings from './GameRoomSettings';

const GameButtonsOwner = ({ socket }: { socket: socketUtilType }) => {
  const [isAllReady, setIsAllReady] = useState(false);
  const [settingsModal, setSettingsModal] = useState([]);
  const popModal: (modalProps: modalPropsType) => void = useSetRecoilState(globalSelector.popModal);

  const offModal = () => {
    setSettingsModal([]);
  };

  const roomSettings = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setSettingsModal([ModalOutLocation, <GameRoomSettings offModal={offModal} key={1} />]);
  };

  const roomGameStart = () => {
    if (isAllReady) {
      popModal({ type: 'error', ment: '아직 준비가 되지않은 플레이어가 있습니다.' });
      return;
    }

    const categorys: string[] = ['과일', '탈것', '장소', '직업'];

    socket.emit.GAME_START({ categorys });
  };

  useEffect(() => {
    socket.on.IS_ALL_READY({ state: isAllReady, setState: setIsAllReady });

    return () => {
      socket.off.IS_ALL_READY();
    };
  }, [isAllReady]);

  return (
    <>
      <button className="game-header-button" onClick={roomSettings}>
        게임 설정
      </button>
      {settingsModal}
      <button className={`game-header-button ${!isAllReady ? 'inactive' : ''}`} onClick={roomGameStart}>
        게임 시작
      </button>
    </>
  );
};

const GameButtonsUser = ({ socket }: { socket: socketUtilType }) => {
  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const roomGameReady = () => {
    if (isActive) {
      const NEXT_ACTIVATION_TIME = 1000;
      socket.emit.ROOM_READY();

      setIsActive(false);

      setTimeout(() => {
        setIsActive(true);
      }, NEXT_ACTIVATION_TIME);
    }
  };

  useEffect(() => {
    socket.on.IS_USER_READY({ setState: setIsReady });

    return () => {
      socket.off.IS_USER_READY();
    };
  }, []);

  return (
    <button className={`game-header-button ${isActive ? '' : 'inactive'}`} onClick={roomGameReady}>
      {isReady ? '준비 완료' : '준비 하기'}
    </button>
  );
};

const GameButtons = () => {
  const [isOwner, setIsOwner] = useState(null);
  const history = useHistory();
  const { socket }: { socket: socketUtilType } = useContext(globalContext);

  const exitRoom = () => {
    socket.emit.ROOM_EXIT();
    history.replace('/lobby');
  };

  useEffect(() => {
    socket.emit.IS_USER_OWNER();
  }, []);

  useEffect(() => {
    socket.on.IS_USER_OWNER({ state: isOwner, setState: setIsOwner });

    return () => {
      socket.off.IS_USER_OWNER();
    };
  }, [isOwner]);

  return (
    <div className="game-header-buttons">
      {isOwner ? <GameButtonsOwner socket={socket} /> : <GameButtonsUser socket={socket} />}
      <div className="game-header-button-exit" onClick={exitRoom} />
    </div>
  );
};

export default React.memo(GameButtons);
