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

  let pcs: { [toSocketId: string]: RTCPeerConnection };
  let localStream: MediaStream;

  const pc_config = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  };

  const init = async () => {
    await registerSocketHandler();

    await getUserMedia();

    await startConnect();
  };

  const registerSocketHandler = async () => {
    socket.on(RTC_MESSAGE.OFFER, async ({ sdp, fromSocketId }) => {
      createPeerConnection(socket.id, fromSocketId, localStream);
      await createAnswer(sdp, socket.id, fromSocketId);
    });

    socket.on(RTC_MESSAGE.ANSWER, async ({ sdp, fromSocketId }) => {
      let pc: RTCPeerConnection = pcs[fromSocketId];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });

    socket.on(RTC_MESSAGE.CANDIDATE, async ({ candidate, fromSocketId }) => {
      let pc: RTCPeerConnection = pcs[fromSocketId];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  };

  const getUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideo.current.srcObject = stream;

    localStream = stream;
  };

  const startConnect = async () => {
    const clientsExceptMe = clients.filter((c) => c.socketId != socket.id);

    await Promise.all(
      clientsExceptMe.map((c) => {
        createPeerConnection(socket.id, c.socketId, localStream);
        return createOffer(socket.id, c.socketId);
      })
    );
  };

  const createPeerConnection = (fromSocketId: string, toSocketId: string, localStream: MediaStream) => {
    let pc = new RTCPeerConnection(pc_config);

    pcs = { ...pcs, [toSocketId]: pc };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('rtc candidate', {
          candidate: e.candidate,
          fromSocketId,
          toSocketId,
        });
      }
    };

    pc.ontrack = (e) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== toSocketId));
      setUsers((prevUsers) => [...prevUsers, { id: toSocketId, stream: e.streams[0] }]);
    };

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }
  };

  const createOffer = async (fromSocketId: string, toSocketId: string) => {
    let pc: RTCPeerConnection = pcs[toSocketId];
    if (pc) {
      const sdp = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      pc.setLocalDescription(new RTCSessionDescription(sdp));
      socket.emit('rtc offer', {
        sdp,
        fromSocketId,
        toSocketId,
      });
    }
  };

  const createAnswer = async (sdp: RTCSessionDescription, fromSocketId: string, toSocketId: string) => {
    let pc: RTCPeerConnection = pcs[toSocketId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const sdpAnswer = await pc.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      pc.setLocalDescription(new RTCSessionDescription(sdpAnswer));
      socket.emit('rtc answer', {
        sdp,
        fromSocketId,
        toSocketId,
      });
    }
  };

  useEffect(() => {
    init();

    return () => {
      socket.off('rtc offer');
      socket.off('rtc answer');
      socket.off('rtc candidate');
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
