import '../../styles/Game.css';
import React, { useReducer } from 'react';
import GameButtons from '../Game/GameButtons';
import GamePersons from '../Game/GamePersons';
import GameContent from '../Game/GameContent';

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

const action = {
  type: 'waiting',
};

// const action = {
//   type: 'select',
//   word: { en: 'liar', kr: '라이어' },
// };

// const action = {
//   type: 'select',
//   word: { en: 'apple', kr: '사과' },
// };

type chatType = { chatHistory: string[]; speaker: string; timer: number; changeMessage: any; sendMessage: any };
type wordType = { en: string; kr: string };
type personType = { id: string; item?: string };
type $reducerType = { type: string; persons: personType[]; word?: wordType; chat?: chatType };

const $reducer = (state: any, { type, persons, word, chat }: $reducerType) => {
  switch (type) {
    case 'waiting':
      return (
        <>
          <section className="game-background"></section>
          <header className="game-header">
            <span className="game-header-logo">Liar Game</span>
            <GameButtons />
            <span className="game-header-info">(6 / 8) kskim625의 방</span>
          </header>
          <section className="game-persons">
            <GamePersons persons={persons} />
          </section>
          <section className="game-content"></section>
        </>
      );
    case 'select':
      return (
        <>
          <section className="game-background"></section>
          <header className="game-header">
            <span className="game-header-logo">Liar Game</span>
            <GameButtons />
            <span className="game-header-info">(6 / 8) kskim625의 방</span>
          </header>
          <section className="game-persons">
            <GamePersons persons={persons} />
          </section>
          <section className="game-content">
            <GameContent action={{ type, word }} />
          </section>
        </>
      );
    case 'chat':
      return (
        <>
          <section className="game-background game-filter"></section>
          <header className="game-header">
            <span className="game-header-logo">Liar Game</span>
            <GameButtons />
            <span className="game-header-info">(6 / 8) kskim625의 방</span>
          </header>
          <section className="game-persons">
            <GamePersons persons={persons} />
          </section>
          <section className="game-content">
            <GameContent action={{ type, chat }} />
          </section>
        </>
      );
    default:
      return state;
  }
};

const Game = () => {
  const [$, $dispatch] = useReducer(
    $reducer,
    <>
      <section className="game-background"></section>
      <header className="game-header">
        <span className="game-header-logo">Liar Game</span>
        <GameButtons />
        <span className="game-header-info">(6 / 8) kskim625의 방</span>
      </header>
      <section className="game-persons">
        <GamePersons persons={persons} />
      </section>
      <section className="game-content">
        <GameContent action={action} />
      </section>
    </>
  );

  const click = () => {
    $dispatch({
      type: 'chat',
      persons,
      chat: {
        chatHistory: [
          'test: message',
          'test: message2',
          'test: message2',
          'test: message2',
          'test: message2',
          'test: message2',
          'test: message2',
          'test: message2',
          'test: message2',
        ],
        speaker: 'Dunde',
        timer: 0,
        changeMessage: (e: any) => console.log(e.target.value),
        sendMessage: () => console.log('click send message'),
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
