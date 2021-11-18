import React, { useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import '../../styles/LightBulb.css';

const CONSTANTS = {
  TOGGLE_CLASSNAME: 'off',
};

const LightBulb = () => {
  const wrapper = useRef();
  const bulb = useRef();
  const filaments = useRef();
  const [bulbState, setBulbState] = useRecoilState(globalAtom.lobbyBulb);

  const bulbOnOff = () => {
    const changeBulbState = bulbState.bulbState ? false : true;
    setBulbState({ bulbState: changeBulbState });
    (wrapper.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
    (bulb.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
    (filaments.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
  };

  useEffect(() => {
    const changeBulbState = bulbState.bulbState;
    if (!bulbState.bulbState) bulbOnOff();
    setBulbState({ bulbState: changeBulbState });
  }, []);

  return (
    <>
      <div className="light-bulb-wrapper" ref={wrapper}></div>
      <div className="light-bulb-container">
        <div className="light-bulb" ref={bulb} onClick={bulbOnOff}>
          Click me!
          <div className="light-bulb-filaments" ref={filaments}></div>
        </div>
      </div>
    </>
  );
};

export default React.memo(LightBulb);
