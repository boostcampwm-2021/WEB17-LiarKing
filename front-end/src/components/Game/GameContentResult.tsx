import React, { useContext, useEffect, useState } from 'react';
import { globalContext } from '../../App';
import { socketUtilType } from '../../utils/socketUtil';

const GameContentResult = () => {
  type resultType = { results: string[]; totalResult: string };

  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const [resultData, setResultData]: [resultType, React.Dispatch<React.SetStateAction<resultType>>] = useState({ results: [''], totalResult: '' });
  const { results, totalResult } = resultData;

  useEffect(() => {
    socket.on.RESULT_DATA({ setState: setResultData });

    return () => {
      socket.off.RESULT_DATA();
    };
  }, []);

  return (
    <div className="game-content-box">
      <span className="game-content-title">투표 결과</span>
      <div className="game-content-ment-box">
        {results.map((v, i) => (
          <span className="game-content-ment" key={i}>
            {v}
          </span>
        ))}
        <span className="game-content-ment">
          <br />
          {totalResult}
        </span>
      </div>
    </div>
  );
};

export default GameContentResult;
