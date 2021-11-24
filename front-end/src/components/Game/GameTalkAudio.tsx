import { useRef, useEffect } from 'react';

const GameTalkAudio = ({ userId, stream, isMe }: { userId: string; stream: MediaStream; isMe: boolean }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, []);

  return <video className="game-audio" ref={ref} muted={isMe} autoPlay playsInline width="100"></video>;
};

export default GameTalkAudio;
