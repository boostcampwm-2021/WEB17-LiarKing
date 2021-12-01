import React, { useEffect, useRef, useContext, useState } from 'react';
import { useRecoilValue } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import { globalContext } from '../../App';
import { socketUtilType } from '../../utils/socketUtil';

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
        <span className={`game-chat-box-read game-chat-box-font game-user-${v.color}`} key={i}>
          {v.userName + ' : ' + v.ment}
        </span>
      )) ?? <></>}
    </div>
  );
};

const GameContentChatBox = ({ socket }: { socket: socketUtilType }) => {
  const messageBox = useRef<HTMLInputElement>();

  const sendIfEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  const sendMessage = () => {
    if (messageBox.current.value !== '') {
      const message = messageBox.current.value;
      socket.emit.CHAT_MESSAGE_DATA({ message });
      messageBox.current.value = '';
    }
  };

  return (
    <div className="game-chat-box game-chat-box-send">
      <input className="game-chat-box-font game-chat-send-input" size={40} ref={messageBox} onKeyDown={sendIfEnter} />
      <button className="game-chat-send-button" onClick={sendMessage} />
    </div>
  );
};

const GameSpeakerAlarm = ({ userId }: { userId: string }) => {
  return (
    <div className="game-content-box game-content-alarm">
      <span className="game-content-title game-content-title-vote">{userId + '님! 설명할 차례입니다!'}</span>
      <span className="game-content-ment">제시어에 대해 설명해주세요!</span>
    </div>
  );
};

const GameContentChatSpeaker = ({ socket }: { socket: socketUtilType }) => {
  type speakerDataType = { speaker: string; timer: number };

  const SECONDS = 1000;
  const [speakerData, setSpeakerData]: [speakerDataType, React.Dispatch<React.SetStateAction<speakerDataType>>] = useState(null);
  const user = useRecoilValue(globalAtom.user);

  const timer = useRef<HTMLDivElement>();

  useEffect(() => {
    socket.on.CHAT_SPEAKER_DATA({ setState: setSpeakerData });

    return () => {
      socket.off.CHAT_SPEAKER_DATA();
    };
  }, []);

  useEffect(() => {
    if (!speakerData) return;

    let time = speakerData.timer;
    timer.current.innerText = `남은시간: ${time}초`;

    const activeTimer = setInterval(() => {
      if (time <= 0 || !timer.current) {
        clearInterval(activeTimer);
        return;
      } else time--;

      if (!!timer.current) timer.current.innerText = `남은시간: ${time}초`;
    }, SECONDS);

    return () => {
      clearInterval(activeTimer);
    };
  }, [speakerData]);

  return (
    <>
      {speakerData && user.user_id === speakerData.speaker ? <GameSpeakerAlarm userId={user.user_id} /> : <></>}
      <div className="game-content-chat-speaker">{!!speakerData ? `발언자: ${speakerData.speaker}` : ''}</div>
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
