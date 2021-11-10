import { Router, Request, Response, NextFunction } from 'express';
import userService from '../database/service/userService';

const userRouter = Router();

userRouter.get('/ranks', async (req: Request, res: Response, next: NextFunction) => {
  const result = await userService.getUsersRanks();
  res.json(result);
});

userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { id, password } = req.body;
  const result = await userService.signUpUser(id, password);

  if (result !== false) {
    req.session['uid'] = result;
  }

  res.json(result);
});

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const result = await userService.getUserInfo(id.toString());
  if (result) res.json(result);
  else res.json(false);
});

userRouter.get('/data', async (req: Request, res: Response, next: NextFunction) => {
  const data = req.session['uid'] ? req.session['uid'] : { user_id: req.session['nickname'], point: 0, rank: 'Unranked' };
  res.json(data);
});

export default userRouter;
