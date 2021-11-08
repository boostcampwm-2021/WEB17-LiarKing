import { useState } from 'react';
import CreateRoomModal from './CreateRoomModal';
import CreateRankModal from './CreateRankModal';

const LobbyButtons = () => {
  const [createModal, setCreateModal] = useState([]);
  const createRoom = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setCreateModal([ModalOutLocation, <CreateRoomModal offModal={offModal} key={1} />]);
  };

  const createRanking = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setCreateModal([ModalOutLocation, <CreateRankModal offModal={offModal} key={2} />]);
  };

  const offModal = () => {
    setCreateModal([]);
  };

  return (
    <div id="lobby-buttons">
      <button className="lobby-ranking-button lobby-button" onClick={createRanking}>
        랭킹 보기
      </button>
      <button className="lobby-search-button lobby-button">게임 찾기</button>
      <button className="lobby-enter-button lobby-button">게임 입장</button>
      <button className="lobby-create-button lobby-button" onClick={createRoom}>
        게임 생성
      </button>
      {createModal}
      <button className="lobby-rule-button lobby-button">룰 설명</button>
    </div>
  );
};

export default LobbyButtons;
