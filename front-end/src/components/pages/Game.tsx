import '../../styles/Game.css';
import React, { useEffect, useReducer, useContext } from 'react';
import { useHistory } from 'react-router';
import GameButtons from '../Game/GameButtons';
import GamePersons from '../Game/GamePersons';
import GameContent from '../Game/GameContent';
import { globalContext } from '../../App';
import { Socket } from 'socket.io-client';
import { useRecoilState, useRecoilValue } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import { getUserData } from '../../utils/getDataUtil';

//임시 데이터
const persons = [
  { id: 'kskim625', item: '버튼' },
  { id: 'dunde', item: '버튼' },
  { id: 'sumin', item: '버튼' },
  { id: 'hanbin', item: '버튼' },
];

type personType = { id: string; item?: string };
type $reducerType = {
  type: string;
  persons: Array<personType>;
  select?: { word: string };
  chat?: { chatHistory: string[]; speaker: string; timer: number };
  vote?: { timer: number };
  result?: { voteResult: string[]; liar: string; gameResult: boolean };
  liar?: { category: string[]; answer: number; success(): void; fail(): void };
};

const $reducer = (state: any, action: $reducerType) => {
  const { type, persons } = action;
  const bgFilter: boolean = type !== 'waiting';
  const contentAction = Object.assign({ type }, { ...action });

  return (
    <>
      <section className={`game-background ${bgFilter && 'game-filter'}`}></section>
      <header className="game-header">
        <span className="game-header-logo">Liar Game</span>
        {!bgFilter && <GameButtons />}
        <span className="game-header-info">(6 / 8) kskim625의 방</span>
      </header>
      <section className="game-persons">
        <GamePersons persons={persons} />
      </section>
      <section className="game-content">
        <GameContent action={contentAction} />
      </section>
    </>
  );
};

const Game = () => {
  const history = useHistory();
  const { socket }: { socket: Socket } = useContext(globalContext);
  const roomData = useRecoilValue(globalAtom.roomData);
  const [user, setUser] = useRecoilState(globalAtom.user);
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

    socket.on(
      'room data',
      (roomInfo: { title: string; password: string; max: number; client: { socketId: string; name: string }[]; cycle: number }) => {
        const persons = roomInfo.client.map((v) => {
          return { id: v.name };
        });

        $dispatch({ type: 'waiting', persons });
        console.log('누군가 입장했습니다', roomInfo);
      }
    );

    socket.emit('room data', roomData.selectedRoomTitle);

    socket.on(
      'room exit',
      (roomInfo: { title: string; password: string; max: number; client: { socketId: string; name: string }[]; cycle: number }) => {
        const persons = roomInfo.client.map((v) => {
          return { id: v.name };
        });

        $dispatch({ type: 'waiting', persons });
        console.log('누군가 방에서 나갔습니다', roomInfo);
      }
    );

    socket.on(
      'user disconnected',
      (roomInfo: { title: string; password: string; max: number; client: { socketId: string; name: string }[]; cycle: number }) => {
        const persons = roomInfo.client.map((v) => {
          return { id: v.name };
        });

        $dispatch({ type: 'waiting', persons });
        console.log('누군가 방에서 팅겼습니다', roomInfo);
      }
    );

    return () => {
      socket.off('room data');
      socket.off('room exit');
      socket.off('user disconnected');
    };
  }, []);

  const click = {
    waiting: () => {
      $dispatch({
        type: 'waiting',
        persons,
      });
    },
    selectApple: () => {
      $dispatch({
        type: 'select',
        persons,
        select: { word: '사과' },
      });
    },
    selectLiar: () => {
      $dispatch({
        type: 'select',
        persons,
        select: { word: '라이어' },
      });
    },
    chat: () => {
      $dispatch({
        type: 'chat',
        persons,
        chat: {
          chatHistory: [
            'dunde: 안녕하세요.',
            'kskim625: 반갑습니다.',
            'sumin: ㅎㅇ',
            'hanbin: ㅎㅇㅎㅇ',
            'dunde: 안녕하세요.',
            'kskim625: 반갑습니다.',
            'sumin: ㅎㅇ',
            'hanbin: ㅎㅇㅎㅇ',
          ],
          speaker: 'sumin',
          timer: 20,
        },
      });
    },
    vote: () => {
      $dispatch({
        type: 'vote',
        persons,
        vote: { timer: 3 },
      });
    },
    resultSuccess: () => {
      $dispatch({
        type: 'result',
        persons,
        result: { gameResult: true, liar: 'sumin', voteResult: ['dunde 1표', 'kskim625 2표', 'sumin 5표'] },
      });
    },
    resultFail: () => {
      $dispatch({
        type: 'result',
        persons,
        result: { gameResult: false, liar: 'sumin', voteResult: ['dunde 1표', 'kskim625 5표', 'sumin 1표'] },
      });
    },
    liar: () => {
      $dispatch({
        type: 'liar',
        persons,
        liar: {
          answer: 1,
          category: [
            '사과',
            '딸기',
            '바나나',
            '포도',
            '수박',
            '멜론',
            '샤인머스캣',
            '배',
            '두리안',
            '초콜릿',
            '방어',
            '우럭',
            '누룽지',
            '멀티버스',
            '닥터스트레인지',
          ],
          fail: () => console.log('실패한!'),
          success: () => console.log('성공!'),
        },
      });
    },
  };

  return (
    <div id="game">
      <div className="test-buttons" style={{ zIndex: 5 }}>
        <button onClick={click.waiting}>waiting</button>
        <button onClick={click.selectApple}>select apple</button>
        <button onClick={click.selectLiar}>select Liar</button>
        <button onClick={click.chat}>chat</button>
        <button onClick={click.vote}>vote</button>
        <button onClick={click.resultSuccess}>result success</button>
        <button onClick={click.resultFail}>result fail</button>
        <button onClick={click.liar}>liar</button>
      </div>
      {$}
    </div>
  );
};

export default React.memo(Game);
