import { useRef, useEffect } from 'react';
import '../../styles/LightBulb.css';

const CONSTANTS = {
  TOGGLE_CLASSNAME: 'off',
};

const LightBulb = () => {
  const wrapper = useRef();
  const bulb = useRef();
  const filaments = useRef();

  const bulbOnOff = () => {
    (wrapper.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
    (bulb.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
    (filaments.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
  };

  useEffect(() => {
    (wrapper.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
    (bulb.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
    (filaments.current as HTMLElement).classList.toggle(CONSTANTS.TOGGLE_CLASSNAME);
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

export default LightBulb;
