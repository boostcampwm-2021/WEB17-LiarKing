import request from 'supertest';
import app from '../index';

describe('POST /login test', () => {
  test('correct id and password', async () => {
    const response = await request(app).post('/api/login').send({
      id: 'testid1',
      password: 'testpw1',
    });

    expect(response.body).toBeTruthy();
  });

  test('incorrect id and password', async () => {
    const response = await request(app).post('/api/login').send({
      id: 'testid11111111',
      password: 'testpw1',
    });

    expect(response.body).toBeFalsy();
  });
});
