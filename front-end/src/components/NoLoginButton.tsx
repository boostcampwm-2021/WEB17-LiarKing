import '../styles/NoLoginButton.css';
import { useState, useContext } from 'react';
import { ModalContext } from '../App';

const NoLoginModal = () => {
  const [userInfo, setUserInfo] = useState({ nickname: '' });
  const popModal = useContext(ModalContext);

  const changeId = (e: any) => {
    setUserInfo({ nickname: e.target.value });
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

    !user && popModal('error', '현재 사용중인 아이디 입니다.');
  };

  return (
    <div className="main-no-login-modal">
      <div className="main-no-login-header">Join Game</div>
      <input className="main-no-login-nickname" type="text" placeholder="닉네임을 입력하세요." onInput={changeId}></input>
      <button className="main-no-login-submit" onClick={requestToServer}>
        Let's start lying...!
      </button>
    </div>
  );
};

const NoLoginButton = () => {
  const [modal, setModal] = useState([]);

  const onModal = () => {
    const ModalOutLocation = <section className="modal-outter" onClick={offModal} key={0} />;
    setModal([ModalOutLocation, <NoLoginModal key={1} />]);
  };

  const offModal = () => {
    setModal([]);
  };

  return (
    <>
      <button className="main-common-button main-no-login-button" onClick={onModal}>
        {'로그인 없이 플레이!'}
      </button>
      {modal}
    </>
  );
};

export default NoLoginButton;
