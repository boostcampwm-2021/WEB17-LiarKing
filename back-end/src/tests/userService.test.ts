import { getRepository } from 'typeorm';
import { User } from '../database/entity/User';
import userService from '../database/service/userService';

describe('getUsersRanks test', () => {
  test('success (get top 5 users)', async () => {
    const ranks = await userService.getUsersRanks();
    expect(ranks).toHaveLength(5);
  });
});

describe('signUpUser test', () => {
  test('success (sign up)', async () => {
    const user = await userService.signUpUser('signupid1', 'signuppw1');
    await getRepository(User).delete({ user_id: 'signupid1' });
    expect(user).toBeTruthy();
  });

  test('fail (sign up)', async () => {
    const user = await userService.signUpUser('testid1', 'testpw1');
    expect(user).toBeFalsy();
  });
});

describe('getUserInfo', () => {
  test('success (get user Info)', async () => {
    const user = await userService.getUserInfo('asdfasdf');
    expect(user).toBeTruthy();
  });
});
