import React, { useState, useContext, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { Socket } from 'socket.io-client';
import { globalContext } from '../../App';
import globalAtom from '../../recoilStore/globalAtom';
import { RTC_MESSAGE } from '../../utils/constants';

const GameTalk = () => {
  const { socket }: { socket: Socket } = useContext(globalContext);
  const { selectedRoomTitle } = useRecoilValue(globalAtom.roomData);
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const pc_config = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  };

  const newPC = new RTCPeerConnection(pc_config);

  const init = async () => {
    socket.on('rtc offer', async (sdp: RTCSessionDescription) => {
      await createAnswer(sdp);
    });

    socket.on('rtc answer', async (sdp: RTCSessionDescription) => {
      await newPC.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on('rtc candidate', async (candidate: RTCIceCandidateInit) => {
      await newPC.addIceCandidate(new RTCIceCandidate(candidate));
    });

    await getUserMedia();
    await createOffer();
  };

  const getUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideo.current.srcObject = stream;

    stream.getTracks().forEach((track) => {
      newPC.addTrack(track, stream);
    });

    newPC.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('rtc candidate', { candidate: e.candidate, title: selectedRoomTitle });
      }
    };
    newPC.ontrack = (ev) => {
      remoteVideo.current.srcObject = ev.streams[0];
    };
  };

  const createOffer = async () => {
    const sdp = await newPC.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    await newPC.setLocalDescription(new RTCSessionDescription(sdp));
    socket.emit('rtc offer', { sdp, title: selectedRoomTitle });
  };

  const createAnswer = async (sdp: RTCSessionDescription) => {
    await newPC.setRemoteDescription(new RTCSessionDescription(sdp));
    const sdpAnswer = await newPC.createAnswer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
    await newPC.setLocalDescription(new RTCSessionDescription(sdpAnswer));
    socket.emit('rtc answer', { sdp: sdpAnswer, title: selectedRoomTitle });
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
        <video id="localVideo" playsInline autoPlay width="480px" ref={localVideo}></video>
        <video id="remoteVideo" playsInline autoPlay width="480px" ref={remoteVideo}></video>
      </div>
      <div>
        <button id="startButton">Start</button>
        <button id="callButton">Call</button>
        <button id="hangupButton">Hang Up</button>
      </div>
    </>
  );
};

export default GameTalk;
