import express from 'express';
import morgan from 'morgan';

import 'reflect-metadata';
import { createConnection } from 'typeorm';

import userRouter from './routes/userRoute';
import indexRouter from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/', indexRouter);
app.use('/users', userRouter);

const port = Number(process.env.PORT || 5000);

createConnection()
  .then(() => {
    console.log('database connected');
    app.listen(port, () => {
      console.log('server start', port);
    });
  })
  .catch((error) => console.log(error));
