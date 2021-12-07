import { getRepository } from 'typeorm';
import { User } from '../database/entity/User';
import userService from '../database/service/userService';

const userId = 'testid1';
const userPassword = 'testpw1';
const newUserId = 'newtestid1';
const newUserPassword = 'newtestpw1';

describe('getUsersRanks', () => {
  test('success', async () => {
    const ranks = await userService.getUsersRanks();
    expect(ranks).toBeGreaterThan(1);
  });
});

describe('signUpUser', () => {
  test('success', async () => {
    const user = await userService.signUpUser(newUserId, newUserPassword);
    await getRepository(User).delete({ user_id: newUserId });
    expect(user).toBeTruthy();
  });

  test('fail', async () => {
    const user = await userService.signUpUser(userId, userPassword);
    expect(user).toBeFalsy();
  });
});

describe('getUserInfo', () => {
  test('success', async () => {
    const user = await userService.getUserInfo(userId);
    expect(user).toBeTruthy();
  });
});
