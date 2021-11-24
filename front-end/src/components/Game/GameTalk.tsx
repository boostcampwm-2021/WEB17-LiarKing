import '../../styles/GameTalk.css';
import Peer from 'peerjs';
import GameTalkAudio from './GameTalkAudio';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../../utils/socketUtil';
import { useRecoilValue } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';

const GameTalk = () => {
  const myPeerRef = useRef<Peer>();
  const myPeerIdRef = useRef<string>();
  const myStream = useRef<MediaStream>();
  const calls = useRef<{ [peerId: string]: Peer.MediaConnection }>({});
  const [users, setUsers] = useState([]);
  const myUser = useRecoilValue(globalAtom.user);

  const initRtc = (id: string) => {
    myPeerIdRef.current = id;
    getUserMedia(id);
  };

  const getUserMedia = async (peerId: string) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    myStream.current = stream;
    myStream.current.getTracks().forEach((track) => {
      track.enabled = false;
    });

    setUsers((prev) => [...prev, { peerId, stream, isMe: true }]);

    socket.emit('i joined', { peerId: myPeerIdRef.current });
  };

  const onCall = (call: Peer.MediaConnection, peerId: string) => {
    call.on('stream', (stream) => {
      setUsers((prev) => {
        const user = prev.find((u) => u.peerId === peerId);
        if (!user) {
          calls.current[peerId] = call;
          return [...prev, { peerId, stream, call, isMe: false }];
        } else {
          return [...prev];
        }
      });
    });
  };

  const connectToNewUser = ({ peerId }: { peerId: string }) => {
    if (!myPeerRef.current) return;
    const call = myPeerRef.current.call(peerId, myStream.current);
    onCall(call, peerId);
  };

  const answerToUser = (call: Peer.MediaConnection) => {
    call.answer(myStream.current);
    onCall(call, call.peer);
  };

  const removeUserRtc = ({ peerId }: { peerId: string }) => {
    setUsers((prev) => {
      const findUser = prev.find((user) => {
        return user.peerId === peerId;
      });
      if (findUser) {
        findUser.call.close();
        const newUsers = prev.filter((user) => user.peerId !== peerId);
        delete calls.current[peerId];
        return [...newUsers];
      } else {
        return [...prev];
      }
    });
  };

  const currentSpeaker = ({ speaker }: { speaker: string }) => {
    myStream.current.getTracks().forEach((track) => {
      myUser.user_id === speaker ? (track.enabled = true) : (track.enabled = false);
    });
  };

  const endSpeaker = () => {
    myStream.current.getTracks().forEach((track) => {
      track.enabled = false;
    });
  };

  useEffect(() => {
    socket.on('someone joined', connectToNewUser);
    socket.on('rtc exit', removeUserRtc);
    socket.on('rtc disconnect', removeUserRtc);
    socket.on('current speaker', currentSpeaker);
    socket.on('end speak', endSpeaker);

    myPeerRef.current = new Peer(undefined, {
      host: '/',
      port: 5001,
    });
    myPeerRef.current?.on('open', initRtc);
    myPeerRef.current?.on('call', answerToUser);

    return () => {
      socket.off('someone joined', connectToNewUser);
      socket.off('rtc exit', removeUserRtc);
      socket.off('rtc disconnect', removeUserRtc);
      socket.off('current speaker', currentSpeaker);
      socket.off('end speak', endSpeaker);

      myPeerRef.current?.off('open', initRtc);
      myPeerRef.current?.off('call', answerToUser);
      Object.entries(calls.current).forEach(([peerId, call]) => {
        call.close();
      });
    };
  }, []);

  return (
    <div className="game-talk">
      <div className="audio-wrap">
        {users.map((user) => (
          <GameTalkAudio key={user.peerId} userId={user.peerId} stream={user.stream} isMe={user.isMe} />
        ))}
      </div>
    </div>
  );
};

export default GameTalk;
