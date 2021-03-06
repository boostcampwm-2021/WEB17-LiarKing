import '../../styles/GameTalk.css';
import Peer from 'peerjs';
import GameTalkAudio from './GameTalkAudio';
import { useEffect, useRef, useState } from 'react';
import socket from '../../utils/socketUtil';
import { useRecoilValue } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';

const GameTalk = () => {
  const myPeerRef = useRef<Peer>();
  const myPeerIdRef = useRef<string>();
  const myStream = useRef<MediaStream>();
  const [users, setUsers] = useState([]);
  const myUser = useRecoilValue(globalAtom.user);

  const initRtc = (id: string) => {
    myPeerIdRef.current = id;
    getUserMedia(id);
  };

  const getUserMedia = async (peerId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      myStream.current = stream;
      myStream.current?.getTracks().forEach((track) => {
        track.enabled = false;
      });

      setUsers((prev) => [...prev, { peerId, stream, isMe: true }]);

      socket.emit.I_JOINED({ peerId: myPeerIdRef.current });
      socket.emit.RTC_INFO({ state: true });
    } catch (error) {
      socket.emit.RTC_INFO({ state: false });
    }
  };

  const onCall = (call: Peer.MediaConnection, peerId: string) => {
    call?.on('stream', (stream: MediaStream) => {
      setUsers((prev) => {
        const user = prev.find((u) => u.peerId === peerId);
        if (!user) {
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
    call?.answer(myStream.current);
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
        return [...newUsers];
      } else {
        return [...prev];
      }
    });
  };

  const currentSpeaker = ({ speaker }: { speaker: string }) => {
    myStream.current?.getTracks().forEach((track) => {
      myUser.user_id === speaker ? (track.enabled = true) : (track.enabled = false);
    });
  };

  const endSpeaker = () => {
    myStream.current?.getTracks().forEach((track) => {
      track.enabled = false;
    });
  };

  useEffect(() => {
    socket.on.SOMEONE_JOINED({ fn: connectToNewUser });
    socket.on.RTC_DISCONNECT({ fn: removeUserRtc });
    socket.on.CURRENT_SPEAKER({ fn: currentSpeaker });
    socket.on.END_SPEAK({ fn: endSpeaker });

    if (process.env.NODE_ENV === 'development') {
      myPeerRef.current = new Peer(undefined, {
        host: process.env.REACT_APP_PEER_HOST,
        path: '/peerjs',
        port: Number(process.env.REACT_APP_PEER_PORT),
      });
    } else {
      myPeerRef.current = new Peer(undefined, {
        host: process.env.REACT_APP_PEER_HOST,
        path: '/peerjs',
      });
    }

    myPeerRef.current?.on('open', initRtc);
    myPeerRef.current?.on('call', answerToUser);

    return () => {
      socket.off.SOMEONE_JOINED();
      socket.off.RTC_DISCONNECT();
      socket.off.CURRENT_SPEAKER();
      socket.off.END_SPEAK();

      myPeerRef.current?.off('open', initRtc);
      myPeerRef.current?.off('call', answerToUser);

      myPeerRef.current.destroy();

      myStream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="game-talk">
      <div className="audio-wrap">
        {users.map((user) => (
          <GameTalkAudio key={user.peerId} stream={user.stream} isMe={user.isMe} />
        ))}
      </div>
    </div>
  );
};

export default GameTalk;
