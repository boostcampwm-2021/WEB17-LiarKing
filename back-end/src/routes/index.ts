import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';

const indexRouter = Router();

indexRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('index.html');
  }
);

export default indexRouter;
