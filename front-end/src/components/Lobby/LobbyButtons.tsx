import { useState } from 'react';
import CreateRoomModal from './CreateRoomModal';
import ExplainRuleModal from './ExplainRuleModal';

const LobbyButtons = () => {
  const [createModal, setCreateModal] = useState([]);
  const [ruleModal, setRuleModal] = useState([]);

  const offModal = () => {
    setCreateModal([]);
    setRuleModal([]);
  };

  const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;

  const createRoom = () => {
    setCreateModal([ModalOutLocation, <CreateRoomModal offModal={offModal} key={1} />]);
  };

  const explainRules = () => {
    setRuleModal([ModalOutLocation, <ExplainRuleModal key={1} />]);
  };

  return (
    <div id="lobby-buttons">
      <button className="lobby-ranking-button lobby-button">랭킹 보기</button>
      <button className="lobby-search-button lobby-button">게임 찾기</button>
      <button className="lobby-enter-button lobby-button">게임 입장</button>
      <button className="lobby-create-button lobby-button" onClick={createRoom}>
        게임 생성
      </button>
      {createModal}
      <button className="lobby-rule-button lobby-button" onClick={explainRules}>
        룰 설명
      </button>
      {ruleModal}
    </div>
  );
};

export default LobbyButtons;
