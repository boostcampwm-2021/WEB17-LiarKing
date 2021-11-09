import React from 'react';

const GameContentLiar = ({ liar }: { liar: { category: string[]; answer: number; success(): void; fail(): void } }) => {
  const { category, answer, success, fail } = liar;

  const setCategory = category.map((v, i) => {
    const obj: { category: string; fn(): void } = { category: v, fn: null };

    if (i === answer) obj.fn = success;
    else obj.fn = fail;

    return obj;
  });

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
