import { useRef, useEffect } from 'react';

const GameTalkAudio = ({ stream, isMe }: { stream: MediaStream; isMe: boolean }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, []);

  return <video className="game-audio" ref={ref} muted={isMe} autoPlay playsInline width="0"></video>;
};

export default GameTalkAudio;
