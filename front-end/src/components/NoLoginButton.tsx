import React, { useState } from 'react';
import '../styles/NoLoginButton.css';

const noLoginModal = () => {
  const hiddenModal = document.querySelector('.main-no-login-modal-hidden');
  if (hiddenModal !== null) hiddenModal.className = 'main-no-login-modal';
};

const NoLoginButton = () => {
  const [userInfo, setUserInfo] = useState({ nickname: '' });

  const changeId = (e: any) => {
    setUserInfo({ ...userInfo, nickname: e.target.value });
  };

  const requestToServer = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: userInfo['nickname'],
      }),
    };
    const data = await fetch('/non-login', options);
    const user = await data.json(); // user = false 일 경우 오류 메시지 모달창
  };

  return (
    <>
      <button className="main-common-button main-no-login-button" onClick={noLoginModal}>
        {'로그인 없이 플레이!'}
      </button>
      <div className="main-no-login-modal-hidden">
        <div className="main-no-login-header">Join Game</div>
        <input className="main-no-login-nickname" type="text" placeholder="닉네임을 입력하세요." onInput={changeId}></input>
        <button className="main-no-login-submit" onClick={requestToServer}>
          Let's start lying...!
        </button>
      </div>
    </>
  );
};

export default NoLoginButton;
