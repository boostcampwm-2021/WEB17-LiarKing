import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import 'reflect-metadata';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import socketUtil from './utils/socket';
import connection from './database/connection';
import { ExpressPeerServer } from 'peer';
import userRouter from './route/userRouter';
import indexRouter from './route/indexRouter';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
  path: '/socket',
});

socketUtil(io);

app.use('/peerjs', ExpressPeerServer(httpServer));
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
app.use('/api/users', userRouter);
app.use('/api', indexRouter);
app.use(express.static(path.join(__dirname, '../build')));

if (process.env.NODE_ENV !== 'test') {
  connection.create().then(() => {
    console.log('database connected');
    httpServer.listen(5000, () => {
      console.log('server start');
    });
  });
}

export default app;
