import '../styles/CreateRoomModal.css';
import { useState } from 'react';
import upArrow from '../images/upArrow.svg';
import downArorw from '../images/downArrow.svg';

const CreateRoomModal = () => {
  const [roomInfo, setRoomInfo] = useState({ name: '', pwd: '', persons: 0, rounds: 0 });

  const changeName = (e: any) => {
    setRoomInfo({ ...roomInfo, name: e.target.value });
  };

  const changePassword = (e: any) => {
    setRoomInfo({ ...roomInfo, pwd: e.target.value });
  };

  const increasePersons = () => {
    if (roomInfo.persons < 8) {
      setRoomInfo({ ...roomInfo, persons: roomInfo.persons + 1 });
    }
  };

  const decreasePersons = () => {
    if (roomInfo.persons > 0) {
      setRoomInfo({ ...roomInfo, persons: roomInfo.persons - 1 });
    }
  };

  const increaseRounds = () => {
    if (roomInfo.rounds < 3) {
      setRoomInfo({ ...roomInfo, rounds: roomInfo.rounds + 1 });
    }
  };

  const decreaseRounds = () => {
    if (roomInfo.rounds > 0) {
      setRoomInfo({ ...roomInfo, rounds: roomInfo.rounds - 1 });
    }
  };

  return (
    <div id="create-room">
      <div className="create-room-header">방 생성하기</div>
      <div className="create-room-name">
        <div className="create-room-sub-header">방 제목</div>
        <input className="cr-name cr-input-box" type="text" placeholder="방 제목을 입력해주세요 (최대 30자)" onInput={changeName}></input>
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
        <input className="cr-persons cr-input-box" type="text" value={roomInfo.persons + ' / 8'}></input>
        <img className="create-room-arrow" src={upArrow} onClick={increasePersons}></img>
        <img className="create-room-arrow" src={downArorw} onClick={decreasePersons}></img>
      </div>
      <div className="create-room-rounds">
        <div className="create-room-sub-header">라운드 수</div>
        <input className="cr-rounds cr-input-box" type="text" value={roomInfo.rounds + ' / 3'}></input>
        <img className="create-room-arrow" src={upArrow} onClick={increaseRounds}></img>
        <img className="create-room-arrow" src={downArorw} onClick={decreaseRounds}></img>
      </div>
      <div className="create-room-buttons">
        <button className="create-room-do cr-button">생성하기</button>
        <button className="create-room-cancel cr-button">닫기</button>
      </div>
    </div>
  );
};

export default CreateRoomModal;
