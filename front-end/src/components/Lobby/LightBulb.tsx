import React, { useState, useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import '../../styles/LightBulb.css';
import blinkingEyes from '../../images/blinkingEyes.gif';

const CONSTANTS = {
  TOGGLE_CLASSNAME: 'off',
  BULB_STATEMENT: 'Click me!',
  EYE_INTERVAL_TIME: 3000,
};

const LightBulb = () => {
  const wrapper = useRef();
  const bulb = useRef();
  const filaments = useRef();
  const eyes = useRef();
  const [eyePosition, setEyePosition] = useState([Math.floor(Math.random() * 80), Math.floor(Math.random() * 80)]);
  const [bulbState, setBulbState] = useRecoilState(globalAtom.lobbyBulb);

  const bulbOnOff = () => {
    const changeBulbState = bulbState.bulbState ? false : true;
    setBulbState({ bulbState: changeBulbState });
    (wrapper.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
    (bulb.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
    (filaments.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
    (eyes.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
  };

  useEffect(() => {
    const changeBulbState = bulbState.bulbState;
    if (!bulbState.bulbState) bulbOnOff();
    setBulbState({ bulbState: changeBulbState });

    const eyeInterval = setInterval(() => {
      setEyePosition([Math.floor(Math.random() * 80), Math.floor(Math.random() * 80)]);
    }, CONSTANTS.EYE_INTERVAL_TIME);
    return () => {
      clearInterval(eyeInterval);
    };
  }, []);

  return (
    <>
      <div className="light-bulb-wrapper" ref={wrapper}></div>
      <div className="light-bulb-container">
        <div className="light-bulb" ref={bulb} onClick={bulbOnOff}>
          {bulbState.bulbState ? '' : CONSTANTS.BULB_STATEMENT}
          <div className="light-bulb-filaments" ref={filaments}></div>
        </div>
      </div>
      <img className="blinking-eyes-in-dark" src={blinkingEyes} ref={eyes} style={{ top: eyePosition[0] + 'vh', left: eyePosition[1] + 'vw' }}></img>
    </>
  );
};

export default React.memo(LightBulb);
