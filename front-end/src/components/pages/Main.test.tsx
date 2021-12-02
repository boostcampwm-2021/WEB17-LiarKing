import { render, fireEvent } from '@testing-library/react';
import Main from './Main';

describe('Main test', () => {
  test('Main UI test', () => {
    const { getByText, getByRole } = render(<Main />);

    const logo = getByText('Liar Game');
    const noLoginButton = getByRole('button', { name: '로그인 없이 플레이!' });
    const LoginButton = getByRole('button', { name: '로그인 하고 플레이!' });
    const registerButton = getByRole('button', { name: '회원 가입' });

    expect(logo).toBeInTheDocument();
    expect(noLoginButton).toBeInTheDocument();
    expect(LoginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();

    fireEvent.click(noLoginButton);

    const noLoginModal = getByText('Join Game');

    fireEvent.click(LoginButton);

    const LoginModal = getByText('Account Login');

    fireEvent.click(registerButton);

    const registerModal = getByText('Member Join');

    expect(noLoginModal).toBeInTheDocument();
    expect(LoginModal).toBeInTheDocument();
    expect(registerModal).toBeInTheDocument();
  });
});
