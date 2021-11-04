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
  console.log('connect id:', socket.id);

  socket.join('lobby');

  socket.on('room list', function () {
    socket.emit('room list', Array.from(roomList));
  });

  socket.on('room create', function (data) {
    socket.leave('lobby');

    const roomTitle = data.title;

    if (!roomList.get(roomTitle)) {
      roomList.set(roomTitle, Object.assign(data, { client: [] }));

      io.to('lobby').emit('room list', Array.from(roomList));

      socket.join(roomTitle);
    } else {
      data = false;
    }

    socket.emit('room create', data);
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
  })
  .catch((error) => console.log(error));
