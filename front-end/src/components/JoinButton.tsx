import '../styles/JoinButton.css';
import { useState, useContext } from 'react';
import { ModalContext } from '../App';

const JoinModal = () => {
  const [userInfo, setUserInfo] = useState({ id: '', pwd: '', pwdCheck: '' });

  const changeId = (e: any) => {
    setUserInfo({ ...userInfo, id: e.target.value });
  };

  const changePwd = (e: any) => {
    setUserInfo({ ...userInfo, pwd: e.target.value });
  };

  const changePwdCheck = (e: any) => {
    setUserInfo({ ...userInfo, pwdCheck: e.target.value });
  };

  const requestToServer = async () => {
    if (userInfo['pwd'] !== userInfo['pwdCheck']) return; // 오류 메시지 모달창

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
    const data = await fetch('/users', options);
    const user = await data.json(); // user = false 일 경우 오류 메시지 모달창
  };

  return (
    <div className="main-join-modal">
      <div className="main-join-header">Member Join</div>
      <input className="main-join-id-password" type="text" placeholder="아이디를 입력하세요." onInput={changeId}></input>
      <input className="main-join-id-password" type="password" placeholder="비밀번호를 입력하세요." onInput={changePwd}></input>
      <input className="main-join-id-password" type="password" placeholder="비밀번호를 확인해주세요." onInput={changePwdCheck}></input>
      <button className="main-join-submit" onClick={requestToServer}>
        Join!
      </button>
    </div>
  );
};

const JoinButton = () => {
  const [modal, setModal] = useState([]);

  const onModal = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setModal([ModalOutLocation, <JoinModal key={1} />]);
  };

  const offModal = () => {
    setModal([]);
  };

  return (
    <>
      <button className="main-join-button" onClick={onModal}>
        {'회원 가입'}
      </button>
      {modal}
    </>
  );
};

export default JoinButton;
