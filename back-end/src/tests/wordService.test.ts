import { getRandomWords } from '../database/service/wordService';

describe('getRandomWords test', () => {
  test('success (get word array of 15 length)', async () => {
    const result = await getRandomWords('스포츠');
    expect(result).toHaveLength(15);
  });
});
