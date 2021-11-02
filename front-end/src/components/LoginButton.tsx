import React, { useState } from 'react';
import '../styles/LoginButton.css';

const loginModal = () => {
  const hiddenModal = document.querySelector('.main-login-modal-hidden');
  if (hiddenModal !== null) hiddenModal.className = 'main-login-modal';
};

const LoginButton = () => {
  const [userInfo, setUserInfo] = useState({ id: '', pwd: '' });

  const changeId = (e: any) => {
    setUserInfo({ ...userInfo, id: e.target.value });
  };

  const changePwd = (e: any) => {
    setUserInfo({ ...userInfo, pwd: e.target.value });
  };

  const requestToServer = async (e: any) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userInfo['id'],
        password: userInfo['pwd'],
      }),
    };
    const data = await fetch('/users/id-check', options);
    const user = await data.json(); // user = false 일 경우 오류 메시지 모달창
    console.log(user);
  };

  return (
    <>
      <button className="main-common-button main-login-button" onClick={loginModal}>
        {'로그인 하고 플레이!'}
      </button>
      <div className="main-login-modal-hidden">
        <div className="main-login-header">Account Login</div>
        <input className="main-login-id-password" type="text" placeholder="아이디를 입력하세요." onInput={changeId}></input>
        <input className="main-login-id-password" type="password" placeholder="비밀번호를 입력하세요." onInput={changePwd}></input>
        <button className="main-login-submit" onClick={requestToServer}>
          Let's start lying...!
        </button>
      </div>
    </>
  );
};

export default LoginButton;
