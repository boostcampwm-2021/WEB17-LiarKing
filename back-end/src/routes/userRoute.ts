import { Router, Request, Response, NextFunction } from 'express';
import userService from '../service/userService';

const userRouter = Router();

userRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, password, nickname } = req.body;
    const result = await userService.signUpUser(id, password, nickname);
    res.json(result);
  }
);

userRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await userService.getUserInfo(id);
    res.json(result);
  }
);

export default userRouter;
