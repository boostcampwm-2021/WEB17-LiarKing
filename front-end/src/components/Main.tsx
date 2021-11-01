import NoLoginButton from './NoLoginButton';
import LoginButton from './LoginButton';
import JoinButton from './JoinButton';
import '../styles/Main.css';

const Main = () => {
    return (
        <div id="main">
            <div className="main-header">Liar Game</div>
            <NoLoginButton />
            <LoginButton />
            <JoinButton />
        </div>
    );
}

export default Main;