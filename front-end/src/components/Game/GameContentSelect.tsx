import React from 'react';

const GameContentSelect = ({ word }: { word: { en: string; kr: string } }) => {
  return (
    <div className="game-content-select">
      <div className="game-content-select-imgbox">
        <img src={`/word/${word.en}.svg`} alt={word.en} width="250px" height="250px" />
      </div>
      <div className={`game-content-select-word${word.en === 'liar' ? ' game-liar' : ''} `}>{word.kr}</div>
    </div>
  );
};

export default React.memo(GameContentSelect);
