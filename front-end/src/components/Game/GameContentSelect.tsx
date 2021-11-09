import React from 'react';

const GameContentSelect = ({ select }: { select: { wordEN: string; wordKR: string } }) => {
  return (
    <div className="game-content-select">
      <div className="game-content-select-imgbox">
        <img src={`/word/${select.wordEN}.svg`} alt={select.wordEN} width="250px" height="250px" />
      </div>
      <div className={`game-content-select-word${select.wordEN === 'liar' ? ' game-liar' : ''} `}>{select.wordKR}</div>
    </div>
  );
};

export default React.memo(GameContentSelect);
