import React, { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../App';
import { socketUtilType } from '../../utils/socketUtil';
import questionMark from '../../images/questionMark.svg';

const GameContentSelect = () => {
  const [select, setSelect] = useState({ word: '' });
  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  socket.on.SELECT_DATA({ setState: setSelect });

  useEffect(() => {
    socket.on.REQUEST_SELECT_DATA();

    return () => {
      socket.off.SELECT_DATA();
      socket.off.REQUEST_SELECT_DATA();
    };
  }, []);

  useEffect(() => {
    socket.on.SELECT_DATA({ setState: setSelect });
  }, [select]);

  return (
    <div className="game-content-select">
      <div className="game-content-select-imgbox">
        <img
          className="game-content-select-image"
          src={select.word === '' ? questionMark : `https://kr.object.ncloudstorage.com/liargame/images/${select.word}.svg`}
          alt={select.word}
        />
      </div>
      <div className={`game-content-select-word${select.word === '라이어' ? ' game-liar' : ''} `}>{select.word}</div>
    </div>
  );
};

export default React.memo(GameContentSelect);
