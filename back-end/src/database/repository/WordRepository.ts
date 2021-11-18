import { EntityRepository, Repository } from 'typeorm';
import { Word } from '../entity/Word';

@EntityRepository()
export class WordRepository extends Repository<Word> {}
