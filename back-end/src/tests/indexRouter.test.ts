import request from 'supertest';
import app from '../index';

describe('POST /login test', () => {
  test('correct id and password', async () => {
    const response = await request(app).post('/api/login').send({
      id: 'testid1',
      password: 'testpw1',
    });
    expect(response.body.state).toBe('success');
  });

  test('incorrect id and password', async () => {
    const response = await request(app).post('/api/login').send({
      id: 'testid11111111',
      password: 'testpw1',
    });
    expect(response.body.state).toBe('mismatch');
  });

  test('same id already logged in', async () => {
    const response = await request(app).post('/api/login').send({
      id: 'testid1',
      password: 'testpw1',
    });
    expect(response.body.state).toBe('duplicated');
  });
});

describe('POST /non-login test', () => {
  test('success', async () => {
    const response = await request(app).post('/api/non-login').send({
      nickname: 'test-non-login',
    });
    expect(response.body.state).toBe('success');
  });

  test('same id exists in user database', async () => {
    const response = await request(app).post('/api/non-login').send({
      nickname: 'test-non-login',
    });
    expect(response.body.state).toBe('non-user logged in');
  });

  test('already same nickname logged in', async () => {
    const response = await request(app).post('/api/non-login').send({
      nickname: 'asdasdasd',
    });
    expect(response.body.state).toBe('user exist');
  });
});

describe('POST /logout test', () => {
  test('login and logout success', async () => {
    await request(app).post('/api/login').send({
      id: 'testid1',
      password: 'testpw1',
    });
    const result = await request(app).post('/logout').send({ user_id: 'testid1' });
    expect(result).toBeTruthy();
  });

  test('non-login and logout success', async () => {
    await request(app).post('/api/non-login').send({
      nickname: 'test-non-login',
    });
    const result = await request(app).post('/logout').send({ user_id: 'test-non-login' });
    expect(result).toBeTruthy();
  });
});
