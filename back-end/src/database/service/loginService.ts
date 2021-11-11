import { getRepository } from 'typeorm';
import { User } from '../entity/User';

async function loginVerify(id: string, password: string) {
  const userRepository = getRepository(User);
  const foundOne = await userRepository.findOne({ user_id: id });

  if (foundOne && foundOne.user_id === id && foundOne.password === password) {
    let rank;
    if (foundOne.point < 100) rank = 'Bronze';
    else if (foundOne.point < 200) rank = 'Silver';
    else if (foundOne.point < 300) rank = 'Gold';
    return { user_id: foundOne.user_id, point: foundOne.point, rank: rank };
  }

  return false;
}

export default {
  loginVerify,
};
