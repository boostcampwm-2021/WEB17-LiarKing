import '../styles/LoginButton.css';

const loginModal = () => {
  const hiddenModal = document.querySelector('.main-login-modal-hidden');
  if (hiddenModal !== null) hiddenModal.className = 'main-login-modal';
};

const LoginButton = () => {
  return (
    <>
      <button className="main-login-button" onClick={loginModal}></button>
      <form className="main-login-modal-hidden" action="/users/id-check" method="GET">
        <div className="main-login-header">아이디</div>
        <input className="main-login-id-password" type="text" name="id" placeholder="아이디를 입력하세요."></input>
        <div className="main-login-header">비밀번호</div>
        <input className="main-login-id-password" type="text" name="password" placeholder="비밀번호를 입력하세요."></input>
        <input className="main-login-submit" type="submit" value="Let's start lying...!"></input>
      </form>
    </>
  );
};

export default LoginButton;
