import React, { useState, useContext, useEffect } from 'react';
import { globalContext } from '../../App';
import { useHistory } from 'react-router';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import CreateRoomModal from './CreateRoomModal';
import SearchRoomModal from './SearchRoomModal';
import CreateRankModal from './CreateRankModal';
import ExplainRuleModal from './ExplainRuleModal';
import VerfiyPasswordModal from './VerifyPasswordModal';

import globalAtom from '../../recoilStore/globalAtom';
import globalSelector from '../../recoilStore/globalSelector';
import { modalPropsType } from '../public/Modal';
import { roomType } from '../pages/Lobby';
import { socketUtilType } from '../../utils/socketUtil';

const ROOM_INFO_IDX = 1;

const LobbyButtons = ({ rooms, setFilterWord }: { rooms: Array<roomType>; setFilterWord: (filterWord: string) => void }) => {
  const [createModal, setCreateModal] = useState([]);
  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const popModal: (modalProps: modalPropsType) => void = useSetRecoilState(globalSelector.popModal);

  const roomData = useRecoilValue(globalAtom.roomData);

  const history = useHistory();

  const offModal = () => {
    setCreateModal([]);
  };

  const createRoom = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setCreateModal([ModalOutLocation, <CreateRoomModal offModal={offModal} key={1} />]);
  };

  const searchRoom = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setCreateModal([ModalOutLocation, <SearchRoomModal offModal={offModal} key={1} setFilterWord={setFilterWord} />]);
  };

  const joinRoom = () => {
    let currentRoom = { client: new Array(), max: -1 };
    const roomTitle = roomData.selectedRoomTitle;
    const roomPassword = roomData.roomPassword;
    rooms.map((room: roomType) => {
      if (room[ROOM_INFO_IDX].title === roomData.selectedRoomTitle) {
        currentRoom.client = room[ROOM_INFO_IDX].client;
        currentRoom.max = room[ROOM_INFO_IDX].max;
      }
    });
    if (currentRoom.max === -1) {
      popModal({ type: 'alert', ment: '방을 선택해주세요.' });
    } else if (currentRoom.client.length === currentRoom.max) {
      popModal({ type: 'error', ment: '해당 방은 가득 차서 입장이 불가능합니다.' });
    } else if (roomPassword === '') {
      socket.emit.ROOM_JOIN({ roomTitle });
    } else {
      const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
      setCreateModal([ModalOutLocation, <VerfiyPasswordModal offModal={offModal} key={1} />]);
    }
  };

  const explainRules = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setCreateModal([ModalOutLocation, <ExplainRuleModal key={1} />]);
  };

  const createRanking = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setCreateModal([ModalOutLocation, <CreateRankModal offModal={offModal} key={2} />]);
  };

  useEffect(() => {
    socket.on.ROOM_JOIN({
      success: () => history.push('/game'),
      error: () => popModal({ type: 'error', ment: '방에 입장을 할 수 없습니다.' }),
    });
    return () => {
      socket.off.ROOM_JOIN();
    };
  }, []);

  return (
    <div id="lobby-buttons">
      <button className="lobby-ranking-button lobby-button" onClick={createRanking}>
        랭킹 보기
      </button>
      <button className="lobby-search-button lobby-button" onClick={searchRoom}>
        게임 찾기
      </button>
      <button className="lobby-enter-button lobby-button" onClick={joinRoom}>
        게임 입장
      </button>
      <button className="lobby-create-button lobby-button" onClick={createRoom}>
        게임 생성
      </button>
      {createModal}
      <button className="lobby-rule-button lobby-button" onClick={explainRules}>
        룰 설명
      </button>
    </div>
  );
};

export default React.memo(LobbyButtons);
