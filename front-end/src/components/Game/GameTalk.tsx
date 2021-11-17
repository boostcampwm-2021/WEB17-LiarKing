import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { globalContext } from '../../App';
import { RTC_MESSAGE, ROOM_MEESSAGE } from '../../utils/socketMsgConstants';
import GameTalkAudio from './GameTalkAudio';
import { clientsType } from '../../utils/typeDefinitions';
import { useRecoilValue } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';

const GameTalk = ({ clients }: { clients: clientsType[] }) => {
  const { socket }: { socket: Socket } = useContext(globalContext);
  const roomData = useRecoilValue(globalAtom.roomData);
  const [users, setUsers] = useState([]);
  const localAudio = useRef<HTMLVideoElement>(null);
  let localStream: MediaStream;
  let peerConnections: { [prop: string]: RTCPeerConnection } = {};
  const pcConfig = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      { urls: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' },
    ],
  };

  const initRTC = async () => {
    await registerSocketHandler();

    await setMyRTC();

    await startPeerConnection();
  };

  const registerSocketHandler = async () => {
    socket.on(RTC_MESSAGE.OFFER, async ({ sdp, fromSocketId }) => {
      createPeerConnection(socket.id, fromSocketId);
      await createAnswer(sdp, socket.id, fromSocketId);
    });

    socket.on(RTC_MESSAGE.ANSWER, async ({ sdp, fromSocketId }) => {
      const pc: RTCPeerConnection = peerConnections[fromSocketId];
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on(RTC_MESSAGE.CANDIDATE, async ({ candidate, fromSocketId }) => {
      let pc: RTCPeerConnection = peerConnections[fromSocketId];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  };

  const setMyRTC = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localAudio.current.srcObject = stream;

    localStream = stream;
  };

  const startPeerConnection = async () => {
    const clientsExceptMe = clients.filter((c) => c.socketId != socket.id);

    await Promise.all(
      clientsExceptMe.map((c) => {
        createPeerConnection(socket.id, c.socketId);
        return createOffer(socket.id, c.socketId);
      })
    );
  };

  const createPeerConnection = (fromSocketId: string, toSocketId: string) => {
    const pc = new RTCPeerConnection(pcConfig);

    peerConnections[toSocketId] = pc;

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit(RTC_MESSAGE.CANDIDATE, {
          candidate: e.candidate,
          fromSocketId,
          toSocketId,
        });
      }
    };

    pc.ontrack = (e) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== toSocketId));
      setUsers((prevUsers) => [...prevUsers, { id: toSocketId, stream: new MediaStream([e.track]) }]);
    };

    if (localStream) {
      localStream.getTracks().forEach((track) => pc.addTrack(track));
    }
  };

  const createOffer = async (fromSocketId: string, toSocketId: string) => {
    let pc: RTCPeerConnection = peerConnections[toSocketId];
    if (pc) {
      const sdpOffer = await pc.createOffer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      pc.setLocalDescription(new RTCSessionDescription(sdpOffer));
      socket.emit(RTC_MESSAGE.OFFER, {
        sdp: sdpOffer,
        fromSocketId,
        toSocketId,
      });
    }
  };

  const createAnswer = async (sdpOffer: RTCSessionDescription, fromSocketId: string, toSocketId: string) => {
    let pc: RTCPeerConnection = peerConnections[toSocketId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(sdpOffer));
      const sdpAnswer = await pc.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      pc.setLocalDescription(new RTCSessionDescription(sdpAnswer));
      socket.emit(RTC_MESSAGE.ANSWER, {
        sdp: sdpAnswer,
        fromSocketId,
        toSocketId,
      });
    }
  };

  const toggleAudio = useCallback(
    (event: any) => {
      localStream.getTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    },
    [localStream]
  );

  const sendMyTurn = (event: any) => {
    const roomTitle = roomData.selectedRoomTitle;
    socket.emit('myturn', { roomTitle });
  };

  useEffect(() => {
    initRTC();

    socket.on(ROOM_MEESSAGE.EXIT, ({ socketId }) => {
      if (peerConnections[socketId]) {
        peerConnections[socketId].close();
        delete peerConnections[socketId];
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== socketId));
    });

    socket.on('myturn', () => {
      localStream.getTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    });

    return () => {
      socket.off(RTC_MESSAGE.OFFER);
      socket.off(RTC_MESSAGE.ANSWER);
      socket.off(RTC_MESSAGE.CANDIDATE);
      socket.off(ROOM_MEESSAGE.EXIT);
      socket.off('myturn');
    };
  }, []);

  return (
    <div className="game-talk">
      <button onClick={toggleAudio}>나만끄기</button>
      <button onClick={sendMyTurn}>나빼고나머지꺼버리기</button>
      <div>
        <video className="game-audio" playsInline autoPlay width="100" ref={localAudio}></video>
      </div>
      {users.map((user, index) => {
        return <GameTalkAudio key={index} stream={user.stream}></GameTalkAudio>;
      })}
    </div>
  );
};

export default GameTalk;
