import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { globalContext } from '../../App';
import globalAtom from '../../recoilStore/globalAtom';
import globalSelector from '../../recoilStore/globalSelector';

import { socketUtilType } from '../../utils/socketUtil';
import { modalPropsType } from '../public/Modal';
import GameRoomSettings from './GameRoomSettings';

const GameButtonsOwner = ({ socket }: { socket: socketUtilType }) => {
  const [isAllReady, setIsAllReady] = useState(false);
  const [settingsModal, setSettingsModal] = useState([]);
  const client = useRecoilValue(globalAtom.client);
  const user = useRecoilValue(globalAtom.user);
  const roomSettings = useRecoilValue(globalAtom.roomSettings);

  const popModal: (modalProps: modalPropsType) => void = useSetRecoilState(globalSelector.popModal);

  const offModal = () => {
    setSettingsModal([]);
  };

  const roomSettingsUpdate = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setSettingsModal([ModalOutLocation, <GameRoomSettings offModal={offModal} key={1} />]);
  };

  const roomGameStart = () => {
    if (!isAllReady) {
      popModal({ type: 'error', ment: '아직 준비가 되지않은 플레이어가 있습니다.' });
      return;
    } else if (client.length < 3) {
      popModal({ type: 'error', ment: '3명 미만은 플레이가 불가능 합니다.' });
      return;
    }

    const categorys: string[] = roomSettings.category
      .map(({ category, include }) => {
        if (include) return category;
      })
      .filter((category) => category !== undefined);

    socket.emit.GAME_START({ categorys });
  };

  useEffect(() => {
    const unReady = client.filter((v) => v.state === '');

    if (!!unReady.find((v) => v.name !== user.user_id)) setIsAllReady(false);
    else setIsAllReady(true);
  }, [client]);

  useEffect(() => {
    socket.on.IS_ALL_READY({ state: isAllReady, setState: setIsAllReady });

    return () => {
      socket.off.IS_ALL_READY();
    };
  }, [isAllReady]);

  return (
    <>
      <button className="game-header-button" onClick={roomSettingsUpdate}>
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
  const [isWaitingState, setIsWaitingState] = useState(true);
  const history = useHistory();
  const { socket }: { socket: socketUtilType } = useContext(globalContext);

  const exitRoom = () => {
    history.replace('/lobby');
  };

  useEffect(() => {
    socket.on.IS_USER_OWNER({ state: isOwner, setState: setIsOwner });

    return () => {
      socket.off.IS_USER_OWNER();
    };
  }, [isOwner]);

  useEffect(() => {
    socket.on.IS_WAITING_STATE({ setState: setIsWaitingState });
    socket.on.REQUEST_USER_OWNER();

    socket.emit.IS_USER_OWNER();
    return () => {
      socket.off.IS_WAITING_STATE();
      socket.off.REQUEST_USER_OWNER();
    };
  }, []);

  return (
    <div className="game-header-buttons">
      {isWaitingState ? (
        <>
          {isOwner ? <GameButtonsOwner socket={socket} /> : <GameButtonsUser socket={socket} />}
          <div className="game-header-button-exit" onClick={exitRoom} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GameButtons;
