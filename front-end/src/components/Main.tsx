import '../styles/Main.css';
import NoLoginButton from './NoLoginButton';
import LoginButton from './LoginButton';
import JoinButton from './JoinButton';
import React from 'react';
import { io } from 'socket.io-client';

window.onclick = (e) => {
  const noLoginModal = document.querySelector('.main-no-login-modal');
  const loginModal = document.querySelector('.main-login-modal');
  const joinModal = document.querySelector('.main-join-modal');
  if (e.target instanceof Element) {
    if (noLoginModal !== null && !e.target.closest('.main-no-login-modal') && !e.target.closest('.main-no-login-button'))
      noLoginModal.className = 'main-no-login-modal-hidden';
    if (loginModal !== null && !e.target.closest('.main-login-modal') && !e.target.closest('.main-login-button'))
      loginModal.className = 'main-login-modal-hidden';
    if (joinModal !== null && !e.target.closest('.main-join-modal') && !e.target.closest('.main-join-button'))
      joinModal.className = 'main-join-modal-hidden';
  }
};

const socket = io('http://localhost:5000');

const button1 = () => {
  console.log('방1 입장');
  socket.emit('join room1', 'room1');
};

const button2 = () => {
  console.log('방2 입장');
  socket.emit('join room2', 'room2');
};

const verify1 = () => {
  socket.emit('verify room1');
};

const verify2 = () => {
  socket.emit('verify room2');
};

socket.on('room1', function (data) {
  console.log(data);
});

socket.on('room2', function (data) {
  console.log(data);
});

const Main = () => {
  return (
    <div id="main">
      <button onClick={button1}>방1 입장</button>
      <button onClick={button2}>방2 입장</button>
      <button onClick={verify1}>확인 방1</button>
      <button onClick={verify2}>확인 방2</button>
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
