import '../../styles/Game.css';
import React, { useEffect, useReducer, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import GameButtons, { GameButtonsPropsType } from '../Game/GameButtons';
import GamePersons from '../Game/GamePersons';
import GameContent, { actionType } from '../Game/GameContent';
import { globalContext } from '../../App';
import { Socket } from 'socket.io-client';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import { getUserData } from '../../utils/getDataUtil';

type $reducerType = actionType;
type gameRoomType = roomInfoType & GameButtonsPropsType;

const $reducer = (state: any, action: $reducerType & gameRoomType) => {
  const { type, max, client, title, isOwner, roomTitle } = action;
  const clientNumber = client.length;

  const bgFilter: boolean = type !== 'waiting';
  const contentAction = Object.assign({ type }, action);

  return (
    <>
      <section className={`game-background ${bgFilter && 'game-filter'}`}></section>
      <header className="game-header">
        <span className="game-header-logo">Liar Game</span>
        {!bgFilter && isOwner && <GameButtons isOwner={isOwner} roomTitle={roomTitle} isAllReady={action.isAllReady} />}
        {!bgFilter && !isOwner && <GameButtons isOwner={isOwner} roomTitle={roomTitle} isReady={action.isReady} />}
        <span className="game-header-info">
          ({clientNumber} / {max}) {title}
        </span>
      </header>
      <section className="game-persons">
        <GamePersons clients={client} />
      </section>
      <section className="game-content">
        <GameContent action={contentAction} />
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
} | null;

const Game = () => {
  const history = useHistory();
  const { socket }: { socket: Socket } = useContext(globalContext);
  const roomData = useRecoilValue(globalAtom.roomData);
  const [user, setUser] = useRecoilState(globalAtom.user);
  const [roomInfo, setRoomInfo]: [roomInfoType, React.Dispatch<React.SetStateAction<roomInfoType>>] = useState(null);
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

      setRoomInfo(roomInfo);
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
    if (!roomInfo) return;

    const { owner, client, title } = roomInfo;

    const GameButtonsProps = {
      isOwner: owner === user.user_id,
      roomTitle: title,
    };

    Object.assign(
      GameButtonsProps,
      GameButtonsProps.isOwner
        ? { isAllReady: client.filter((v) => v.state === 'ready').length === client.length - 1 }
        : { isReady: client.find((v) => v.name === user.user_id).state === 'ready' }
    );

    $dispatch({ type: 'waiting', ...roomInfo, ...GameButtonsProps });
  }, [roomInfo]);

  // const click = {
  //   waiting: () => {
  //     $dispatch({
  //       type: 'waiting',
  //       persons,
  //     });
  //   },
  //   selectApple: () => {
  //     $dispatch({
  //       type: 'select',
  //       persons,
  //       select: { word: '사과' },
  //     });
  //   },
  //   selectLiar: () => {
  //     $dispatch({
  //       type: 'select',
  //       persons,
  //       select: { word: '라이어' },
  //     });
  //   },
  //   chat: () => {
  //     $dispatch({
  //       type: 'chat',
  //       persons,
  //       chat: {
  //         chatHistory: [
  //           'dunde: 안녕하세요.',
  //           'kskim625: 반갑습니다.',
  //           'sumin: ㅎㅇ',
  //           'hanbin: ㅎㅇㅎㅇ',
  //           'dunde: 안녕하세요.',
  //           'kskim625: 반갑습니다.',
  //           'sumin: ㅎㅇ',
  //           'hanbin: ㅎㅇㅎㅇ',
  //         ],
  //         speaker: 'sumin',
  //         timer: 20,
  //       },
  //     });
  //   },
  //   vote: () => {
  //     $dispatch({
  //       type: 'vote',
  //       persons,
  //       vote: { timer: 3 },
  //     });
  //   },
  //   resultSuccess: () => {
  //     $dispatch({
  //       type: 'result',
  //       persons,
  //       result: { gameResult: true, liar: 'sumin', voteResult: ['dunde 1표', 'kskim625 2표', 'sumin 5표'] },
  //     });
  //   },
  //   resultFail: () => {
  //     $dispatch({
  //       type: 'result',
  //       persons,
  //       result: { gameResult: false, liar: 'sumin', voteResult: ['dunde 1표', 'kskim625 5표', 'sumin 1표'] },
  //     });
  //   },
  //   liar: () => {
  //     $dispatch({
  //       type: 'liar',
  //       persons,
  //       liar: {
  //         answer: 1,
  //         category: [
  //           '사과',
  //           '딸기',
  //           '바나나',
  //           '포도',
  //           '수박',
  //           '멜론',
  //           '샤인머스캣',
  //           '배',
  //           '두리안',
  //           '초콜릿',
  //           '방어',
  //           '우럭',
  //           '누룽지',
  //           '멀티버스',
  //           '닥터스트레인지',
  //         ],
  //         fail: () => console.log('실패한!'),
  //         success: () => console.log('성공!'),
  //       },
  //     });
  //   },
  // };

  return <div id="game">{$}</div>;
};

export default React.memo(Game);
