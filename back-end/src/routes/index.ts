import { Router, Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

const indexRouter = Router();

indexRouter.get(
  "/hello",
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);

    const userList = await userRepository.find();

    res.json(userList);
  }
);

indexRouter.post(
  "/hello",
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);

    const user = new User();
    user.githubId = "test2";

    const result = await userRepository.save(user);
    res.json(result);
  }
);

export default indexRouter;
