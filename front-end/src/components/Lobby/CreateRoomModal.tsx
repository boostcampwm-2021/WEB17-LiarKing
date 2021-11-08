import '../../styles/CreateRoomModal.css';
import { useContext, useState } from 'react';
import upArrow from '../../images/upArrow.svg';
import downArorw from '../../images/downArrow.svg';
import { Socket } from 'socket.io-client';
import { globalContext } from '../../App';

const CreateRoomModal = ({ offModal }: { offModal(): void }) => {
  const { popModal, user, socket }: { popModal: any; user: any; socket: Socket } = useContext(globalContext);
  const [roomInfo, setRoomInfo] = useState({ title: '', password: '', max: 1, cycle: 1, owner: user.id });

  const changeTitle = (e: any) => {
    setRoomInfo({ ...roomInfo, title: e.target.value });
  };

  const changePassword = (e: any) => {
    setRoomInfo({ ...roomInfo, password: e.target.value });
  };

  const increasePersons = () => {
    if (roomInfo.max < 8) {
      setRoomInfo({ ...roomInfo, max: roomInfo.max + 1 });
    }
  };

  const decreasePersons = () => {
    if (roomInfo.max > 1) {
      setRoomInfo({ ...roomInfo, max: roomInfo.max - 1 });
    }
  };

  const increaseRounds = () => {
    if (roomInfo.cycle < 3) {
      setRoomInfo({ ...roomInfo, cycle: roomInfo.cycle + 1 });
    }
  };

  const decreaseRounds = () => {
    if (roomInfo.cycle > 1) {
      setRoomInfo({ ...roomInfo, cycle: roomInfo.cycle - 1 });
    }
  };

  const createRoom = () => {
    if (roomInfo.title === '') {
      popModal('error', '방 제목을 입력해주세요.');
    } else {
      socket.emit('room create', roomInfo);
    }
  };

  return (
    <div id="create-room">
      <div className="create-room-header">방 생성하기</div>
      <div className="create-room-name">
        <div className="create-room-sub-header">방 제목</div>
        <input className="cr-name cr-input-box" type="text" placeholder="방 제목을 입력해주세요 (최대 30자)" onInput={changeTitle}></input>
      </div>
      <div className="create-room-password">
        <div className="create-room-sub-header">비밀번호</div>
        <input
          className="cr-password cr-input-box"
          type="password"
          placeholder="비밀번호를 입력해주세요 (최대 20자)"
          onInput={changePassword}
        ></input>
      </div>
      <div className="create-room-persons">
        <div className="create-room-sub-header">최대 플레이어 수</div>
        <input className="cr-persons cr-input-box" type="text" defaultValue={roomInfo.max + ' / 8'}></input>
        <img className="create-room-arrow" src={upArrow} onClick={increasePersons} alt={'room-person-up'}></img>
        <img className="create-room-arrow" src={downArorw} onClick={decreasePersons} alt={'room-person-down'}></img>
      </div>
      <div className="create-room-rounds">
        <div className="create-room-sub-header">라운드 수</div>
        <input className="cr-rounds cr-input-box" type="text" defaultValue={roomInfo.cycle + ' / 3'}></input>
        <img className="create-room-arrow" src={upArrow} onClick={increaseRounds} alt={'room-round-up'}></img>
        <img className="create-room-arrow" src={downArorw} onClick={decreaseRounds} alt={'room-round-down'}></img>
      </div>
      <div className="create-room-buttons">
        <button className="create-room-do cr-button" onClick={createRoom}>
          생성하기
        </button>
        <button className="create-room-cancel cr-button" onClick={offModal}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default CreateRoomModal;
