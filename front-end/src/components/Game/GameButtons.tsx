import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { useRecoilValue } from 'recoil';
import { globalContext } from '../../App';
import globalAtom from '../../recoilStore/globalAtom';

const GameButtons = () => {
  const history = useHistory();
  const { socket } = useContext(globalContext);
  const { selectedRoomTitle } = useRecoilValue(globalAtom.roomData);

  const exit = () => {
    socket.emit('room exit', selectedRoomTitle);
    history.replace('/lobby');
  };

  return (
    <div className="game-header-buttons">
      <button className="game-header-button">게임 설정</button>
      <button className="game-header-button">준비 완료</button>
      <button className="game-header-button">게임 시작</button>
      <div className="game-header-button-exit" onClick={exit} />
    </div>
  );
};

export default React.memo(GameButtons);
