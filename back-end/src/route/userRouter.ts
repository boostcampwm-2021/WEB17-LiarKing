import { Router, Request, Response, NextFunction } from 'express';
import userService from '../database/service/userService';

const userRouter = Router();

const CONSTANTS = {
  ADD_TWENTY: '20점 추가',
  ADD_TEN: '10점 추가',
  SUBTRACT_TEN: '10점 차감',
};

userRouter.post('/updatePoint', async (req: Request, res: Response, next: NextFunction) => {
  const userData = await userService.getUserInfo(req.body.id);

  let point;
  if (req.body.point === CONSTANTS.SUBTRACT_TEN) point = userData.point > 10 ? userData.point - 10 : 0;
  else if (req.body.point === CONSTANTS.ADD_TEN) point = userData.point + 10;
  else if (req.body.point === CONSTANTS.ADD_TWENTY) point = userData.point + 20;

  userService.updateUserPoint(userData, point);
});

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
