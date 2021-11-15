import React, { useEffect, useState } from 'react';

export type personType = { id: string; state: string };

const GamePersons = ({ persons }: { persons: personType[] }) => {
  const [person, setPerson] = useState(new Array(8).fill(<div />));

  const getStateComponent = (state: string) => {
    switch (state) {
      case 'ready':
        return <div className="persons-ready">READY!</div>;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    setPerson(
      person.map((v, i) => {
        return (
          <>
            <div className="game-persons-user-character">
              <div className="game-user-id">{persons[i]?.id ?? ''}</div>
              <div className={persons[i] ? 'game-user-character' : ''} />
            </div>
            <div className="game-persons-user-item">{getStateComponent(persons[i]?.state ?? '')}</div>
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
