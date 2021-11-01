import { getRepository } from 'typeorm';
import { User } from '../entity/User';

async function registerUser(id: string, password: string) {
  const userRepository = getRepository(User);
  const user: User = new User();
  user.user_id = id;
  user.password = password;
  user.nickname = 'nickname';
  user.point = 100;

  const result = await userRepository.insert(user);

  return result;
}

export default {
  registerUser,
};
