import { useContext, useEffect, useReducer } from 'react';
import { globalContext } from '../../App';
import { socketUtilType } from '../../utils/socketUtil';
import GameContentChat from './GameContentChat';
import GameContentLiar from './GameContentLiar';
import GameContentResult from './GameContentResult';
import GameContentSelect from './GameContentSelect';
import GameContentVote from './GameContentVote';

export type actionType = { type: string };

const $reducer = (state: JSX.Element, action: actionType): JSX.Element => {
  switch (action.type) {
    case 'waiting':
      return <></>;
    case 'select':
      return <GameContentSelect />;
    case 'chat':
      return <GameContentChat />;
    case 'vote':
      return <GameContentVote />;
    case 'result':
      return <GameContentResult />;
    case 'liar':
      return <GameContentLiar />;
    default:
      return state;
  }
};

const GameContent = () => {
  const [element, elementDispatch] = useReducer($reducer, <></>);
  const { socket }: { socket: socketUtilType } = useContext(globalContext);

  useEffect(() => {
    socket.on.ROOM_STATE_INFO({ dispatch: elementDispatch });

    return () => {
      socket.off.ROOM_STATE_INFO();
    };
  }, []);

  return element;
};

export default GameContent;
