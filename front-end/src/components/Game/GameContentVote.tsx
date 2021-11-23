import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { globalContext } from '../../App';
import globalAtom from '../../recoilStore/globalAtom';
import { socketUtilType } from '../../utils/socketUtil';
import { voteInfo } from '../../utils/store';

const GameContentVote = () => {
  const SECONDS = 1000;

  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const [timerData, setTimerData]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(null);
  const [isFixed, setFixed] = useState(false);
  const vote = useRecoilValue(globalAtom.vote);

  const timer = useRef<HTMLSpanElement>();

  useEffect(() => {
    socket.on.VOTE_TIMER_DATA({ setState: setTimerData });

    return () => {
      socket.off.VOTE_TIMER_DATA();
    };
  }, []);

  useEffect(() => {
    socket.on.END_VOTE({ voteData: voteInfo });
    return () => {
      socket.off.END_VOTE();
    };
  }, [vote]);

  useEffect(() => {
    if (!timer) return;

    let time: number = timerData;

    timer.current.innerText = `남은시간: ${time}초`;

    const activeTimer = setInterval(() => {
      if (time <= 0) clearInterval(activeTimer);
      else time--;

      timer.current.innerText = `남은시간: ${time}초`;
    }, SECONDS);

    return () => {
      clearInterval(activeTimer);
      Object.assign(voteInfo, { voteTo: -1, name: '기권', isFixed: false });
    };
  }, [timerData]);

  return (
    <div className="game-content-box">
      <span className="game-content-title game-content-title-vote">라이어를 투표하세요!</span>
      <span className="game-content-ment" ref={timer}></span>
      <div
        className="game-content-vote-submit"
        onClick={() => {
          voteInfo.isFixed = true;
          setFixed(true);
        }}
      >
        {isFixed ? '잠시만 기다려주세요' : vote ? '투표하기' : '기권하기'}
      </div>
    </div>
  );
};

export default GameContentVote;
