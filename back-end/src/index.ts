import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import FileStore from 'session-file-store';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection } from 'typeorm';

import userRouter from './routes/userRoute';
import indexRouter from './routes';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
var sessionFileStore = FileStore(session);
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    store: new sessionFileStore(),
  })
);
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
