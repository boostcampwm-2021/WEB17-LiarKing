import '../../styles/NoLoginButton.css';
import React, { useState, useContext } from 'react';
import { globalContext } from '../../App';
import { useHistory } from 'react-router';
import setModal from '../../utils/setModal';
import { useSetRecoilState } from 'recoil';
import globalAtom from '../../recoilStore/globalAtom';

/**
 * 비로그인 모달 컴포넌트
 * @returns Component
 */
const NoLoginModal = () => {
  const [userInfo, setUserInfo] = useState({ nickname: '' });
  const setModalState = useSetRecoilState(globalAtom.modal);
  const history = useHistory();
  const { user } = useContext(globalContext);

  const popModal = (type: 'alert' | 'warning' | 'error', ment: string) => {
    setModal(setModalState, { type, ment });
  };

  const changeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ nickname: e.target.value });
  };

  const clickPlay = async () => {
    const idValidation = checkId(userInfo.nickname);

    if (!idValidation) {
      popModal('error', '아이디는 영문자 대, 소, 숫자로만 이루어진 5~20글자만 허용됩니다.');
      return;
    }

    const idServerCheck = await requestToServer();

    if (!idServerCheck) {
      popModal('error', '현재 사용중인 아이디 입니다.');
      return;
    }

    Object.assign(user, { user_id: userInfo.nickname, point: 0, rank: 'unranked' });
    history.push('/lobby');
  };

  const checkId = (id: string): boolean => {
    const reg = /[a-zA-Z0-9]{5,20}/g;
    return reg.test(id);
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

    const data = await fetch('/api/non-login', options);
    const user = await data.json(); // return Boolean, true: 아이디 사용가능, false: 아이디 중복

    return user;
  };

  return (
    <div className="main-no-login-modal">
      <div className="main-no-login-header">Join Game</div>
      <input className="main-no-login-nickname" type="text" placeholder="닉네임을 입력하세요." onInput={changeId}></input>
      <button className="main-no-login-submit" onClick={clickPlay}>
        Let's start lying...!
      </button>
    </div>
  );
};

/**
 * 비로그인 버튼 컴포넌트
 * @returns 컴포넌트
 */
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
