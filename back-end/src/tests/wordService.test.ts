import { getRandomWords } from '../database/service/wordService';

describe('getRandomWords', () => {
  test('success', async () => {
    const result = await getRandomWords('스포츠');
    expect(result).toHaveLength(15);
  });
});
