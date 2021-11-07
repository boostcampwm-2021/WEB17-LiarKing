import request from 'supertest';
import app from '../index';
import connection from '../database/connection';

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  await connection.close();
});

describe('POST /login', () => {
  test('correct id and password', async () => {
    const response = await request(app).post('/login').send({
      id: 'testid1',
      password: 'testpw1',
    });

    expect(response.body).toBeTruthy();
  });

  test('incorrect id and password', async () => {
    const response = await request(app).post('/login').send({
      id: 'testid11111111',
      password: 'testpw1',
    });

    expect(response.body).toBeFalsy();
  });
});
