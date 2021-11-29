import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import globalAtom from '../../recoilStore/globalAtom';
import { globalContext } from '../../App';

import '../../styles/GameChatBox.css';
import { socketUtilType } from '../../utils/socketUtil';

const CONSTANTS = {
  INITIAL_CHATBOX_TOP: 23,
  CHATBOX_LEFT: '16%',
  CHATBOX_RIGHT: '16%',
  CHATBOX_TOP_DIFF: 19,
  ROW_MAX_CLIENT: 4,
  CURRENT_CHAT_IDX: 0,
  MSG_BOX_APPEAR_TIME: 3000,
};

type chatListType = {
  [prop: string]: JSX.Element[];
};

const hiddenElement = <div className="game-wait-chat-hidden"></div>;

let chatList: chatListType = {
  0: [hiddenElement],
  1: [hiddenElement],
  2: [hiddenElement],
  3: [hiddenElement],
  4: [hiddenElement],
  5: [hiddenElement],
  6: [hiddenElement],
  7: [hiddenElement],
};

const GameChatBox = () => {
  const user = useRecoilValue(globalAtom.user);
  const roomData = useRecoilValue(globalAtom.roomData);
  const clients = useRecoilValue(globalAtom.client);

  const [modal, setModal] = useState(chatList);
  const messageBox = useRef<HTMLInputElement>();

  const [isWaitingState, setIsWaitingState] = useState(true);

  const { socket }: { socket: socketUtilType } = useContext(globalContext);

  const myClassName = 'my-bubble-box';
  let clientIdx = clients.length;

  clients.map((client, i) => {
    if (client.name === user.user_id) clientIdx = i;
  });

  const sendIfEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  const sendMessage = () => {
    if (messageBox.current.value === '') return;
    const messageInfo = { userId: user.user_id, message: messageBox.current.value, title: roomData.selectedRoomTitle, clientIdx: clientIdx };
    socket.emit.WAIT_ROOM_MESSAGE(messageInfo);
    messageBox.current.value = '';
  };

  const setBubbleBox = (messageInfo: { userId: string; message: string; clientIdx: number }) => {
    let bubbleClassName = 'bubble-left';
    if (messageInfo.clientIdx >= CONSTANTS.ROW_MAX_CLIENT) {
      bubbleClassName = 'bubble-right';
    }

    const updateModal = (
      <div
        id="bubble-chat-box"
        className={bubbleClassName + ' ' + (messageInfo.clientIdx === clientIdx ? myClassName : '')}
        key={messageInfo.clientIdx}
      >
        <div className="bubble-chat-box-msg">{messageInfo.message}</div>
      </div>
    );

    chatList[messageInfo.clientIdx].unshift(updateModal);
    setModal({ ...chatList });
    setTimeout(() => {
      chatList[messageInfo.clientIdx].splice(chatList[messageInfo.clientIdx].length - 2, 1);
      setModal({ ...chatList });
    }, CONSTANTS.MSG_BOX_APPEAR_TIME);
  };

  useEffect(() => {
    socket.on.WAIT_ROOM_MESSAGE(setBubbleBox);
    socket.on.IS_WAITING_STATE({ setState: setIsWaitingState });

    return () => {
      socket.off.WAIT_ROOM_MESSAGE();
      socket.off.IS_WAITING_STATE();
    };
  }, []);

  return (
    <>
      {isWaitingState ? (
        <>
          <div className="game-wait-chat-box">
            <input className="game-wait-chat-input" placeholder="chat..." ref={messageBox} onKeyDown={sendIfEnter}></input>
            <button className="game-chat-send-button game-wait-send-button" onClick={sendMessage}></button>
          </div>
          {Object.values(modal).map((chat, i) => {
            return i < CONSTANTS.ROW_MAX_CLIENT ? (
              <div
                className="game-wait-chat-bubble-box"
                style={{
                  top: CONSTANTS.INITIAL_CHATBOX_TOP + i * CONSTANTS.CHATBOX_TOP_DIFF + '%',
                  left: CONSTANTS.CHATBOX_LEFT,
                }}
              >
                {chat[CONSTANTS.CURRENT_CHAT_IDX]}
              </div>
            ) : (
              <div
                className="game-wait-chat-bubble-box"
                style={{
                  top: CONSTANTS.INITIAL_CHATBOX_TOP + (i - 4) * CONSTANTS.CHATBOX_TOP_DIFF + '%',
                  right: CONSTANTS.CHATBOX_RIGHT,
                }}
              >
                {chat[CONSTANTS.CURRENT_CHAT_IDX]}
              </div>
            );
          })}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default GameChatBox;
