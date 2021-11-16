import React, { useState, useContext, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { globalContext } from '../../App';
import { RTC_MESSAGE } from '../../utils/constants';

type clientType = { name: string; state: string; socketId: string };

const Video = ({ stream, muted }: { stream: MediaStream; muted: boolean }) => {
  const ref = useRef(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
    if (muted) setIsMuted(muted);
  });

  return <video ref={ref} muted={isMuted} autoPlay playsInline width="360"></video>;
};

const GameTalk = ({ clients }: { clients: clientType[] }) => {
  const { socket }: { socket: Socket } = useContext(globalContext);
  const [users, setUsers] = useState([]);

  const localVideo = useRef<HTMLVideoElement>(null);

  let pcs: { [toSocketId: string]: RTCPeerConnection } = {};
  let localStream: MediaStream;

  const pcConfig = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      { urls: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' },
    ],
  };

  const init = async () => {
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
      const pc: RTCPeerConnection = pcs[fromSocketId];
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on(RTC_MESSAGE.CANDIDATE, async ({ candidate, fromSocketId }) => {
      let pc: RTCPeerConnection = pcs[fromSocketId];
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

    localVideo.current.srcObject = stream;

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

    pcs = { ...pcs, [toSocketId]: pc };

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
    let pc: RTCPeerConnection = pcs[toSocketId];
    if (pc) {
      const sdpOffer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
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
    let pc: RTCPeerConnection = pcs[toSocketId];
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

  useEffect(() => {
    init();

    return () => {
      socket.off(RTC_MESSAGE.OFFER);
      socket.off(RTC_MESSAGE.ANSWER);
      socket.off(RTC_MESSAGE.CANDIDATE);
    };
  }, []);

  return (
    <>
      <div>
        <video id="localVideo" playsInline autoPlay width="360" ref={localVideo}></video>
      </div>
      {users.map((user, index) => {
        return <Video key={index} stream={user.stream} muted={false}></Video>;
      })}
    </>
  );
};

export default GameTalk;
