import '../../styles/Game.css';
import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import GameButtons from '../Game/GameButtons';
import GamePersons from '../Game/GamePersons';
import GameContent from '../Game/GameContent';
import { globalContext } from '../../App';
import { getUserData } from '../../utils/getDataUtil';
import GameChatBox from '../Game/GameChatBox';
import { socketUtilType } from '../../utils/socketUtil';
import globalAtom from '../../recoilStore/globalAtom';
import { useRecoilState } from 'recoil';

const GameBackgound = ({ socket }: { socket: socketUtilType }) => {
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

const GameTitleInfo = ({ socket }: { socket: socketUtilType }) => {
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

  return (
    <span className="game-header-info">
      ({usersAmount} / {maxUsers}) {roomTitle}
    </span>
  );
};

const Game = () => {
  const history = useHistory();
  const { socket }: { socket: socketUtilType } = useContext(globalContext);
  const [user, setUser] = useRecoilState(globalAtom.user);

  window.onpopstate = () => {
    if (window.location.pathname === '/lobby') {
      socket.emit.ROOM_EXIT();
    } else if (window.location.pathname === '/game') {
      history.replace('/lobby');
    }
  };

  useEffect(() => {
    if (!user.user_id) getUserData(setUser);

    // socket.on('on vote', ({ time, roomInfo }: { time: number; roomInfo: roomInfoType }) => {
    //   const { client } = roomInfo;

    //   client.map((client: any) => (client.state = 'vote'));

    //   if (time === -1) {
    //     if (!voteInfo.isFixed || voteInfo.voteTo === -1) {
    //       socket.emit('vote result', { index: -1, name: '기권', roomtitle: roomData.selectedRoomTitle });
    //     } else {
    //       socket.emit('vote result', { index: voteInfo.voteTo, name: client[voteInfo.voteTo].name, roomtitle: roomData.selectedRoomTitle });
    //     }
    //   } else {
    //     setAction({
    //       type: 'vote',
    //       vote: { timer: time, setFix: false },
    //       ...roomInfo,
    //     });
    //   }
    // });

    // socket.on(
    //   'end vote',
    //   ({ gameResult, liarName, voteResult, roomInfo }: { gameResult: boolean; liarName: string; voteResult: string[]; roomInfo: roomInfoType }) => {
    //     voteInfo.isFixed = false;
    //     voteInfo.voteTo = -1;
    //     setAction({
    //       type: 'result',
    //       result: { gameResult: gameResult, liar: liarName, voteResult: voteResult },
    //       ...roomInfo,
    //     });
    //   }
    // );

    return () => {
      // socket.off('room data');
      // socket.off('word select');
      // socket.off('get word');
      // socket.off('chat data');
      // socket.off('on vote');
      // socket.off('end vote');
    };
  }, []);

  return (
    <div id="game">
      <GameBackgound socket={socket} />
      <header className="game-header">
        <span className="game-header-logo">Liar Game</span>
        <GameButtons />
        <GameTitleInfo socket={socket} />
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
