import React, { useState, useEffect, useRef } from 'react';
import '../styles/JoinButton.css';

const JoinModal = () => {
  const hiddenModal = document.querySelector('.main-join-modal-hidden');
  if (hiddenModal !== null) hiddenModal.className = 'main-join-modal';
};

const JoinButton = () => {
  const [pwdInfo, setPwdInfo] = useState({ pwd: '', pwdCheck: '' });

  const changePwd = (e: any) => {
    setPwdInfo({ ...pwdInfo, pwd: e.target.value });
  };

  const changePwdCheck = (e: any) => {
    setPwdInfo({ ...pwdInfo, pwdCheck: e.target.value });
  };

  const checkPwd = (e: any) => {
    if (pwdInfo['pwd'] !== pwdInfo['pwdCheck']) {
      e.preventDefault();
    }
  };

  return (
    <>
      <button className="main-join-button" onClick={JoinModal}>
        {'회원 가입'}
      </button>
      <form className="main-join-modal-hidden" onSubmit={checkPwd} action="/users" method="POST">
        <div className="main-join-header">Member Join</div>
        <input className="main-join-id-password" type="text" name="id" placeholder="아이디를 입력하세요."></input>
        <input className="main-join-id-password" type="password" name="password" placeholder="비밀번호를 입력하세요." onInput={changePwd}></input>
        <input className="main-join-id-password" type="password" placeholder="비밀번호를 확인해주세요." onInput={changePwdCheck}></input>
        <input className="main-join-submit" value="Join!" type="submit"></input>
      </form>
    </>
  );
};

export default JoinButton;
