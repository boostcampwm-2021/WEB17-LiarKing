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
import { voteInfo } from '../Game/store';
import GameChatBox from '../Game/GameChatBox';

type $reducerType = actionType & roomInfoType;

const $reducer = (state: any, action: $reducerType) => {
  const { type, max, client, title } = action;
  const clientNumber = client.length;
  const isWaiting: boolean = type === 'waiting';
  const buttons =
    type === 'waiting' &&
    (action.waiting.isOwner ? (
      <GameButtons isOwner={action.waiting.isOwner} roomTitle={title} isAllReady={action.waiting.isAllReady} />
    ) : (
      <GameButtons isOwner={action.waiting.isOwner} roomTitle={title} isReady={action.waiting.isReady} />
    ));

  return (
    <>
      <section className={`game-background ${!isWaiting && 'game-filter'}`}></section>
      <header className="game-header">
        <span className="game-header-logo">Liar Game</span>
        {buttons}
        <span className="game-header-info">
          ({clientNumber} / {max}) {title}
        </span>
      </header>
      <section className="game-persons">
        <GamePersons clients={client} />
        {isWaiting && <GameChatBox clients={client} />}
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
  const [isFixed, setIsFixed] = useState(false);
  let clients: any;

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
      clients = roomInfo.client;
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

    socket.emit('room data', roomData.selectedRoomTitle);

    socket.on('word select', ({ category, roomInfo }: { category: string; roomInfo: roomInfoType }) => {
      console.log('category:', category);

      setAction({ type: 'select', select: { word: category }, ...roomInfo });

      socket.emit('get word', { roomTitle: roomData.selectedRoomTitle });
    });

    socket.on('get word', ({ word, roomInfo }: { word: string; roomInfo: roomInfoType }) => {
      console.log('word:', word);

      setAction({ type: 'select', select: { word }, ...roomInfo });

      if (roomInfo.owner === user.user_id) {
        socket.emit('chat data', { roomTitle: roomData.selectedRoomTitle });
      }
    });

    socket.on('chat data', ({ chat, roomInfo }: { chat: { chatHistory: string[]; speaker: string; timer: number }; roomInfo: roomInfoType }) => {
      setAction({ type: 'chat', chat, ...roomInfo });
    });

    socket.on('on vote', (time: number) => {
      clients.map((client: any) => (client.state = 'vote'));
      if (time === -1) {
        if (!isFixed || voteInfo.voteTo === -1) {
          socket.emit('vote result', { index: -1, name: '기권', roomtitle: roomData.selectedRoomTitle });
        } else {
          socket.emit('vote result', { index: voteInfo.voteTo, name: clients[voteInfo.voteTo].name, roomtitle: roomData.selectedRoomTitle });
        }
      } else if (voteInfo.isFixed === false) {
        setAction({
          type: 'vote',
          vote: { timer: time, setFix: setIsFixed },
          title: '',
          password: '',
          max: 8,
          client: [...clients],
          cycle: 1,
          owner: '',
          state: 'vote',
        });
      }
    });

    socket.on('end vote', (voteResult: string[]) => {
      setAction({
        type: 'result',
        result: { gameResult: true, liar: 'sumin', voteResult: voteResult },
        title: '',
        password: '',
        max: 8,
        client: [...clients],
        cycle: 1,
        owner: '',
        state: 'vote',
      });
    });

    return () => {
      socket.off('room data');
      socket.off('word select');
      socket.off('on vote');
      socket.off('end vote');
    };
  }, [isFixed]);

  useEffect(() => {
    if (!action) return;
    $dispatch(action);
  }, [action]);

  return <div id="game">{$}</div>;
};

export default React.memo(Game);
