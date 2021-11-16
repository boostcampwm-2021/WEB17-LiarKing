import React, { useEffect, useReducer } from 'react';
import { roomInfoType } from '../pages/Game';
import GameContentChat from './GameContentChat';
import GameContentLiar from './GameContentLiar';
import GameContentResult from './GameContentResult';
import GameContentSelect from './GameContentSelect';
import GameContentVote from './GameContentVote';

export type actionType =
  | { type: 'waiting' }
  | { type: 'select'; select: { word: string } }
  | { type: 'chat'; chat: { chatHistory: string[]; speaker: string; timer: number } }
  | { type: 'vote'; vote: { timer: number } }
  | { type: 'result'; result: { voteResult: string[]; liar: string; gameResult: boolean } }
  | { type: 'liar'; liar: { category: string[]; answer: number; success: () => void; fail: () => void } };

const $reducer = (state: JSX.Element, action: actionType & roomInfoType): JSX.Element => {
  switch (action.type) {
    case 'waiting':
      return <></>;
    case 'select':
      return <GameContentSelect select={action.select} />;
    case 'chat':
      return <GameContentChat clients={action.client} chat={action.chat} />;
    case 'vote':
      return <GameContentVote timer={action.vote.timer} />;
    case 'result':
      return <GameContentResult result={action.result} />;
    case 'liar':
      return <GameContentLiar liar={action.liar} />;
    default:
      return state;
  }
};

const GameContent = ({ action }: { action: actionType & roomInfoType }) => {
  const [$, $dispatch] = useReducer($reducer, <></>);

  useEffect(() => {
    $dispatch(action);
  }, [action]);

  return $;
};

export default React.memo(GameContent);
