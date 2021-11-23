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
  if (user) {
    delete user.password;
  }

  return user;
}

async function getUsersRanks() {
  try {
    const userRepository = getRepository(User);
    const users: Array<User> = await userRepository.query(
      'SELECT user_id, point, dense_rank() over (order by point desc) as ranking from user limit 5'
    );

    return users;
  } catch (error) {
    console.error(error);
  }
}

async function updateUserPoint(userData: User, point: number) {
  const userRepository = getRepository(User);
  userData.point = point;
  await userRepository.manager.save(userData);
}

export default {
  signUpUser,
  getUserInfo,
  getUsersRanks,
  updateUserPoint,
};
