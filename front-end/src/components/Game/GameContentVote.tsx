import React, { useState } from 'react';
import { voteInfo } from '../../utils/store';

const GameContentVote = ({ timer }: { timer: number }) => {
  const [isFixed, setFixed] = useState(false);

  return (
    <div className="game-content-box">
      <span className="game-content-title game-content-title-vote">라이어를 투표하세요!</span>
      <span className="game-content-ment">남은시간: {timer}초</span>
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

export default React.memo(GameContentVote);
