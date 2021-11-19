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
import { voteInfo } from '../../utils/store';
import GameChatBox from '../Game/GameChatBox';
import { GAME_MESSAGE, ROOM_MEESSAGE } from '../../utils/socketMsgConstants';

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
  chatHistory: string[];
  speakerData: { speaker: string; timer: number };
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
      socket.emit(ROOM_MEESSAGE.EXIT, roomData.selectedRoomTitle);
    } else if (window.location.pathname === '/game') {
      history.replace('/lobby');
    }
  };

  useEffect(() => {
    if (!user.user_id) getUserData(setUser);

    socket.on(ROOM_MEESSAGE.DATA, ({ roomInfo, tag }: { roomInfo: roomInfoType; tag: string }) => {
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

    socket.emit(ROOM_MEESSAGE.DATA, roomData.selectedRoomTitle);

    socket.on(GAME_MESSAGE.WORD_SELECT, ({ category, roomInfo }: { category: string; roomInfo: roomInfoType }) => {
      setAction({ type: 'select', select: { word: category }, ...roomInfo });

      socket.emit(GAME_MESSAGE.GET_WORD, { roomTitle: roomData.selectedRoomTitle });
    });

    socket.on(GAME_MESSAGE.GET_WORD, ({ word, roomInfo }: { word: string; roomInfo: roomInfoType }) => {
      setAction({ type: 'select', select: { word }, ...roomInfo });

      if (roomInfo.owner === user.user_id) {
        socket.emit(GAME_MESSAGE.CHAT_DATA, { roomTitle: roomData.selectedRoomTitle });
      }
    });

    socket.on(
      GAME_MESSAGE.CHAT_DATA,
      ({ chat, roomInfo }: { chat: { chatHistory: string[]; speaker: string; timer: number }; roomInfo: roomInfoType }) => {
        if (roomInfo.state !== 'chat') return;
        setAction({ type: 'chat', chat, ...roomInfo });
      }
    );

    socket.on(GAME_MESSAGE.ON_VOTE, ({ time, roomInfo }: { time: number; roomInfo: roomInfoType }) => {
      const { client } = roomInfo;

      client.map((client: any) => (client.state = 'vote'));

      if (time === -1) {
        if (!voteInfo.isFixed || voteInfo.voteTo === -1) {
          socket.emit(GAME_MESSAGE.VOTE_RESULT, { index: -1, name: '기권', roomtitle: roomData.selectedRoomTitle });
        } else {
          socket.emit(GAME_MESSAGE.VOTE_RESULT, {
            index: voteInfo.voteTo,
            name: client[voteInfo.voteTo].name,
            roomtitle: roomData.selectedRoomTitle,
          });
        }
      } else {
        setAction({
          type: 'vote',
          vote: { timer: time, setFix: false },
          ...roomInfo,
        });
      }
    });

    socket.on(
      GAME_MESSAGE.END_VOTE,
      ({ gameResult, liarName, voteResult, roomInfo }: { gameResult: boolean; liarName: string; voteResult: string[]; roomInfo: roomInfoType }) => {
        voteInfo.isFixed = false;
        voteInfo.voteTo = -1;
        setAction({
          type: 'result',
          result: { gameResult: gameResult, liar: liarName, voteResult: voteResult },
          ...roomInfo,
        });
      }
    );

    return () => {
      socket.off(ROOM_MEESSAGE.DATA);
      socket.off(GAME_MESSAGE.WORD_SELECT);
      socket.off(GAME_MESSAGE.GET_WORD);
      socket.off(GAME_MESSAGE.CHAT_DATA);
      socket.off(GAME_MESSAGE.ON_VOTE);
      socket.off(GAME_MESSAGE.END_VOTE);
    };
  }, []);

  useEffect(() => {
    if (!action) return;
    $dispatch(action);
  }, [action]);

  return <div id="game">{$}</div>;
};

export default React.memo(Game);
