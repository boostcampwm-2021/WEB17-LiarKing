import '../styles/Main.css';
import NoLoginButton from './NoLoginButton';
import LoginButton from './LoginButton';
import JoinButton from './JoinButton';
import React from 'react';

const Main = () => {
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
