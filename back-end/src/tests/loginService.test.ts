import loginService from '../database/service/loginService';
import { User } from '../database/entity/User';
import connection from '../database/connection';

describe('loginVerify test', () => {
  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  test('should return user object', async () => {
    const id: string = 'testid1';
    const password: string = 'testpw1';

    expect(await loginService.loginVerify(id, password)).toBeTruthy();
  });
});
