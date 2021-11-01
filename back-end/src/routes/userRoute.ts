import { Router, Request, Response, NextFunction } from 'express';
import userService from '../service/userService';
import nicknameList from '../store/store';

const userRouter = Router();

userRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, password } = req.body;
    const result = await userService.signUpUser(id, password);
    res.json(result);
  }
);

userRouter.get(
  '/info/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await userService.findUser(id);
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
    } else if (password !== result.password) {
      res.json(false);
    } else res.json(result);
  }
);

userRouter.get(
  '/nickname-check',
  async (req: Request, res: Response, next: NextFunction) => {
    const nickname = req.query.nickname;

    if (
      nicknameList.filter((_nickname) => _nickname === nickname).length === 0
    ) {
      res.json(true);
    } else {
      res.json(false);
    }
  }
);

export default userRouter;
