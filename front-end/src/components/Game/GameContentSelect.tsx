import React from 'react';

const GameContentSelect = ({ select }: { select: { word: string } }) => {
  return (
    <div className="game-content-select">
      <div className="game-content-select-imgbox">
        <img src={`https://kr.object.ncloudstorage.com/liargame/images/${select.word}.svg`} alt={select.word} width="250px" height="250px" />
      </div>
      <div className={`game-content-select-word${select.word === '라이어' ? ' game-liar' : ''} `}>{select.word}</div>
    </div>
  );
};

export default React.memo(GameContentSelect);
