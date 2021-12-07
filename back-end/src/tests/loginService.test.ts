import loginService from '../database/service/loginService';

const userId = 'testid1';
const userPassword = 'testpw1';

describe('loginVerify', () => {
  test('success', async () => {
    const id: string = userId;
    const password: string = userPassword;
    const response = await loginService.loginVerify(id, password);

    expect(response).toBeTruthy();
  });

  test('fail', async () => {
    const id: string = userId;
    const password: string = userPassword + '111';
    const response = await loginService.loginVerify(id, password);

    expect(response).toBeFalsy();
  });
});
