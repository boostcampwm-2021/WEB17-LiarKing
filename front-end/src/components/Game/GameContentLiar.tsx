import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { globalContext } from '../../App';
import globalAtom from '../../recoilStore/globalAtom';
import { socketUtilType } from '../../utils/socketUtil';

const GameContentLiar = () => {
  type liarType = { category: string[]; answer: number; liar: string };

  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const user = useRecoilValue(globalAtom.user);
  const [liarData, setLiarData]: [liarType, React.Dispatch<React.SetStateAction<liarType>>] = useState({ answer: -1, category: [''], liar: '' });

  const success = useCallback(() => {
    if (user.user_id !== liarData.liar) return;
    socket.emit.LIAR_DATA({ liarResult: { isAnswer: true } });
  }, [liarData]);

  const fail = useCallback(() => {
    if (user.user_id !== liarData.liar) return;
    socket.emit.LIAR_DATA({ liarResult: { isAnswer: false } });
  }, [liarData]);

  const setCategory = useMemo(() => {
    if (!liarData) return;

    return liarData.category.map((v, i) => {
      const obj: { category: string; fn(): void } = { category: v, fn: null };

      if (i === liarData.answer) obj.fn = success;
      else obj.fn = fail;

      return obj;
    });
  }, [liarData]);

  useEffect(() => {
    socket.on.LIAR_DATA({ setState: setLiarData });

    return () => {
      socket.off.LIAR_DATA();
    };
  }, []);

  return (
    <>
      {setCategory ? (
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
      ) : (
        <></>
      )}
    </>
  );
};

export default React.memo(GameContentLiar);
