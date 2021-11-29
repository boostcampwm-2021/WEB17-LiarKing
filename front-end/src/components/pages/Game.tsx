import '../../styles/Game.css';
import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import GameButtons from '../Game/GameButtons';
import GamePersons from '../Game/GamePersons';
import GameContent from '../Game/GameContent';
import { globalContext } from '../../App';
import { getUserData } from '../../utils/getDataUtil';
import GameChatBox from '../Game/GameChatBox';
import globalAtom from '../../recoilStore/globalAtom';
import { useRecoilState } from 'recoil';
import { socketUtilType } from '../../utils/socketUtil';
import socketUtil, { socket } from '../../utils/socketUtil';

const GameBackground = () => {
  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const [isWaitingState, setIsWaitingState] = useState(true);
  const FILTER_CLASS_NAME = 'game-filter';

  useEffect(() => {
    socket.on.IS_WAITING_STATE({ setState: setIsWaitingState });

    return () => {
      socket.off.IS_WAITING_STATE();
    };
  }, []);

  return <section className={`game-background ${isWaitingState ? '' : FILTER_CLASS_NAME}`}></section>;
};

const GameTitleInfo = () => {
  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const [roomTitleInfo, setRoomInfoInfo] = useState({ usersAmount: 0, maxUsers: 0, roomTitle: '' });

  const { usersAmount, maxUsers, roomTitle } = roomTitleInfo;

  useEffect(() => {
    socket.on.ROOM_TITLE_INFO({ state: roomTitleInfo, setState: setRoomInfoInfo });

    return () => {
      socket.off.ROOM_TITLE_INFO();
    };
  }, [roomTitleInfo]);

  useEffect(() => {
    socket.emit.ROOM_TITLE_INFO();
  }, []);

  return <span className="game-header-info">{'(' + usersAmount + '/' + maxUsers + ') ' + roomTitle}</span>;
};

const Game = () => {
  const history = useHistory();
  const [user, setUser] = useRecoilState(globalAtom.user);

  window.onpopstate = () => {
    if (window.location.pathname === '/lobby') {
      socketUtil.emit.LOBBY_ENTERED({ userId: user.user_id });
    } else if (window.location.pathname === '/game') {
      history.replace('/lobby');
    }
  };

  if (!user.user_id || user.socketId !== socket.id) getUserData(setUser, socketUtil, user.socketId !== socket.id);

  return (
    <div id="game">
      <GameBackground />
      <header className="game-header">
        <span className="game-header-logo">Liar Game</span>
        <GameButtons />
        <GameTitleInfo />
      </header>
      <section className="game-persons">
        <GamePersons />
        <GameChatBox />
      </section>
      <section className="game-content">
        <GameContent />
      </section>
    </div>
  );
};

export default React.memo(Game);
