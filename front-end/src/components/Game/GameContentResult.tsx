import React, { useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import { globalContext } from '../../App';
import { socketUtilType } from '../../utils/socketUtil';

const CONSTANTS = {
  UNRANKED: 'unranked',
  ADD_TWENTY: '20점 추가',
  ADD_TEN: '10점 추가',
  SUBTRACT_TEN: '10점 차감',
};

const GameContentResult = () => {
  type resultType = { results: string[]; totalResult: string; liar?: string; liarWins?: boolean };

  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const user = useRecoilValue(globalAtom.user);
  const [pointComment, setPointComment] = useState(CONSTANTS.ADD_TEN);
  const [fetchLock, setFetchLock] = useState(true);
  const [resultData, setResultData]: [resultType, React.Dispatch<React.SetStateAction<resultType>>] = useState({
    results: [],
    totalResult: '',
  });
  let sendPoint = pointComment;

  const requestToServer = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user.user_id,
        point: sendPoint,
      }),
    };
    await fetch('/api/users/updatePoint', options);
  };

  useEffect(() => {
    socket.on.RESULT_DATA({ setState: setResultData });
    return () => {
      socket.off.RESULT_DATA();
    };
  }, []);

  useEffect(() => {
    if (user.user_id === resultData.liar) {
      sendPoint = resultData.liarWins ? CONSTANTS.ADD_TWENTY : CONSTANTS.SUBTRACT_TEN;
      setPointComment(sendPoint);
    } else {
      sendPoint = resultData.liarWins ? CONSTANTS.SUBTRACT_TEN : CONSTANTS.ADD_TEN;
      setPointComment(sendPoint);
    }
    if (resultData.liar && user.rank !== CONSTANTS.UNRANKED && !fetchLock) requestToServer();
    setFetchLock(false);
  }, [resultData]);

  return (
    <div className="game-content-box">
      <span className="game-content-title">{resultData.liar ? '게임 결과' : '투표 결과'}</span>
      <div className="game-content-ment-box">
        {resultData.results.map((v, i) => (
          <span className="game-content-ment" key={i}>
            {v}
          </span>
        ))}
        <span className="game-content-ment">
          <br />
          {resultData.totalResult}
          <br />
          {resultData.liar ? (user.rank === CONSTANTS.UNRANKED ? '' : user.user_id + '님 점수에서 ' + pointComment + '됩니다.') : ''}
        </span>
      </div>
    </div>
  );
};

export default GameContentResult;
