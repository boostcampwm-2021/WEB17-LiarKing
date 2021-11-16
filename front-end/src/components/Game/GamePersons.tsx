import React, { useEffect, useState } from 'react';
import GameChatBox from './GameChatBox';

export type clientType = { name: string; state: string };

const GamePersons = ({ clients }: { clients: clientType[] }) => {
  const [client, setClient] = useState(new Array(8).fill(<div />));

  const getStateComponent = (state: string) => {
    switch (state) {
      case 'ready':
        return <div className="persons-ready">READY!</div>;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    setClient(
      client.map((v, i) => {
        return (
          <>
            <div className="game-persons-user-character">
              <div className="game-user-id">{clients[i]?.name ?? ''}</div>
              <div className={clients[i] ? 'game-user-character' : ''} />
            </div>
            <div className="game-persons-user-item">{getStateComponent(clients[i]?.state ?? '')}</div>
          </>
        );
      })
    );
  }, [clients]);

  return (
    <>
      <div className="game-persons-left">
        {client
          .filter((v, i) => i < 4)
          .map((v, i) => (
            <div className="game-persons-user game-persons-user-left" key={i}>
              {v}
            </div>
          ))}
      </div>
      <div className="game-persons-right">
        {client
          .filter((v, i) => i >= 4)
          .map((v, i) => (
            <div className="game-persons-user game-persons-user-right" key={i}>
              {v}
            </div>
          ))}
      </div>
      <GameChatBox clients={clients} />
    </>
  );
};

export default React.memo(GamePersons);
