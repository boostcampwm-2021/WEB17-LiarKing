import React, { useContext, useEffect, useRef, useState } from 'react';
import { globalContext } from '../../App';
import { socketUtilType } from '../../utils/socketUtil';
import { voteInfo } from './store';

const GameContentVote = () => {
  const SECONDS = 1000;

  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const [timerData, setTimerData]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(null);
  const [isFixed, setFixed] = useState(false);

  const timer = useRef<HTMLSpanElement>();

  useEffect(() => {
    socket.on.VOTE_TIMER_DATA({ setState: setTimerData });

    return () => {
      socket.off.VOTE_TIMER_DATA();
    };
  }, []);

  useEffect(() => {
    let time = timerData;

    const activeTimer = setInterval(() => {
      timer.current.innerText = `남은시간: ${time}초`;

      if (time <= 0) clearInterval(activeTimer);
      else time--;
    }, SECONDS);

    return () => {
      clearInterval(activeTimer);
    };
  }, [timerData]);

  return (
    <div className="game-content-box">
      <span className="game-content-title game-content-title-vote">라이어를 투표하세요!</span>
      <span className="game-content-ment" ref={timer}>
        남은시간: 0초
      </span>
      <div
        className="game-content-vote-submit"
        onClick={() => {
          voteInfo.isFixed = true;
          setFixed(true);
        }}
      >
        {isFixed ? '잠시만 기다려주세요' : voteInfo.voteTo === -1 ? '기권하기' : '투표하기'}
      </div>
    </div>
  );
};

export default GameContentVote;
