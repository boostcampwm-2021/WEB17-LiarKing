import { Router, Request, Response, NextFunction } from 'express';
import userService from '../service/userService';

const userRouter = Router();

userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { id, password } = req.body;
  const result = await userService.signUpUser(id, password);
  res.json(result);
});

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const result = await userService.getUserInfo(id.toString());
  res.json(result);
});

export default userRouter;
