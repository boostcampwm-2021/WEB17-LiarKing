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

indexRouter.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session['nickname']) {
      req.session.destroy(function () {
        res.json(true);
        const idx = nicknameList.indexOf(req.session['nickname']);
        nicknameList.slice(idx, idx + 1);
      });
    } else {
      res.json(false);
    }
  } catch (error) {
    console.error(error);
  }
});

export default indexRouter;
