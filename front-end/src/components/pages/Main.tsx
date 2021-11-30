import '../../styles/Main.css';
import NoLoginButton from '../Main/NoLoginButton';
import LoginButton from '../Main/LoginButton';
import JoinButton from '../Main/JoinButton';
import React, { useEffect } from 'react';

const Main = () => {
  useEffect(() => {
    const main = document.querySelector<HTMLElement>('#main');
    main.style.height = window.innerHeight.toString() + 'px';

    window.addEventListener('orientationchange', function () {
      main.style.height = window.innerWidth.toString() + 'px';
    });
  });

  return (
    <div id="main">
      <div className="main-header">Liar Game</div>
      <div className="main-center">
        <div id="main-character-left" />
        <div className="main-buttons">
          <NoLoginButton />
          <LoginButton />
          <JoinButton />
        </div>
        <div id="main-character-right" />
      </div>
    </div>
  );
};

export default React.memo(Main);
