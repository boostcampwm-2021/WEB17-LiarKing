import { useEffect, useRef, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';
import { globalContext } from '../../App';
import globalAtom from '../../recoilStore/globalAtom';
import { GAME_MESSAGE } from '../../utils/socketMsgConstants';
import { clientType } from './GamePersons';

type propsType = { chatHistory: string[]; speaker: string; timer: number };

const chatColor = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'navy', 'purple'];

const GameContentChat = ({ clients, chat }: { clients: clientType[]; chat: propsType }) => {
  const user = useRecoilValue(globalAtom.user);
  const roomData = useRecoilValue(globalAtom.roomData);

  const { socket }: { socket: Socket } = useContext(globalContext);

  const { chatHistory, speaker, timer } = chat;
  const scroll = useRef<HTMLDivElement>();
  const messageBox = useRef<HTMLInputElement>();

  const idList: Array<string> = [];
  clients.forEach((client) => {
    idList.push(client.name);
  });

  const sendIfEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  const sendMessage = () => {
    if (messageBox.current.value !== '') {
      const message = user.user_id + ': ' + messageBox.current.value;
      socket.emit(GAME_MESSAGE.CHAT_DATA, { message, roomTitle: roomData.selectedRoomTitle });
      messageBox.current.value = '';
    }
  };

  useEffect(() => {
    scroll.current.scrollTop = scroll.current.scrollHeight;
  }, []);

  return (
    <div className="game-content-chat">
      <div className="game-content-chat-history" ref={scroll} tabIndex={1}>
        {chatHistory?.map((v, i) => (
          <span className={'game-chat-box game-chat-box-read game-chat-box-font game-chat-box-' + chatColor[idList.indexOf(v.split(':')[0])]} key={i}>
            {v}
          </span>
        )) ?? <></>}
      </div>
      <div className="game-chat-box game-chat-box-send">
        <input className="game-chat-box-font game-chat-send-input" onKeyDown={sendIfEnter} size={40} ref={messageBox} />
        <button className="game-chat-send-button" onClick={sendMessage} />
      </div>
      <div className="game-content-chat-speaker">{`발언자: ${speaker}`}</div>
      <div className="game-content-chat-timer">{`남은시간: ${timer}초`}</div>
    </div>
  );
};

export default GameContentChat;
