import React, { useEffect, useReducer } from 'react';
import GameContentChat from './GameContentChat';
import GameContentLiar from './GameContentLiar';
import GameContentResult from './GameContentResult';
import GameContentSelect from './GameContentSelect';
import GameContentVote from './GameContentVote';

export type actionType = (
  | { type: 'waiting' }
  | { type: 'select'; select: { word: string } }
  | { type: 'chat'; chat: { chatHistory: string[]; speaker: string; timer: number } }
  | { type: 'vote'; vote: { timer: number; setFix: any } }
  | { type: 'result'; result: { voteResult: string[]; liar: string; gameResult: boolean } }
  | { type: 'liar'; liar: { category: string[]; answer: number; success(): void; fail(): void } }
) & { persons: Array<{ id: string; item?: string }> };

const $reducer = (state: JSX.Element, action: actionType): JSX.Element => {
  console.log(state);
  switch (action.type) {
    case 'waiting':
      return <></>;
    case 'select':
      return <GameContentSelect select={action.select} />;
    case 'chat':
      return <GameContentChat persons={action.persons} chat={action.chat} />;
    case 'vote':
      return <GameContentVote timer={action.vote.timer} setFix={action.vote.setFix} />;
    case 'result':
      return <GameContentResult result={action.result} />;
    case 'liar':
      return <GameContentLiar liar={action.liar} />;
    default:
      return state;
  }
};

const GameContent = ({ action }: { action: actionType }) => {
  const [$, $dispatch] = useReducer($reducer, <></>);

  useEffect(() => {
    $dispatch(action);
  }, [action]);

  return $;
};

export default React.memo(GameContent);
