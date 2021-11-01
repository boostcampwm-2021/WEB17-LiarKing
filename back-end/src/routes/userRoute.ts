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

userRouter.get(
  '/id-check',
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.query.id;
    const password = req.query.password;
    const result = await userService.findUser(id.toString());

    if (result === undefined) {
      res.json(false);
    }
    else if (password !== result.password) {
      res.json(false);
    }
    else res.json(result);
  }
);

export default userRouter;
