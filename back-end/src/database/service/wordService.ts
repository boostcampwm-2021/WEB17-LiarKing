import { getRepository } from 'typeorm';
import shuffle from '../../utils/shuffle';
import { Word } from '../entity/Word';

async function getRandomWords(category: string) {
  const wordRepository = getRepository(Word);
  const words: Word[] = await wordRepository.find({ category: category });

  return shuffle(
    words.map((v) => v.word),
    15
  );
}

export { getRandomWords };
