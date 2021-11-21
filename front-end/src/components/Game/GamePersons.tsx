import React, { useContext, useEffect, useMemo, useState } from 'react';
import { voteInfo } from './store';
import voteBox from '../../images/voteBox.svg';
import { socketUtilType } from '../../utils/socketUtil';
import { globalContext } from '../../App';

export type clientType = { name: string; state: string; socketId: string };

const GamePersonsElement = ({ clients }: { clients: clientType[] }) => {
  const [selectedPerson, setVotePerson] = useState(-1);

  const getStateComponent = (state: string, idx: number) => {
    switch (state) {
      case 'ready':
        return <div className="persons-ready">READY!</div>;
      case 'vote':
        return (
          <img
            className={idx === voteInfo.voteTo ? 'vote-box-select' : 'vote-box'}
            src={clients[idx]?.state === 'vote' ? voteBox : ''}
            onClick={() => {
              if (idx !== voteInfo.voteTo && !voteInfo.isFixed) {
                voteInfo.voteTo = idx;
                setVotePerson(idx);
              } else if (!voteInfo.isFixed) {
                voteInfo.voteTo = -1;
                setVotePerson(-1);
              }
            }}
          />
        );
      default:
        return <></>;
    }
  };

  const element = useMemo(() => {
    return clients.map((v, i) => {
      return (
        <>
          <div className="game-persons-user-character">
            <div className="game-user-id">{v.name ?? ''}</div>
            <div className={v.name ? 'game-user-character' : ''} />
          </div>
          <div className="game-persons-user-item">{getStateComponent(v.state ?? '', i)}</div>
        </>
      );
    });
  }, [clients, selectedPerson]);

  return (
    <>
      <div className="game-persons-left">
        {element
          .filter((v, i) => i < 4)
          .map((v, i) => (
            <div className="game-persons-user game-persons-user-left" key={i}>
              {v}
            </div>
          ))}
      </div>
      {/* {<GameTalk clients={clients}></GameTalk>} */}
      <div className="game-persons-right">
        {element
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

const GamePersons = () => {
  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const [clients, setClients]: [clientType[], React.Dispatch<React.SetStateAction<clientType[]>>] = useState(null);

  useEffect(() => {
    socket.on.ROOM_CLIENTS_INFO({ setState: setClients });

    return () => {
      socket.off.ROOM_CLIENTS_INFO();
    };
  }, [clients]);

  useEffect(() => {
    socket.emit.ROOM_CLIENTS_INFO();
  }, []);

  return <>{!!clients ? <GamePersonsElement clients={clients} /> : <></>}</>;
};

export default GamePersons;
