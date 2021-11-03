import '../styles/LoginButton.css';
import { useState, useContext } from 'react';
import { ModalContext } from '../App';

const LoginModal = () => {
  const [userInfo, setUserInfo] = useState({ id: '', pwd: '' });
  const popModal = useContext(ModalContext);

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
    const data = await fetch('/login', options);
    const user = await data.json(); // user = false 일 경우 오류 메시지 모달창
  };

  return (
    <div className="main-login-modal">
      <div className="main-login-header">Account Login</div>
      <input className="main-login-id-password" type="text" placeholder="아이디를 입력하세요." onInput={changeId}></input>
      <input className="main-login-id-password" type="password" placeholder="비밀번호를 입력하세요." onInput={changePwd}></input>
      <button className="main-login-submit" onClick={requestToServer}>
        Let's start lying...!
      </button>
    </div>
  );
};

const LoginButton = () => {
  const [modal, setModal] = useState([]);

  const onModal = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setModal([ModalOutLocation, <LoginModal key={1} />]);
  };

  const offModal = () => {
    setModal([]);
  };

  return (
    <>
      <button className="main-common-button main-login-button" onClick={onModal}>
        {'로그인 하고 플레이!'}
      </button>
      {modal}
    </>
  );
};

export default LoginButton;
