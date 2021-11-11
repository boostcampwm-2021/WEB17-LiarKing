import React, { useState, useEffect, useRef, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';
import { globalContext } from '../../App';
import globalAtom from '../../recoilStore/globalAtom';

type propsType = { chatHistory: string[]; speaker: string; timer: number };

const chatColor = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'navy', 'purple'];

const GameContentChat = ({ persons, chat }: { persons: Array<{ id: string; item?: string }>; chat: propsType }) => {
  const user = useRecoilValue(globalAtom.user);
  const roomData = useRecoilValue(globalAtom.roomData);

  const [message, setMessage] = useState('');
  const { socket }: { socket: Socket } = useContext(globalContext);

  const { chatHistory, speaker, timer } = chat;
  const scroll: any = useRef();
  const messageBox: any = useRef();

  const checkMessage = [user.user_id, user.user_id + ': '];

  const idList: Array<string> = [];
  persons.forEach((person) => {
    idList.push(person.id);
  });

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(user.user_id + ': ' + e.target.value);
  };

  const sendMessage = () => {
    if (messageBox.current.value !== '') {
      setMessage(user.user_id + ': ' + messageBox.current.value);
      socket.emit('send message', { message: user.user_id + ': ' + messageBox.current.value, title: roomData.selectedRoomTitle });
      messageBox.current.value = '';
    }
  };

  useEffect(() => {
    scroll.current.scrollTop = scroll.current.scrollHeight;

    socket.on('send message', (message) => {
      chatHistory.unshift(message);
      setMessage('');
      setMessage(user.user_id);
    });

    return () => {
      socket.off('send message');
    };
  }, []);

  return (
    <div className="game-content-chat">
      <div className="game-content-chat-history" ref={scroll} tabIndex={1}>
        {chatHistory.map((v, i) => (
          <span className={'game-chat-box game-chat-box-read game-chat-box-font game-chat-box-' + chatColor[idList.indexOf(v.split(':')[0])]} key={i}>
            {v}
          </span>
        ))}
      </div>
      <div className="game-chat-box game-chat-box-send">
        <input className="game-chat-box-font game-chat-send-input" size={40} ref={messageBox} onChange={changeMessage} />
        <button className="game-chat-send-button" onClick={sendMessage} />
      </div>
      <div className="game-content-chat-speaker">{`발언자: ${speaker}`}</div>
      <div className="game-content-chat-timer">{`남은시간: ${timer}초`}</div>
    </div>
  );
};

export default GameContentChat;
