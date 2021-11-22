import '../../styles/CreateRoomModal.css';
import React, { useContext, useEffect, useState } from 'react';
import upArrow from '../../images/upArrow.svg';
import downArorw from '../../images/downArrow.svg';
import { globalContext } from '../../App';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import { modalPropsType } from '../public/Modal';
import globalSelector from '../../recoilStore/globalSelector';

import { socketUtilType } from '../../utils/socketUtil';
import { useHistory } from 'react-router';

import { ROOM_MEESSAGE } from '../../utils/socketMsgConstants';

const categoryList = [
  { category: '과일', include: true },
  { category: '탈것', include: true },
  { category: '장소', include: true },
  { category: '직업', include: true },
  { category: '동물', include: true },
  { category: '음식', include: true },
  { category: '나라', include: true },
  { category: '악기', include: true },
  { category: '스포츠', include: true },
];


const CreateRoomModal = ({ offModal }: { offModal(): void }) => {
  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const user = useRecoilValue(globalAtom.user);
  const [roomInfo, setRoomInfo] = useState({
    title: '',
    password: '',
    max: 1,
    cycle: 1,
    owner: user.user_id,
  });
  const history = useHistory();
  const popModal: (modalProps: modalPropsType) => void = useSetRecoilState(globalSelector.popModal);
  const setRoomDataState = useSetRecoilState(globalAtom.roomData);
  const [roomSettings, setRoomSettings] = useRecoilState(globalAtom.roomSettings);

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomInfo({ ...roomInfo, title: e.target.value });
  };

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      popModal({ type: 'error', ment: '방 제목을 입력해주세요.' });
    } else {

      socket.emit.CREATE_ROOM({ roomInfo });  //수정 필요
      socket.emit(ROOM_MEESSAGE.CREATE, roomInfo); //수정 필요

      setRoomDataState({ selectedRoomTitle: roomInfo.title, roomPassword: roomInfo.password });
      setRoomSettings({ category: categoryList, max: roomInfo.max, cycle: roomInfo.cycle });
    }
  };

  useEffect(() => {
    socket.on.IS_ROOM_CREATE({
      success: () => history.push('/game'),
      error: () => popModal({ type: 'error', ment: '중복된 방제가 있습니다.' }),
    });

    return () => {
      socket.off.IS_ROOM_CREATE();
    };
  }, []);

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
        <input className="cr-persons cr-input-box" type="text" value={roomInfo.max + ' / 8'} readOnly></input>
        <img className="create-room-arrow" src={upArrow} onClick={increasePersons} alt={'room-person-up'}></img>
        <img className="create-room-arrow" src={downArorw} onClick={decreasePersons} alt={'room-person-down'}></img>
      </div>
      <div className="create-room-rounds">
        <div className="create-room-sub-header">라운드 수</div>
        <input className="cr-rounds cr-input-box" type="text" value={roomInfo.cycle + ' / 3'} readOnly></input>
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
