import userService from '../database/service/userService';

describe('GET /users/ranks', () => {
  test('get top 5 users', async () => {
    const ranks = await userService.getUsersRanks();
    expect(ranks).toHaveLength(5);
  });
});
