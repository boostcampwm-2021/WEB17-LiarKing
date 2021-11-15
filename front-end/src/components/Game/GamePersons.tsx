import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';

type personType = { id: string; item?: string; etc?: any };

const GamePersons = ({ persons, setVoteUser }: { persons: personType[]; setVoteUser: any }) => {
  const [selectedPerson, setVotePerson] = useState(-1);
  const [person, setPerson] = useState(new Array(8).fill(<div />));
  const [voteTo, setVoteTo] = useRecoilState(globalAtom.voteUser);

  useEffect(() => {
    setPerson(
      person.map((v, i) => {
        return (
          <>
            <div className="game-persons-user-character">
              <div className="game-user-id">{persons[i]?.id ?? ''}</div>
              <div className={persons[i] ? 'game-user-character' : ''} />
            </div>
            <div className="game-persons-user-item">
              <img
                className={i === selectedPerson ? 'vote-box-select' : 'vote-box'}
                src={persons[i]?.item ?? ''}
                onClick={() => {
                  console.log(i);
                  setVoteTo(i);
                  setVoteUser(i);
                  setVotePerson(i);
                }}
              />
            </div>
          </>
        );
      })
    );
  }, [persons, selectedPerson]);

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
