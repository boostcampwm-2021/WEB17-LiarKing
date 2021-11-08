import React, { useEffect, useReducer } from 'react';
import GameContentChat from './GameContentChat';
import GameContentSelect from './GameContentSelect';

type actionType = {
  type: string;
  word?: { en: string; kr: string };
  chat?: { chatHistory: string[]; speaker: string; timer: number; changeMessage: any; sendMessage: any };
};

const $reducer = (state: any, { type, word, chat }: actionType): JSX.Element => {
  switch (type) {
    case 'select':
      return <GameContentSelect word={word} />;
    case 'chat':
      return <GameContentChat chat={chat} />;
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
