import React, { useState, useContext, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { globalContext } from '../../App';
import { useHistory } from 'react-router';
import CreateRoomModal from './CreateRoomModal';
import SearchRoomModal from './SearchRoomModal';
import CreateRankModal from './CreateRankModal';
import ExplainRuleModal from './ExplainRuleModal';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import setModal from '../../utils/setModal';

const LobbyButtons = ({ setFilterWord }: { setFilterWord: (filterWord: string) => void }) => {
  const [createModal, setCreateModal] = useState([]);
  const { socket }: { socket: Socket } = useContext(globalContext);

  const roomData = useRecoilValue(globalAtom.roomData);

  const history = useHistory();
  const setModalState = useSetRecoilState(globalAtom.modal);

  const popModal = (type: 'alert' | 'warning' | 'error', ment: string) => {
    setModal(setModalState, { type, ment });
  };

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
    const roomTitle = roomData.selectedRoomTitle;
    socket.emit('room join', roomTitle);
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
    socket.on('room join', (isEnter) => {
      if (isEnter) history.push('/game');
      else popModal('error', '방에 입장을 할 수 없습니다.');
    });
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
