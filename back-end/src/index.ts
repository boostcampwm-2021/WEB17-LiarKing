import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import socketUtil from './utils/socket';

import userRouter from './routes/userRoute';
import indexRouter from './routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

socketUtil(io);

httpServer.listen(5000);

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

createConnection()
  .then(() => {
    console.log('database connected');
  })
  .catch((error) => console.log(error));
