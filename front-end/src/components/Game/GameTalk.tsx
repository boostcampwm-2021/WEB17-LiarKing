import GameTalkAudio from './GameTalkAudio';
import { clientsType } from '../../utils/typeDefinitions';
import '../../styles/GameTalk.css';
import Peer from 'peerjs';
import { useEffect, useRef, useState } from 'react';
import socketUtil from '../../utils/socketUtil';
import { socket } from '../../utils/socketUtil';
const GameTalk = ({ clients }: { clients: clientsType[] }) => {
  let myPeer: Peer;
  let peers: { [props: string]: Peer.MediaConnection } = {};
  const localAudio = useRef(null);
  const [users, setUsers] = useState([]);

  const getUserMedia = async () => {
    const myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localAudio.current.srcObject = myStream;

    myPeer = new Peer();

    socket.on('someone joined', (id) => {
      connectToNewUser(id, myStream);
    });

    socket.on('peer-disconnect', (id) => {
      if (peers[id]) peers[id].close();
    });

    myPeer.on('call', (call) => {
      call.answer(myStream);
      call.on('stream', (stream) => {
        setUsers([...users, { id: stream.id, stream: stream }]);
      });
    });

    myPeer.on('open', (id) => {
      socket.emit('i joined', id);
    });
  };

  const connectToNewUser = (id: string, myStream: MediaStream) => {
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
