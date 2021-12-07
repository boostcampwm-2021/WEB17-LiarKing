import { getRepository } from 'typeorm';
import { User } from '../database/entity/User';
import request from 'supertest';
import app from '../index';

const userId = 'testid1';
const userPassword = 'testpw1';
const nickname = 'test-nickname';

describe('POST /user', () => {
  test('sign up', async () => {
    await getRepository(User).delete({ user_id: userId });
    const response = await request(app).post('/api/users').send({
      id: userId,
      password: userPassword,
    });
    expect(response.body['user_id']).toBe(userId);
  });
});

describe('POST /login', () => {
  test('correct id and password', async () => {
    const response = await request(app).post('/api/login').send({
      id: userId,
      password: userPassword,
    });
    expect(response.body.state).toBe('success');
  });

  test('incorrect id and password', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        id: userId + '111',
        password: userPassword,
      });
    expect(response.body.state).toBe('mismatch');
  });

  test('already logged in', async () => {
    const response = await request(app).post('/api/login').send({
      id: userId,
      password: userPassword,
    });
    expect(response.body.state).toBe('duplicated');
  });
});

describe('POST /non-login', () => {
  test('non-login', async () => {
    const response = await request(app).post('/api/non-login').send({
      nickname: nickname,
    });
    expect(response.body.state).toBe('success');
  });

  test('already logged in', async () => {
    const response = await request(app).post('/api/non-login').send({
      nickname: nickname,
    });
    expect(response.body.state).toBe('non-user logged in');
  });

  test('nickname exists in user database)', async () => {
    const response = await request(app).post('/api/non-login').send({
      nickname: userId,
    });
    expect(response.body.state).toBe('user exist');
  });
});

describe('POST /logout', () => {
  test('user logout', async () => {
    await request(app).post('/api/login').send({
      id: userId,
      password: userPassword,
    });
    const result = await request(app).post('/logout').send({ user_id: userId });
    expect(result).toBeTruthy();
  });

  test('non-user logout', async () => {
    await request(app).post('/api/non-login').send({
      nickname: nickname,
    });
    const result = await request(app).post('/logout').send({ user_id: nickname });
    expect(result).toBeTruthy();
  });
});
