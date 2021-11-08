import React from 'react';

const GameButtons = () => {
  return (
    <div className="game-header-buttons">
      <button className="game-header-button">게임 설정</button>
      <button className="game-header-button">준비 완료</button>
      <button className="game-header-button">게임 시작</button>
      <div className="game-header-button-exit" />
    </div>
  );
};

export default React.memo(GameButtons);
