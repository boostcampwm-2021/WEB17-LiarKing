import { Router, Request, Response, NextFunction } from 'express';
import { nicknameList } from '../store/store';
import loginService from '../database/service/loginService';
import path from 'path';

const indexRouter = Router();

indexRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const id = req.body.id;
  const password = req.body.password;
  const result = await loginService.loginVerify(id.toString(), password.toString());

  if (result !== false) {
    req.session['uid'] = result;
  }
  res.json(result);
});

indexRouter.post('/non-login', async (req: Request, res: Response, next: NextFunction) => {
  const nickname = req.body.nickname;

  if (nicknameList.filter((_nickname) => _nickname === nickname).length === 0) {
    req.session['nickname'] = nickname;
    nicknameList.push(nickname);
    res.json(true);
  } else {
    res.json(false);
  }
});

indexRouter.get('/test', async (req: Request, res: Response, next: NextFunction) => {
  res.json('test');
});

indexRouter.get('/*', async (req: Request, res: Response, next: NextFunction) => {
  const htmlPath = path.join(__dirname, '../../build/index.html');

  res.sendFile(htmlPath);
});

export default indexRouter;
