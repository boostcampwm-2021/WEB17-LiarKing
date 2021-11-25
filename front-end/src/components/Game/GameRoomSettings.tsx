import React, { useContext, useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';

import '../../styles/GameRoomSettings.css';
import upArrow from '../../images/upArrow.svg';
import downArorw from '../../images/downArrow.svg';
import { globalContext } from '../../App';
import { socketUtilType } from '../../utils/socketUtil';

const GameRoomSettings = ({ offModal }: { offModal(): void }) => {
  const { socket }: { socket: socketUtilType } = useContext(globalContext);

  const user = useRecoilValue(globalAtom.user);
  const [roomSettings, setRoomSettings] = useRecoilState(globalAtom.roomSettings);
  const [roomInfo, setRoomInfo] = useState({ max: roomSettings.max, cycle: roomSettings.cycle, owner: user.user_id });
  const [categories, setCategory] = useState(roomSettings.category);
  const client = useRecoilValue(globalAtom.client);

  const changeSettings = () => {
    const { max, cycle } = roomInfo;
    socket.emit.SETTING_CHANGE({ roomSetting: { max, cycle } });

    setRoomSettings({ ...roomSettings, category: categories, max: roomInfo.max, cycle: roomInfo.cycle });
    offModal();
  };

  const checkCategory = (e: React.MouseEvent<HTMLDivElement>) => {
    const category = (e.target as HTMLElement).textContent;
    let updateCategory = {};
    let idx = -1;
    categories.map((c, i) => {
      if (c.category === category) {
        idx = i;
        updateCategory = { category: c.category, include: c.include ? false : true };
      }
    });
    const newCategory = categories.slice();
    newCategory.splice(idx, 1, updateCategory);
    setCategory(newCategory);
  };

  const increasePersons = () => {
    if (roomInfo.max < 8) {
      setRoomInfo({ ...roomInfo, max: roomInfo.max + 1 });
    }
  };

  const decreasePersons = () => {
    if (roomInfo.max > 3 && roomInfo.max > client.length) {
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

  return (
    <div id="game-room-settings">
      <div className="game-settings-header">게임 설정</div>
      <div className="create-room-sub-header">제시어 카테고리</div>
      <div className="game-room-category">
        {categories.map((category, i) => {
          return category.include ? (
            <div className="game-room-category-list category-in-list" onClick={checkCategory}>
              {category.category}
            </div>
          ) : (
            <div className="game-room-category-list category-not-in-list" onClick={checkCategory}>
              {category.category}
            </div>
          );
        })}
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
        <button className="create-room-do cr-button" onClick={changeSettings}>
          변경하기
        </button>
        <button className="create-room-cancel cr-button" onClick={offModal}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default GameRoomSettings;
