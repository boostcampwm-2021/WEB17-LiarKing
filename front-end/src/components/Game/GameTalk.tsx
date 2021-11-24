import GameTalkAudio from './GameTalkAudio';
import { clientsType } from '../../utils/typeDefinitions';
import '../../styles/GameTalk.css';
import Peer from 'peerjs';
import { useEffect, useRef, useState } from 'react';
import socketUtil from '../../utils/socketUtil';
import { socket } from '../../utils/socketUtil';
import { useRecoilValue } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
const GameTalk = () => {
  const myPeerRef = useRef<Peer>();
  const myPeerIdRef = useRef<string>();
  const [myStream, setMyStream] = useState<MediaStream>(new MediaStream());
  const localAudio = useRef(null);
  const [users, setUsers] = useState([]);
  const myId = useRecoilValue(globalAtom.user);

  const getUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localAudio.current.srcObject = stream;

    setMyStream(stream);

    socket.emit('i joined', { peerId: myPeerIdRef.current });
  };

  useEffect(() => {
    const connectToNewUser = ({ peerId }: { peerId: string }) => {
      if (!myPeerRef.current) return;

      const call = myPeerRef.current.call(peerId, myStream);

      call.on('stream', (stream) => {
        setUsers((prev) => {
          const userObj = prev.find((user) => user.peerId == peerId);
          if (!userObj) {
            return [...prev, { peerId, stream, call, socketId: socket.id }];
          } else {
            return [...prev];
          }
        });
      });
      call.on('close', () => {
        setUsers((prev) => [...prev.filter((user) => user.peerID != peerId)]);
      });
    };

    const answerToUser = (call: Peer.MediaConnection) => {
      call.on('stream', (stream) => {
        setUsers((prev) => {
          const userObj = prev.find((user) => user.peerId == call.peer);
          if (!userObj) {
            return [...prev, { peerId: call.peer, stream, call, socketId: socket.id }];
          } else {
            return [...prev];
          }
        });
      });
      call.answer(myStream);
    };

    socket.on('someone joined', connectToNewUser);
    myPeerRef.current?.on('call', answerToUser);

    socket.on('current speaker', ({ speaker }) => {
      if (myId.user_id === speaker) {
        myStream.getTracks().forEach((track) => {
          track.enabled = true;
        });
      } else {
        myStream.getTracks().forEach((track) => {
          track.enabled = false;
        });
      }
    });

    socket.on('end speak', () => {
      myStream.getTracks().forEach((track) => {
        track.enabled = false;
      });
    });

    myStream.getTracks().forEach((track) => {
      track.enabled = false;
    });

    return () => {
      socket.off('someone joined', connectToNewUser);
      myPeerRef.current?.off('call', answerToUser);
      socket.off('current speaker');
      socket.off('end speak');
    };
  }, [myStream]);

  const setPeerId = (id: string) => {
    myPeerIdRef.current = id;
    getUserMedia();
  };
  useEffect(() => {
    myPeerRef.current = new Peer(undefined, {
      host: '/',
      port: 5001,
    });

    myPeerRef.current.on('open', setPeerId);

    socket.on('user exit', ({ socketId }) => {
      // setUsers((prev) => {
      //   const findUser = prev.find((user) => user.socketId == socketId);
      //   if (findUser) {
      //     findUser.call.close();
      //     const newUsers = users.filter((user) => user.socketId !== socketId);
      //     return [...newUsers];
      //   }
      // });
    });

    return () => {
      socket.off('user exit');
      myPeerRef.current.off('open', setPeerId);
    };
  }, []);

  return (
    <div className="game-talk">
      <div className="audio-wrap">
        <video className="game-audio" playsInline autoPlay width="0" muted={true} ref={localAudio}></video>
        {users.map((user) => (
          <GameTalkAudio key={user.id} stream={user.stream} />
        ))}
      </div>
    </div>
  );
};

export default GameTalk;
