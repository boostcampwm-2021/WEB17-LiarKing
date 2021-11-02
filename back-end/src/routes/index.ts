import { Router, Request, Response, NextFunction } from 'express';
import nicknameList from '../store/store';
import commonService from '../service/commonService';

const indexRouter = Router();

indexRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.send('index.html');
});

indexRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const id = req.body.id;
  const password = req.body.password;
  const result = await commonService.findUser(id.toString());

  if (result === undefined) {
    res.json(false);
  } else if (password !== result.password) {
    res.json(false);
  } else {
    req.session['uid'] = result.id;
    res.json(result);
  }
});

indexRouter.post('/non-login', async (req: Request, res: Response, next: NextFunction) => {
  const nickname = req.body.nickname;

  if (nicknameList.filter((_nickname) => _nickname === nickname).length === 0) {
    res.json(true);
  } else {
    res.json(false);
  }
});

export default indexRouter;
