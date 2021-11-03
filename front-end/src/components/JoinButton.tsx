import '../styles/JoinButton.css';
import { useState, useContext } from 'react';
import { globalContext } from '../App';
import { useHistory } from 'react-router';

const JoinModal = () => {
  const [userInfo, setUserInfo] = useState({ id: '', pwd: '', pwdCheck: '' });
  const history = useHistory();
  const { popModal, user } = useContext(globalContext);

  const changeId = (e: any) => {
    setUserInfo({ ...userInfo, id: e.target.value });
  };

  const changePwd = (e: any) => {
    setUserInfo({ ...userInfo, pwd: e.target.value });
  };

  const changePwdCheck = (e: any) => {
    setUserInfo({ ...userInfo, pwdCheck: e.target.value });
  };

  const clickPlay = async () => {
    const idValidation = checkId(userInfo.id);

    if (!idValidation) {
      popModal('error', '아이디는 영문자 대, 소, 숫자로만 이루어진 5~20글자만 허용됩니다.');
      return;
    }

    const pwValidation = checkPW(userInfo.pwd);

    if (!pwValidation) {
      popModal('error', '비밀번호는 영문자 대, 소, 숫자, 특수문자로만 이루어진 8~20글자만 허용됩니다.');
      return;
    }

    const pwMatchValidation = checkMatchPW(userInfo.pwd, userInfo.pwdCheck);

    if (!pwMatchValidation) {
      popModal('error', '비밀번호가 맞지 않습니다.');
      return;
    }

    const userData = await requestToServer();

    if (!userData) {
      popModal('error', '이미 만들어진 아이디입니다.');
      return;
    }

    Object.assign(user, userData);
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
    const data = await fetch('/users', options);
    const user = await data.json(); // return [object: 유저정보 | false: 아이디 중복]

    return user;
  };

  return (
    <div className="main-join-modal">
      <div className="main-join-header">Member Join</div>
      <input className="main-join-id-password" type="text" placeholder="아이디를 입력하세요." onInput={changeId}></input>
      <input className="main-join-id-password" type="password" placeholder="비밀번호를 입력하세요." onInput={changePwd}></input>
      <input className="main-join-id-password" type="password" placeholder="비밀번호를 확인해주세요." onInput={changePwdCheck}></input>
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
