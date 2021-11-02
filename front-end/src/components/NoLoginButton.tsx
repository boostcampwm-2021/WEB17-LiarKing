import '../styles/NoLoginButton.css';

const noLoginModal = () => {
  const hiddenModal = document.querySelector('.main-no-login-modal-hidden');
  if (hiddenModal !== null) hiddenModal.className = 'main-no-login-modal';
};

const NoLoginButton = () => {
  return (
    <>
      <button className="main-common-button main-no-login-button" onClick={noLoginModal}>
        {'로그인 없이 플레이!'}
      </button>
      <form className="main-no-login-modal-hidden" action="/users/nickname-check" method="GET">
        <div className="main-no-login-header">Join Game</div>
        <input className="main-no-login-nickname" type="text" name="nickname" placeholder="닉네임을 입력하세요."></input>
        <input className="main-no-login-submit" type="submit" value="Let's start lying...!"></input>
      </form>
    </>
  );
};

export default NoLoginButton;
