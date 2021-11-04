import { getRepository } from 'typeorm';
import { User } from '../entity/User';

async function signUpUser(id: string, password: string) {
  const userRepository = getRepository(User);
  const user: User = new User();
  user.user_id = id;
  user.password = password;

  const check = await userRepository.findOne({ user_id: id });
  if (check) {
    return false;
  }
  const result = await userRepository.save(user);
  delete result.password;

  return Object.assign(result, { point: 0, rank: 'Bronze' });
}

async function getUserInfo(id: string) {
  const userRepository = getRepository(User);
  const user: User = await userRepository.findOne({ user_id: id });
  delete user.password;

  return user;
}

export default {
  signUpUser,
  getUserInfo,
};
