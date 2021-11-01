import { Router, Request, Response, NextFunction } from 'express';
import userService from '../service/userService';

const userRouter = Router();

userRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.id;
    const password = req.body.password;
    const result = await userService.registerUser(id, password);
    res.json(result);
  }
);

export default userRouter;
