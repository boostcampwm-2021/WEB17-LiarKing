import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { useRecoilValue } from 'recoil';
import { globalContext } from '../../App';
import globalAtom from '../../recoilStore/globalAtom';

export type GameButtonsPropsType = { isOwner: boolean; gameSetting?: () => void; gameStart?: () => void; gameReady?: () => void };

const GameButtons = (props: GameButtonsPropsType) => {
  const { isOwner } = props;
  const history = useHistory();
  const { socket } = useContext(globalContext);
  const { selectedRoomTitle } = useRecoilValue(globalAtom.roomData);

  const exit = () => {
    socket.emit('room exit', selectedRoomTitle);
    history.replace('/lobby');
  };

  return (
    <div className="game-header-buttons">
      {isOwner && (
        <button className="game-header-button" onClick={props.gameSetting}>
          게임 설정
        </button>
      )}
      {isOwner && (
        <button className="game-header-button" onClick={props.gameStart}>
          게임 시작
        </button>
      )}
      {!isOwner && (
        <button className="game-header-button" onClick={props.gameReady}>
          준비 완료
        </button>
      )}
      <div className="game-header-button-exit" onClick={exit} />
    </div>
  );
};

export default React.memo(GameButtons);
