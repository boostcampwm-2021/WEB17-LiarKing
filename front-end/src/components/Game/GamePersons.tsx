import React, { useContext, useEffect, useMemo, useState } from 'react';
import { voteInfo } from '../../utils/store';
import GameTalk from './GameTalk';
import voteBox from '../../images/voteBox.svg';
import { socketUtilType } from '../../utils/socketUtil';
import { globalContext } from '../../App';
import { useSetRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';

export type clientType = { name: string; state: string; socketId: string };

const GamePersonsElement = ({ clients }: { clients: clientType[] }) => {
  const COLORS = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'navy', 'purple'];
  const [selectedPerson, setVotePerson] = useState(-1);
  const setVote = useSetRecoilState(globalAtom.vote);

  const getStateComponent = (state: string, idx: number) => {
    switch (state) {
      case 'ready':
        return <div className="persons-ready">READY!</div>;
      case 'vote':
        return (
          <img
            className={idx === voteInfo.voteTo ? 'vote-box-select' : 'vote-box'}
            src={voteBox}
            onClick={() => {
              if (idx !== voteInfo.voteTo && !voteInfo.isFixed) {
                voteInfo.voteTo = idx;
                voteInfo.name = clients[idx].name;
                setVote(true);
                setVotePerson(idx);
              } else if (!voteInfo.isFixed) {
                voteInfo.voteTo = -1;
                voteInfo.name = '기권';
                setVote(false);
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
          <div className={v.name ? 'game-persons-user-character' : 'game-persons-user-character-hidden'}>
            <div className={'game-user-id game-user-' + COLORS[i]}>{v.name ?? ''}</div>
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
      <GameTalk></GameTalk>
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
  const [clients, setClients]: [clientType[], React.Dispatch<React.SetStateAction<clientType[]>>] = useState([]);
  const setRecoilClients = useSetRecoilState(globalAtom.client);

  useEffect(() => {
    socket.on.ROOM_CLIENTS_INFO({ setState: setClients });
    setRecoilClients(
      clients.filter((client) => {
        return client.name !== null;
      })
    );

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
