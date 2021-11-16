import '../../styles/Game.css';
import React, { useEffect, useReducer, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import GameButtons from '../Game/GameButtons';
import GamePersons from '../Game/GamePersons';
import GameContent, { actionType } from '../Game/GameContent';
import { globalContext } from '../../App';
import { Socket } from 'socket.io-client';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import { getUserData } from '../../utils/getDataUtil';

type $reducerType = actionType & roomInfoType;

const $reducer = (state: any, action: $reducerType) => {
  const { type, client, max, title } = action;
  const clientNumber = client.length;
  const bgFilter: boolean = type !== 'waiting';
  const buttons =
    type === 'waiting' &&
    (action.waiting.isOwner ? (
      <GameButtons isOwner={action.waiting.isOwner} roomTitle={title} isAllReady={action.waiting.isAllReady} />
    ) : (
      <GameButtons isOwner={action.waiting.isOwner} roomTitle={title} isReady={action.waiting.isReady} />
    ));

  return (
    <>
      <section className={`game-background ${bgFilter && 'game-filter'}`}></section>
      <header className="game-header">
        <span className="game-header-logo">Liar Game</span>
        {buttons}
        <span className="game-header-info">
          ({clientNumber} / {max}) {title}
        </span>
      </header>
      <section className="game-persons">
        <GamePersons clients={client} />
      </section>
      <section className="game-content">
        <GameContent action={action} />
      </section>
    </>
  );
};

export type roomInfoType = {
  title: string;
  password: string;
  max: number;
  client: { socketId: string; name: string; state: string }[];
  cycle: number;
  owner: string;
  state: string;
} | null;

const Game = () => {
  const history = useHistory();
  const { socket }: { socket: Socket } = useContext(globalContext);
  const roomData = useRecoilValue(globalAtom.roomData);
  const [user, setUser] = useRecoilState(globalAtom.user);
  const [action, setAction]: [actionType & roomInfoType, React.Dispatch<React.SetStateAction<actionType & roomInfoType>>] = useState(null);
  const [$, $dispatch] = useReducer($reducer, <></>);

  window.onpopstate = () => {
    if (window.location.pathname === '/lobby') {
      socket.emit('room exit', roomData.selectedRoomTitle);
    } else if (window.location.pathname === '/game') {
      history.replace('/lobby');
    }
  };

  useEffect(() => {
    if (!user.user_id) getUserData(setUser);

    socket.on('room data', ({ roomInfo, tag }: { roomInfo: roomInfoType; tag: string }) => {
      console.log('tag:', tag);
      console.log('roomInfo:', roomInfo);

      const { owner, client, title } = roomInfo;

      const waiting = {
        isOwner: owner === user.user_id,
        roomTitle: title,
        maxPerson: roomInfo.max,
      };

      Object.assign(
        waiting,
        waiting.isOwner
          ? { isAllReady: client.filter((v) => v.state === 'ready').length === client.length - 1 }
          : { isReady: client.find((v) => v.name === user.user_id)?.state === 'ready' }
      );

      const actionData: actionType = { type: 'waiting', waiting };

      setAction(Object.assign(actionData, roomInfo));
    });

    socket.on('word data', ({ category }: { category: string }) => {
      console.log('category:', category);
    });

    socket.emit('room data', roomData.selectedRoomTitle);

    return () => {
      socket.off('room data');
      socket.off('word data');
    };
  }, []);

  useEffect(() => {
    if (!action) return;
    $dispatch(action);
  }, [action]);

  return <div id="game">{$}</div>;
};

export default React.memo(Game);
