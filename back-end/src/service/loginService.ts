import { getRepository } from 'typeorm';
import { User } from '../entity/User';

async function loginVerify(id: string, password: string) {
  const userRepository = getRepository(User);
  const foundOne = await userRepository.findOne({ user_id: id });

  if (foundOne.user_id === id && foundOne.password === password) {
    return { user_id: foundOne.user_id };
  }
  return false;
}

export default {
  loginVerify,
};
