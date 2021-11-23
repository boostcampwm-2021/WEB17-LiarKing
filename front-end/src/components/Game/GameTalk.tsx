import GameTalkAudio from './GameTalkAudio';
import { clientsType } from '../../utils/typeDefinitions';
import '../../styles/GameTalk.css';
import Peer from 'peerjs';
import { useEffect, useRef, useState } from 'react';
import socketUtil from '../../utils/socketUtil';
import { socket } from '../../utils/socketUtil';
const GameTalk = () => {
  let myPeer: Peer;
  let myStream: MediaStream;
  let peers: { [prop: string]: Peer.MediaConnection } = {};
  const localAudio = useRef(null);
  const [users, setUsers] = useState([]);

  const getUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localAudio.current.srcObject = stream;

    myStream = stream;

    myPeer = new Peer(undefined, {
      host: '/',
      port: 5001,
    });

    myPeer.on('open', (id: string) => {
      socket.emit('i joined', { id });
    });

    socket.on('someone joined', ({ id }) => {
      connectToNewUser(id);
    });

    myPeer.on('call', (call) => {
      console.log('recevie origin', call, myStream);
      call.answer(myStream);
      call.on('stream', (stream) => {
        setUsers([...users, { id: Math.random(), stream: stream }]);
      });
    });
  };

  const connectToNewUser = (id: string) => {
    const call = myPeer.call(id, myStream);

    call.on('stream', (stream) => {
      setUsers([...users, { id, stream }]);
    });

    call.on('close', () => {
      const newUsers = users.filter((user) => user.id != id);
      setUsers([...newUsers]);
    });

    peers[id] = call;
  };

  useEffect(() => {
    getUserMedia();
  }, []);

  return (
    <div className="game-talk">
      <div className="audio-wrap">
        <video className="game-audio" playsInline autoPlay width="100" ref={localAudio}></video>
        {users.map((user) => (
          <GameTalkAudio stream={user.stream} />
        ))}
      </div>
    </div>
  );
};

export default GameTalk;
