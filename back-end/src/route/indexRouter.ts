import { Router, Request, Response, NextFunction } from 'express';
import { nicknameList, idList } from '../store/store';
import loginService from '../database/service/loginService';
import userService from '../database/service/userService';

const indexRouter = Router();

indexRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.body.id;
    const password = req.body.password;

    if (idList.includes(id)) {
      res.json({ state: 'duplicated' });
    } else {
      const result = await loginService.loginVerify(id.toString(), password.toString());
      if (result !== false) {
        req.session['uid'] = result;
        idList.push(result['user_id']);
        res.json({ state: 'success', data: result });
      } else {
        res.json({ state: 'mismatch' });
      }
    }
  } catch (error) {
    console.error(error);
  }
});

indexRouter.post('/non-login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nickname = req.body.nickname;
    const result = await userService.getUserInfo(nickname);

    if (nicknameList.filter((_nickname) => _nickname === nickname).length === 0 && !result && !result) {
      req.session['nickname'] = nickname;
      nicknameList.push(nickname);
      res.json({ state: 'success' });
    } else if (result) {
      res.json({ state: 'user exist' });
    } else {
      res.json({ state: 'non-user logged in' });
    }
  } catch (error) {
    console.error(error);
  }
});

indexRouter.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body['user_id'];
    if (userId) {
      idList.splice(idList.indexOf(userId), idList.indexOf(userId) + 1);
      nicknameList.splice(nicknameList.indexOf(userId), nicknameList.indexOf(userId) + 1);
      req.session.destroy(function () {
        res.json(true);
      });
    } else {
      res.json(false);
    }
  } catch (error) {
    console.error(error);
  }
});

export default indexRouter;
