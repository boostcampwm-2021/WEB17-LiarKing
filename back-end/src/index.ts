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

import { roomList } from './store/store';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000' },
});

io.on('connection', (socket) => {
  console.log('socket connected');
  socket.join('lobby');
  socket.emit('room list', roomList);
  console.log('join lobby');
  console.log('생성 전 room list', io.sockets.adapter.rooms);
  socket.on('room create', function (data) {
    socket.leave('lobby');
    console.log(data);
    const roomTitle = data.title;
    roomList.set(roomTitle, data);
    io.to('lobby').emit('room list', JSON.stringify(Array.from(roomList)));
    socket.join(roomTitle);
    socket.emit('room create', data);
    //socket.broadcast.emit('lobby', roomList);

    console.log('생성 후 room list', io.sockets.adapter.rooms);
    const clients = io.sockets.adapter.rooms.get(roomTitle);
    console.log('방이름', roomTitle, '유저', clients);
  });

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
