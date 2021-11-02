import { getRepository } from 'typeorm';
import { User } from '../entity/User';

async function findUser(id: string) {
  const userRepository = getRepository(User);
  const foundOne = await userRepository.findOne({ user_id: id });

  return foundOne;
}

export default {
  findUser,
};
