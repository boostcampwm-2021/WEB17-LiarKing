import '../../styles/Game.css';
import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import GameButtons from '../Game/GameButtons';
import GamePersons from '../Game/GamePersons';
import GameContent from '../Game/GameContent';
import { globalContext } from '../../App';
import { getUserData } from '../../utils/getDataUtil';
import { voteInfo } from '../../utils/store';
import GameChatBox from '../Game/GameChatBox';
import globalAtom from '../../recoilStore/globalAtom';
import { useRecoilState } from 'recoil';

import { socketUtilType } from '../../utils/socketUtil'; //수정필요
import { GAME_MESSAGE, ROOM_MEESSAGE } from '../../utils/socketMsgConstants'; //수정필요

const GameBackgound = ({ socket }: { socket: socketUtilType }) => {
  const [isWaitingState, setIsWaitingState] = useState(true);
  const FILTER_CLASS_NAME = 'game-filter';

  useEffect(() => {
    socket.on.IS_WAITING_STATE({ setState: setIsWaitingState }); //수정필요

    return () => {
      socket.off.IS_WAITING_STATE(); //수정필요
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
  const [client, setClient] = useRecoilState(globalAtom.client);

  window.onpopstate = () => {
    if (window.location.pathname === '/lobby') {
      socket.emit.ROOM_EXIT(); //수정필요
      socket.emit(ROOM_MEESSAGE.EXIT, roomData.selectedRoomTitle); //수정필요
    } else if (window.location.pathname === '/game') {
      history.replace('/lobby');
    }
  };

  const onRoomData = () => {
    socket.on(ROOM_MEESSAGE.DATA, ({ roomInfo, tag }: { roomInfo: roomInfoType; tag: string }) => {
      const { owner, client, title } = roomInfo;

      const waiting = {
        isOwner: owner === user.user_id,
        roomTitle: title,
        maxPerson: roomInfo.max,
      };

      Object.assign(
        waiting,
        waiting.isOwner
          ? { isAllReady: client.filter((v) => v.state === 'ready').length === client.length - 1 }
          : { isReady: client.find((v) => v.name === user.user_id)?.state === 'ready' }
      );

      const actionData: actionType = { type: 'waiting', waiting };

      setClient([...client]);

      setAction(Object.assign(actionData, roomInfo));
    });
  };

  const onWordSelect = () => {
    socket.on(GAME_MESSAGE.WORD_SELECT, ({ category, roomInfo }: { category: string; roomInfo: roomInfoType }) => {
      setAction({ type: 'select', select: { word: category }, ...roomInfo });

      socket.emit(GAME_MESSAGE.GET_WORD, { roomTitle: roomData.selectedRoomTitle });
    });
  };

  const onGetWord = () => {
    socket.on(GAME_MESSAGE.GET_WORD, ({ word, roomInfo }: { word: string; roomInfo: roomInfoType }) => {
      setAction({ type: 'select', select: { word }, ...roomInfo });

      if (roomInfo.owner === user.user_id) {
        socket.emit(GAME_MESSAGE.CHAT_DATA, { roomTitle: roomData.selectedRoomTitle });
      }
    });
  };

  const onChatData = () => {
    socket.on(
      GAME_MESSAGE.CHAT_DATA,
      ({ chat, roomInfo }: { chat: { chatHistory: string[]; speaker: string; timer: number }; roomInfo: roomInfoType }) => {
        if (roomInfo.state !== 'chat') return;
        setAction({ type: 'chat', chat, ...roomInfo });
      }
    );
  };

  const onOnVote = () => {
    socket.on(GAME_MESSAGE.ON_VOTE, ({ time, roomInfo }: { time: number; roomInfo: roomInfoType }) => {
      const { client } = roomInfo;

      client.map((client: any) => (client.state = 'vote'));

      if (time === -1) {
        if (!voteInfo.isFixed || voteInfo.voteTo === -1) {
          socket.emit(GAME_MESSAGE.VOTE_RESULT, { index: -1, name: '기권', roomtitle: roomData.selectedRoomTitle });
        } else {
          socket.emit(GAME_MESSAGE.VOTE_RESULT, {
            index: voteInfo.voteTo,
            name: client[voteInfo.voteTo].name,
            roomtitle: roomData.selectedRoomTitle,
          });
        }
      } else {
        setAction({
          type: 'vote',
          vote: { timer: time, setFix: false },
          ...roomInfo,
        });
      }
    });
  };

  const onEndVote = () => {
    socket.on(
      GAME_MESSAGE.END_VOTE,
      ({ gameResult, liarName, voteResult, roomInfo }: { gameResult: boolean; liarName: string; voteResult: string[]; roomInfo: roomInfoType }) => {
        voteInfo.isFixed = false;
        voteInfo.voteTo = -1;
        setAction({
          type: 'result',
          result: { gameResult: gameResult, liar: liarName, voteResult: voteResult },
          ...roomInfo,
        });
      }
    );
  };

  useEffect(() => {
    if (!user.user_id) getUserData(setUser);

    onRoomData();
    onWordSelect();
    onGetWord();
    onChatData();
    onOnVote();
    onEndVote();

    socket.emit(ROOM_MEESSAGE.DATA, roomData.selectedRoomTitle);

    return () => {
      socket.off(ROOM_MEESSAGE.DATA);
      socket.off(GAME_MESSAGE.WORD_SELECT);
      socket.off(GAME_MESSAGE.GET_WORD);
      socket.off(GAME_MESSAGE.CHAT_DATA);
      socket.off(GAME_MESSAGE.ON_VOTE);
      socket.off(GAME_MESSAGE.END_VOTE);
    };
  }, []);

  return (
    <div id="game">
      <GameBackground socket={socket} />
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
