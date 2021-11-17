import React, { useState, useEffect, useContext, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { useRecoilValue } from 'recoil';

import globalAtom from '../../recoilStore/globalAtom';
import { globalContext } from '../../App';

import { clientType } from './GamePersons';
import '../../styles/GameChatBox.css';

const CONSTANTS = {
  INITIAL_CHATBOX_TOP: 23,
  CHATBOX_LEFT: '15%',
  CHATBOX_RIGHT: '68%',
  CHATBOX_TOP_DIFF: 19,
  ROW_MAX_CLIENT: 4,
};

type chatListType = {
  [prop: string]: JSX.Element;
};

const hiddenElement = <div className="game-wait-chat-hidden"></div>;

let chatList: chatListType = {
  0: hiddenElement,
  1: hiddenElement,
  2: hiddenElement,
  3: hiddenElement,
  4: hiddenElement,
  5: hiddenElement,
  6: hiddenElement,
  7: hiddenElement,
};

const GameChatBox = ({ clients }: { clients: clientType[] }) => {
  const user = useRecoilValue(globalAtom.user);
  const roomData = useRecoilValue(globalAtom.roomData);

  const [message, setMessage] = useState('');
  const [modal, setModal] = useState(chatList);
  const messageBox = useRef<HTMLInputElement>();
  const { socket }: { socket: Socket } = useContext(globalContext);

  let clientIdx = clients.length;
  clients.map((client, i) => {
    if (client.name === user.user_id) clientIdx = i;
  });

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    const messageInfo = { userId: user.user_id, message: message, title: roomData.selectedRoomTitle, clientIdx: clientIdx };
    socket.emit('wait room message', messageInfo);
    messageBox.current.value = '';
  };

  const setBubbleBox = (messageInfo: { userId: string; message: string; clientIdx: number }) => {
    let bubbleClassName = 'bubble-left';
    if (messageInfo.clientIdx >= CONSTANTS.ROW_MAX_CLIENT) {
      bubbleClassName = 'bubble-right';
    }
    const updateModal = (
      <div id="bubble-chat-box" className={bubbleClassName} key={messageInfo.clientIdx}>
        {messageInfo.message}
      </div>
    );
    chatList[messageInfo.clientIdx] = updateModal;
    setModal({ ...chatList });
  };

  useEffect(() => {
    socket.on('wait room message', (messageInfo: { userId: string; message: string; clientIdx: number }) => {
      setBubbleBox(messageInfo);
    });
    return () => {
      socket.off('send message');
    };
  }, []);

  return (
    <>
      <div className="game-wait-chat-box">
        <input className="game-wait-chat-input" placeholder="chat..." ref={messageBox} onChange={changeMessage}></input>
        <button className="game-chat-send-button game-wait-send-button" onClick={sendMessage}></button>
      </div>
      {Object.values(modal).map((chat, i) => {
        return i < CONSTANTS.ROW_MAX_CLIENT ? (
          <div
            style={{
              animation: 'appear 3s ease-in-out forwards',
              position: 'absolute',
              top: CONSTANTS.INITIAL_CHATBOX_TOP + i * CONSTANTS.CHATBOX_TOP_DIFF + '%',
              left: CONSTANTS.CHATBOX_LEFT,
            }}
          >
            {chat}
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              top: CONSTANTS.INITIAL_CHATBOX_TOP + (i - 4) * CONSTANTS.CHATBOX_TOP_DIFF + '%',
              left: CONSTANTS.CHATBOX_RIGHT,
            }}
          >
            {chat}
          </div>
        );
      })}
    </>
  );
};

export default GameChatBox;
