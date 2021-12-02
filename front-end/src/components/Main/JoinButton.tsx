import '../../styles/JoinButton.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useSetRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';
import globalSelector from '../../recoilStore/globalSelector';
import { modalPropsType } from '../public/Modal';
import { socket } from '../../utils/socketUtil';

const JoinModal = () => {
  const [userInfo, setUserInfo] = useState({ id: '', pwd: '', pwdCheck: '' });
  const history = useHistory();
  const setUser = useSetRecoilState(globalAtom.user);
  const popModal: (modalProps: modalPropsType) => void = useSetRecoilState(globalSelector.popModal);

  const changeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, id: e.target.value });
  };

  const changePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, pwd: e.target.value });
  };

  const changePwdCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, pwdCheck: e.target.value });
  };

  const clickPlay = async () => {
    const idValidation = checkId(userInfo.id);

    if (!idValidation) {
      popModal({
        type: 'error',
        ment: '아이디는 한글 2~10글자, 또는 영어 대/소문자, 숫자로 이루어진 5~20글자만 허용됩니다.\n(모음, 자음만 있는 문자는 사용이 불가)',
      });
      return;
    }

    if (!checkPW(userInfo.pwd)) {
      popModal({ type: 'error', ment: '비밀번호는 영문자 대, 소, 숫자, 특수문자로만 이루어진 8~20글자만 허용됩니다.' });
      return;
    }

    if (!checkMatchPW(userInfo.pwd, userInfo.pwdCheck)) {
      popModal({ type: 'error', ment: '비밀번호가 맞지 않습니다.' });
      return;
    }

    const userData = await requestToServer();
    if (!userData) {
      popModal({ type: 'error', ment: '이미 만들어진 아이디입니다.' });
      return;
    }

    setUser({ ...userData, socketId: socket.id });
    history.push('/lobby');
  };

  const sendIfEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') clickPlay();
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

  const checkMatchPW = (pw: string, checkPwd: string): boolean => {
    return pw === checkPwd;
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
    const data = await fetch('/api/users', options);
    const user = await data.json(); // return [object: 유저정보 | false: 아이디 중복]

    return user;
  };

  return (
    <div className="main-join-modal">
      <div className="main-join-header">Member Join</div>
      <input className="main-join-id-password" type="text" placeholder="아이디를 입력하세요." onInput={changeId} onKeyDown={sendIfEnter}></input>
      <input
        className="main-join-id-password"
        type="password"
        placeholder="비밀번호를 입력하세요."
        onInput={changePwd}
        onKeyDown={sendIfEnter}
      ></input>
      <input
        className="main-join-id-password"
        type="password"
        placeholder="비밀번호를 확인해주세요."
        onInput={changePwdCheck}
        onKeyDown={sendIfEnter}
      ></input>
      <button className="main-join-submit" onClick={clickPlay}>
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
