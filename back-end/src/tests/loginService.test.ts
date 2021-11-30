import loginService from '../database/service/loginService';

describe('loginVerify test', () => {
  test('success (correct id and password)', async () => {
    const id: string = 'testid1';
    const password: string = 'testpw1';
    const response = await loginService.loginVerify(id, password);

    expect(response).toBeTruthy();
  });

  test('fail (incorrect id and password)', async () => {
    const id: string = 'testid11111111';
    const password: string = 'testpw1';
    const response = await loginService.loginVerify(id, password);

    expect(response).toBeFalsy();
  });
});
