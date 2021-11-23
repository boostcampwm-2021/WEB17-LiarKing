import GameTalkAudio from './GameTalkAudio';
import { clientsType } from '../../utils/typeDefinitions';
import '../../styles/GameTalk.css';
import Peer from 'peerjs';
import { useEffect, useRef, useState } from 'react';
import socketUtil from '../../utils/socketUtil';
import { socket } from '../../utils/socketUtil';
const GameTalk = () => {
  const myPeerRef = useRef<Peer>();
  const myPeerIdRef = useRef<string>();
  const [myStream, setMyStream] = useState<MediaStream>(new MediaStream());
  const localAudio = useRef(null);
  const [users, setUsers] = useState([]);

  const getUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localAudio.current.srcObject = stream;

    setMyStream(stream);

    socket.emit('i joined', { id: myPeerIdRef.current });
  };

  useEffect(() => {
    const connectToNewUser = ({ id }: { id: string }) => {
      if (!myPeerRef.current) return;

      const call = myPeerRef.current.call(id, myStream);

      call.on('stream', (stream) => {
        setUsers((prev) => {
          const result = prev.find((user) => user.id == id);
          if (!result) {
            return [...prev, { id, stream }];
          } else {
            return [...prev];
          }
        });
      });
      // call.on('close', () => {
      //   setUsers((prevUsers) => prevUsers.filter((user) => user.id != id));
      // });
    };

    const answerToUser = (call: Peer.MediaConnection) => {
      call.on('stream', (stream) => {
        setUsers((prev) => {
          const result = prev.find((user) => user.id == call.peer);
          if (!result) {
            return [...prev, { id: call.peer, stream }];
          } else {
            return [...prev];
          }
        });
      });
      call.answer(myStream);
    };

    socket.on('someone joined', connectToNewUser);
    myPeerRef.current?.on('call', answerToUser);

    return () => {
      socket.off('someone joined', connectToNewUser);
      myPeerRef.current?.off('call', answerToUser);
    };
  }, [myStream]);

  useEffect(() => {
    myPeerRef.current = new Peer(undefined, {
      host: '/',
      port: 5001,
    });

    myPeerRef.current.on('open', (id) => {
      myPeerIdRef.current = id;
      getUserMedia();
    });
  }, []);

  return (
    <div className="game-talk">
      <div className="audio-wrap">
        <video className="game-audio" playsInline autoPlay width="100" ref={localAudio}></video>
        {users.map((user) => (
          <GameTalkAudio key={user.id} stream={user.stream} />
        ))}
      </div>
    </div>
  );
};

export default GameTalk;
