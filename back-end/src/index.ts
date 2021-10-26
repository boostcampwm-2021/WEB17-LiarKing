import express from 'express';
import morgan from 'morgan';

import 'reflect-metadata';
import { createConnection } from 'typeorm';

import IndexRouter from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', IndexRouter);

const port = Number(process.env.PORT || 3000);

createConnection()
  .then(() => {
    console.log('database connected');
    app.listen(port, () => {
      console.log('server start', port);
    });
  })
  .catch((error) => console.log(error));
