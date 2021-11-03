import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import path from 'path';

import userRouter from './routes/userRoute';
import indexRouter from './routes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use(express.static(path.join(__dirname, '../build')));

const port = Number(process.env.PORT || 5000);

createConnection()
  .then(() => {
    console.log('database connected');
    app.listen(port, () => {
      console.log('server start', port);
    });
  })
  .catch((error) => console.log(error));
