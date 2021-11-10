import React from 'react';

const GameContentVote = ({ timer }: { timer: number }) => {
  return (
    <div className="game-content-box">
      <span className="game-content-title game-content-title-vote">라이어를 투표하세요!</span>
      <span className="game-content-ment">남은시간: {timer}초</span>
    </div>
  );
};

export default React.memo(GameContentVote);
