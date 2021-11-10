import React, { useEffect, useRef } from 'react';

type propsType = { chatHistory: string[]; speaker: string; timer: number; changeMessage: any; sendMessage: any };

const GameContentChat = ({ chat }: { chat: propsType }) => {
  const { chatHistory, speaker, timer, changeMessage, sendMessage } = chat;

  const scroll: any = useRef();

  useEffect(() => {
    scroll.current.scrollTop = scroll.current.scrollHeight;
  }, []);

  return (
    <div className="game-content-chat">
      <div className="game-content-chat-history" ref={scroll} tabIndex={1}>
        {chatHistory.map((v, i) => (
          <span className="game-chat-box game-chat-box-read game-chat-box-font" key={i}>
            {v}
          </span>
        ))}
      </div>
      <div className="game-chat-box game-chat-box-send">
        <input className="game-chat-box-font game-chat-send-input" size={40} onChange={changeMessage} />
        <button className="game-chat-send-button" onClick={sendMessage} />
      </div>
      <div className="game-content-chat-speaker">{`발언자: ${speaker}`}</div>
      <div className="game-content-chat-timer">{`남은시간: ${timer}초`}</div>
    </div>
  );
};

export default React.memo(GameContentChat);
