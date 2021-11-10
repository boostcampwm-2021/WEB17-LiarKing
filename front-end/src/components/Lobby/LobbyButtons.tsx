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

interface roomInterface {
  [prop: string]: any;
}

const LobbyButtons = ({ rooms, setFilterWord }: { rooms: any; setFilterWord: (filterWord: string) => void }) => {
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
    console.log(rooms);
    let currentRoom = { client: Array, max: -1 };
    rooms.map((room: roomInterface) => {
      if (room[1].title === roomData.selectedRoomTitle) {
        currentRoom = room[1];
      }
    });
    if (currentRoom.max === -1) {
      popModal('alert', '방을 선택해주세요.');
    } else if (currentRoom.client.length === currentRoom.max) {
      popModal('error', '해당 방은 가득 차서 입장이 불가능합니다.');
    } else {
      socket.emit('room join', roomData.selectedRoomTitle);
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
