import { useRef, useEffect } from 'react';

const GameTalkAudio = ({ stream }: { stream: MediaStream }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  });

  return <video className="game-audio" ref={ref} autoPlay playsInline width="100"></video>;
};

export default GameTalkAudio;
