import React from 'react';

const GameContentResult = ({ result }: { result: { voteResult: string[]; liar: string; gameResult: boolean } }) => {
  const { voteResult, liar, gameResult } = result;

  return (
    <div className="game-content-box">
      <span className="game-content-title">투표 결과</span>
      <div className="game-content-ment-box">
        {voteResult.map((v, i) => (
          <span className="game-content-ment" key={i}>
            {v}
          </span>
        ))}
        <span className="game-content-ment">
          <br />
          라이어는 {liar} 입니다. {gameResult ? '시민이 라이어 검거에 성공했습니다!' : '시민이 라이어 검거에 실패하였습니다!'}
        </span>
      </div>
    </div>
  );
};

export default React.memo(GameContentResult);
