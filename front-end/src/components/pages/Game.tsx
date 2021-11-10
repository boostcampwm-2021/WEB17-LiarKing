import '../../styles/Game.css';
import React, { useEffect, useReducer, useContext } from 'react';
import GameButtons from '../Game/GameButtons';
import GamePersons from '../Game/GamePersons';
import GameContent from '../Game/GameContent';
import { globalContext } from '../../App';
import { Socket } from 'socket.io-client';

//임시 데이터
const persons = [
  { id: 'kskim625', item: 'item' },
  { id: 'dunde', item: '확성기' },
  { id: 'dunde', item: '확성기' },
  { id: 'dunde', item: '확성기' },
  { id: 'dunde' },
  { id: 'dunde', item: '확성기' },
  { id: 'dunde', item: '확성기' },
];

type personType = { id: string; item?: string };
type $reducerType = {
  type: string;
  persons: personType[];
  select?: { word: string };
  chat?: { chatHistory: string[]; speaker: string; timer: number; changeMessage: any; sendMessage: any };
  vote?: { timer: number };
  result?: { voteResult: string[]; liar: string; gameResult: boolean };
  liar?: { category: string[]; answer: number; success(): void; fail(): void };
};

const $reducer = (state: any, action: $reducerType) => {
  const { type, persons, select, chat, vote, result, liar } = action;

  const bgFilter: boolean = type !== 'waiting';
  const contentAction = Object.assign({ type }, { ...action });

  return (
    <>
      <section className={`game-background ${bgFilter && 'game-filter'}`}></section>
      <header className="game-header">
        <span className="game-header-logo">Liar Game</span>
        <GameButtons />
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
  const { roomData, socket }: { roomData: { selectedRoomTitle: string }; socket: Socket } = useContext(globalContext);

  const [$, $dispatch] = useReducer(
    $reducer,
    <>
      <section className="game-background"></section>
      <header className="game-header">
        <span className="game-header-logo">Liar Game</span>
        <GameButtons />
        <span className="game-header-info">() 123</span>
      </header>
      <section className="game-persons">
        <GamePersons persons={persons} />
      </section>
      <section className="game-content">
        <GameContent action={{ type: 'waiting' }} />
      </section>
    </>
  );

  useEffect(() => {
    socket.on('room data', (roomInfo: { title: string; password: string; max: number; client: string[]; cycle: number }) => {
      if (roomInfo !== null) console.log(roomInfo.title, roomInfo.client);
    });

    socket.emit('room data', roomData.selectedRoomTitle);
  }, []);

  const click = () => {
    $dispatch({
      type: 'liar',
      persons,
      liar: {
        answer: 1,
        category: ['사과', '딸기', '바나나', '사과', '딸기', '바나나', '사과', '딸기', '바나나', '사과', '딸기', '바나나', '사과', '딸기', '바나나'],
        fail: () => console.log('실패한!'),
        success: () => console.log('성공!'),
      },
    });
  };

  return (
    <div id="game">
      <button onClick={click} style={{ zIndex: 5 }}>
        test
      </button>
      {$}
    </div>
  );
};

export default React.memo(Game);
