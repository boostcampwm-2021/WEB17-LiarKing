import React, { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../App';
import { socketUtilType } from '../../utils/socketUtil';

const GameContentLiar = () => {
  type liarType = { category: string[]; answer: number };

  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const [liarData, setLiarData]: [liarType, React.Dispatch<React.SetStateAction<liarType>>] = useState(null);
  const { category, answer } = liarData;

  const success = () => {
    console.log('success!');
  };

  const fail = () => {
    console.log('fail!');
  };

  const setCategory = category.map((v, i) => {
    const obj: { category: string; fn(): void } = { category: v, fn: null };

    if (i === answer) obj.fn = success;
    else obj.fn = fail;

    return obj;
  });

  useEffect(() => {
    socket.on.LIAR_DATA({ setState: setLiarData });

    return () => {
      socket.off.LIAR_DATA();
    };
  }, []);

  return (
    <div className="game-content-box">
      <div className="game-content-title">라이어는 정답을 선택하세요.</div>
      <div className="game-content-liar-row">
        {setCategory
          .filter((v, i) => i < 5)
          .map((v, i) => (
            <button className="game-content-liar-button" onClick={v.fn} key={i}>
              {v.category}
            </button>
          ))}
      </div>
      <div className="game-content-liar-row">
        {setCategory
          .filter((v, i) => i >= 5 && i < 10)
          .map((v, i) => (
            <button className="game-content-liar-button" onClick={v.fn} key={i}>
              {v.category}
            </button>
          ))}
      </div>
      <div className="game-content-liar-row">
        {setCategory
          .filter((v, i) => i >= 10)
          .map((v, i) => (
            <button className="game-content-liar-button" onClick={v.fn} key={i}>
              {v.category}
            </button>
          ))}
      </div>
    </div>
  );
};

export default React.memo(GameContentLiar);
