import '../../styles/LoginButton.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useSetRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import setModal from '../../utils/setModal';

const LoginModal = () => {
  const [userInfo, setUserInfo] = useState({ id: '', pwd: '' });
  const history = useHistory();
  const setUser = useSetRecoilState(globalAtom.user);
  const setModalState = useSetRecoilState(globalAtom.modal);

  const popModal = (type: 'alert' | 'warning' | 'error', ment: string) => {
    setModal(setModalState, { type, ment });
  };

  const changeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, id: e.target.value });
  };

  const changePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, pwd: e.target.value });
  };

  const clickPlay = async () => {
    const idValidation = checkId(userInfo.id);

    if (!idValidation) {
      popModal('error', '아이디를 다시 확인해 주세요.');
      return;
    }

    const pwValidation = checkPW(userInfo.pwd);

    if (!pwValidation) {
      popModal('error', '비밀번호를 다시 확인해 주세요.');
      return;
    }

    const userData = await requestToServer();

    if (!userData) {
      popModal('error', '아이디와 비밀번호가 맞지 않습니다.');
      return;
    }

    setUser(userData);
    history.push('/lobby');
  };

  const checkId = (id: string): boolean => {
    const reg = /[a-zA-Z0-9]{5,20}/g;
    return reg.test(id);
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
      <input className="main-login-id-password" type="text" placeholder="아이디를 입력하세요." onInput={changeId}></input>
      <input className="main-login-id-password" type="password" placeholder="비밀번호를 입력하세요." onInput={changePwd}></input>
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
