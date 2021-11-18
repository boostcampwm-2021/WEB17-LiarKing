import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Word } from '../entity/Word';

export default class CreateWords implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const wordParse: Word[] = [];
    const wordData: { category: string; word: string[] }[] = require('./word.seed.json');

    wordData.forEach((v) => {
      const { category, word } = v;

      word.forEach((x) => {
        const wordEntity: Word = new Word();
        wordEntity.category = category;
        wordEntity.word = x;

        wordParse.push(wordEntity);
      });
    });

    await connection.getRepository(Word).save(wordParse);
  }
}
