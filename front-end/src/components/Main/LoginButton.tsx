import '../../styles/LoginButton.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useSetRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import { modalPropsType } from '../public/Modal';
import globalSelector from '../../recoilStore/globalSelector';
import { socket } from '../../utils/socketUtil';

const LoginModal = () => {
  const [userInfo, setUserInfo] = useState({ id: '', pwd: '' });
  const history = useHistory();
  const setUser = useSetRecoilState(globalAtom.user);
  const popModal: (modalProps: modalPropsType) => void = useSetRecoilState(globalSelector.popModal);

  const changeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, id: e.target.value });
  };

  const changePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, pwd: e.target.value });
  };

  const sendIfEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') clickPlay();
  };

  const clickPlay = async () => {
    if (!checkId(userInfo.id)) {
      popModal({ type: 'error', ment: '아이디를 다시 확인해 주세요.' });
      return;
    }

    if (!checkPW(userInfo.pwd)) {
      popModal({ type: 'error', ment: '비밀번호를 다시 확인해 주세요.' });
      return;
    }

    const userData = await requestToServer();
    if (userData.state === 'duplicated') {
      popModal({ type: 'error', ment: '이미 로그인되어 있습니다.' });
      return;
    } else if (userData.state === 'mismatch') {
      popModal({ type: 'error', ment: '아이디와 비밀번호가 맞지 않습니다.' });
      return;
    }

    setUser({ ...userData.data, socketId: socket.id });
    history.push('/lobby');
  };

  const checkId = (id: string): boolean => {
    const reg = /[a-zA-Z0-9]{5,20}/g;
    const regKo = /[가-힣]{2,10}/g;
    return reg.test(id) || regKo.test(id);
  };

  const checkPW = (pw: string): boolean => {
    const reg = /[a-zA-Z0-9!@#$%^&*-_=+]{8,20}/g;
    return reg.test(pw);
  };

  const requestToServer = async () => {
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
    const data = await fetch('/api/login', options);
    const user = await data.json(); // return [object: 유저정보 | false: 로그인 실패]

    return user;
  };

  return (
    <div className="main-login-modal">
      <div className="main-login-header">Account Login</div>
      <input className="main-login-id-password" type="text" placeholder="아이디를 입력하세요." onInput={changeId} onKeyDown={sendIfEnter}></input>
      <input
        className="main-login-id-password"
        type="password"
        placeholder="비밀번호를 입력하세요."
        onInput={changePwd}
        onKeyDown={sendIfEnter}
      ></input>
      <button className="main-login-submit" onClick={clickPlay}>
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
