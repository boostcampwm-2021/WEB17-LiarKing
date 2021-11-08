import React, { useEffect, useState } from 'react';

type personType = { id: string; item?: string; etc?: any };

const GamePersons = ({ persons }: { persons: personType[] }) => {
  const [person, setPerson] = useState(new Array(8).fill(<div />));

  useEffect(() => {
    setPerson(
      person.map((v, i) => {
        return (
          <>
            <div className="game-persons-user-character">
              <div className="game-user-id">{persons[i]?.id ?? ''}</div>
              <div className={persons[i] ? 'game-user-character' : ''} />
            </div>
            <div className="game-persons-user-item">{persons[i]?.item ?? ''}</div>
          </>
        );
      })
    );
  }, [persons]);

  return (
    <>
      <div className="game-persons-left">
        {person
          .filter((v, i) => i < 4)
          .map((v, i) => (
            <div className="game-persons-user game-persons-user-left" key={i}>
              {v}
            </div>
          ))}
      </div>
      <div className="game-persons-right">
        {person
          .filter((v, i) => i >= 4)
          .map((v, i) => (
            <div className="game-persons-user game-persons-user-right" key={i}>
              {v}
            </div>
          ))}
      </div>
    </>
  );
};

export default React.memo(GamePersons);
