import React, { useEffect, useRef, useContext, useState } from 'react';
import { globalContext } from '../../App';

import { socketUtilType } from '../../utils/socketUtil';

import globalAtom from '../../recoilStore/globalAtom';
import { GAME_MESSAGE } from '../../utils/socketMsgConstants';
import { clientType } from './GamePersons';

const GameContentChatHistory = ({ socket }: { socket: socketUtilType }) => {
  type chatDataType = { ment: string; userName: string; color: string };

  const [chatHistory, setChatHistory]: [chatDataType[], React.Dispatch<React.SetStateAction<chatDataType[]>>] = useState(null);
  const scroll = useRef<HTMLDivElement>();

  useEffect(() => {
    socket.on.CHAT_HISTORY_DATA({ setState: setChatHistory });
    scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [chatHistory]);

  return (
    <div className="game-content-chat-history" ref={scroll} tabIndex={1}>
      {chatHistory?.map((v, i) => (
        <span className={`game-chat-box game-chat-box-read game-chat-box-font game-chat-box-${v.color}`} key={i}>
          {v.userName}:{v.ment}
        </span>
      )) ?? <></>}
    </div>
  );
};

const GameContentChatBox = ({ socket }: { socket: socketUtilType }) => {
  const messageBox = useRef<HTMLInputElement>();

  const sendMessage = () => {
    if (messageBox.current.value !== '') {
      const message = messageBox.current.value;

      socket.emit.CHAT_MESSAGE_DATA({ message }); //수정 필요
      socket.emit(GAME_MESSAGE.CHAT_DATA, { message, roomTitle: roomData.selectedRoomTitle }); //수정 필요

      messageBox.current.value = '';
    }
  };

  return (
    <div className="game-chat-box game-chat-box-send">
      <input className="game-chat-box-font game-chat-send-input" size={40} ref={messageBox} />
      <button className="game-chat-send-button" onClick={sendMessage} />
    </div>
  );
};

const GameContentChatSpeaker = ({ socket }: { socket: socketUtilType }) => {
  type speackerDataType = { speaker: string; timer: number };

  const SECONDS = 1000;
  const [speackerData, setSpeakerData]: [speackerDataType, React.Dispatch<React.SetStateAction<speackerDataType>>] = useState(null);

  const timer = useRef<HTMLDivElement>();

  useEffect(() => {
    socket.on.CHAT_SPEAKER_DATA({ setState: setSpeakerData });

    return () => {
      socket.off.CHAT_SPEAKER_DATA();
    };
  }, []);

  useEffect(() => {
    if (!speackerData) return;

    let time = speackerData.timer;
    timer.current.innerText = `남은시간: ${time}초`;

    const activeTimer = setInterval(() => {
      if (time <= 0) clearInterval(activeTimer);
      else time--;

      if (!!timer.current) timer.current.innerText = `남은시간: ${time}초`;
    }, SECONDS);

    return () => {
      clearInterval(activeTimer);
    };
  }, [speackerData]);

  return (
    <>
      <div className="game-content-chat-speaker">{!!speackerData ? `발언자: ${speackerData.speaker}` : ''}</div>
      <div className="game-content-chat-timer" ref={timer}></div>
    </>
  );
};

const GameContentChat = () => {
  const { socket }: { socket: socketUtilType } = useContext(globalContext);

  return (
    <div className="game-content-chat">
      <GameContentChatHistory socket={socket} />
      <GameContentChatBox socket={socket} />
      <GameContentChatSpeaker socket={socket} />
    </div>
  );
};

export default GameContentChat;
