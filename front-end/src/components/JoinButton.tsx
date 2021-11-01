import React, { useState, useEffect, useRef } from 'react';
import '../styles/JoinButton.css';

const JoinModal = () => {
  const hiddenModal = document.querySelector('.main-join-modal-hidden');
  if (hiddenModal !== null) hiddenModal.className = 'main-join-modal';
};

const JoinButton = () => {
  // const userId = useRef();
  // const pwd = useRef();
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
      <button className="main-join-button" onClick={JoinModal}></button>
      <form className="main-join-modal-hidden" onSubmit={checkPwd} action="/users" method="POST">
        <div className="main-join-header">아이디</div>
        <input className="main-join-id-password" type="text" name="id" placeholder="아이디를 입력하세요."></input>
        <div className="main-join-header join-password">비밀번호</div>
        <input className="main-join-id-password" type="password" name="password" placeholder="비밀번호를 입력하세요." onInput={changePwd}></input>
        <div className="main-join-header join-password-check">비밀번호 확인</div>
        <input className="main-join-id-password" type="password" placeholder="비밀번호를 확인해주세요." onInput={changePwdCheck}></input>
        <input className="main-join-submit" value="회원가입" type="submit"></input>
      </form>
    </>
  );
};

export default JoinButton;
