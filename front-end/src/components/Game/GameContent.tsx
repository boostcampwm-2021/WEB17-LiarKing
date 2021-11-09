import React, { useEffect, useReducer } from 'react';
import GameContentChat from './GameContentChat';
import GameContentLiar from './GameContentLiar';
import GameContentResult from './GameContentResult';
import GameContentSelect from './GameContentSelect';
import GameContentVote from './GameContentVote';

type actionType = {
  type: string;
  select?: { word: string };
  chat?: { chatHistory: string[]; speaker: string; timer: number; changeMessage: any; sendMessage: any };
  vote?: { timer: number };
  result?: { voteResult: string[]; liar: string; gameResult: boolean };
  liar?: { category: string[]; answer: number; success(): void; fail(): void };
};

const $reducer = (state: any, action: actionType): JSX.Element => {
  const { type, select, chat, vote, result, liar } = action;

  switch (type) {
    case 'waiting':
      return <div></div>;
    case 'select':
      return <GameContentSelect select={select} />;
    case 'chat':
      return <GameContentChat chat={chat} />;
    case 'vote':
      return <GameContentVote timer={vote.timer} />;
    case 'result':
      return <GameContentResult result={result} />;
    case 'liar':
      return <GameContentLiar liar={liar} />;
    default:
      return state;
  }
};

const GameContent = ({ action }: { action: actionType }) => {
  const [$, $dispatch] = useReducer($reducer, <div></div>);

  useEffect(() => {
    $dispatch(action);
  }, [action]);

  return $;
};

export default React.memo(GameContent);
