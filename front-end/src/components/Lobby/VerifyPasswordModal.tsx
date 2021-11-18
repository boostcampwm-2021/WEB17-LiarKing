import '../../styles/SearchRoomModal.css';
import { Socket } from 'socket.io-client';
import React, { useState, useContext } from 'react';
import { globalContext } from '../../App';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import { modalPropsType } from '../public/Modal';
import globalSelector from '../../recoilStore/globalSelector';

const VerfiyPasswordModal = ({ offModal }: { offModal(): void }) => {
  const [passwordInput, setPassword] = useState('');
  const popModal: (modalProps: modalPropsType) => void = useSetRecoilState(globalSelector.popModal);
  const roomData = useRecoilValue(globalAtom.roomData);
  const { socket }: { socket: Socket } = useContext(globalContext);

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const searchRoom = () => {
    const roomTitle = roomData.selectedRoomTitle;
    const roomPassword = roomData.roomPassword;
    if (passwordInput === '') {
      popModal({ type: 'error', ment: '비밀번호를 입력해주세요.' });
    } else if (passwordInput !== roomPassword) {
      offModal();
      popModal({ type: 'error', ment: '비밀번호가 틀렸습니다.' });
    } else {
      offModal();
      socket.emit('room join', roomTitle);
    }
  };

  return (
    <div id="search-room">
      <div className="search-room-header">방 비밀번호 확인</div>
      <div className="search-room-name">
        <input className="sh-name sh-input-box" type="text" placeholder="비밀번호" onInput={changeTitle}></input>
      </div>
      <div className="search-room-buttons">
        <button className="search-room-do sh-button" onClick={searchRoom}>
          입장하기
        </button>
        <button className="search-room-cancel sh-button" onClick={offModal}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default VerfiyPasswordModal;
