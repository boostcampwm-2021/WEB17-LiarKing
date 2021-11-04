import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

import userRouter from './routes/userRoute';
import indexRouter from './routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000' },
});

io.on('connection', (socket) => {
  console.log('server');

  socket.on('join room1', function (data) {
    socket.join('room1');
  });

  socket.on('join room2', function (data) {
    socket.join('room2');
  });

  socket.on('verify room1', function (data) {
    io.to('room1').emit('room1', 'room1 checked');
  });

  socket.on('verify room2', function (data) {
    io.to('room2').emit('room2', 'room2 checked');
  });

  // socket.on('send data', function (data) {
  //   console.log(data);
  //   io.to('room1').emit('joined');
  // });
});

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

const port = Number(process.env.PORT || 5000);

createConnection()
  .then(() => {
    console.log('database connected');
    /*app.listen(port, () => {
      console.log('server start', port);
    });*/
  })
  .catch((error) => console.log(error));
