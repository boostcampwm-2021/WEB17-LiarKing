import React from 'react';
import { voteInfo } from './store';

const SendVoteResult = (setFix: any) => {
  voteInfo.isFixed = true;
  setFix(true);
};

const GameContentVote = ({ timer, setFix }: { timer: number; setFix: any }) => {
  return (
    <div className="game-content-box">
      <span className="game-content-title game-content-title-vote">라이어를 투표하세요!</span>
      <span className="game-content-ment">남은시간: {timer}초</span>
      <div
        className="game-content-vote-submit"
        onClick={() => {
          SendVoteResult(setFix);
        }}
      >
        투표하기
      </div>
    </div>
  );
};

export default React.memo(GameContentVote);
