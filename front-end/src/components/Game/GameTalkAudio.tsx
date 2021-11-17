import React, { useRef, useState, useEffect } from 'react';

const GameTalkAudio = ({ stream, muted }: { stream: MediaStream; muted: boolean }) => {
  const ref = useRef(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
    if (muted) setIsMuted(muted);
  });

  return <video className="game-audio" ref={ref} muted={isMuted} autoPlay playsInline width="0"></video>;
};

export default GameTalkAudio;
