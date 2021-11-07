import request from 'supertest';
import app from '../index';

describe('GET /test', () => {
  test('it should return "test"', async () => {
    const response = await request(app).get('/test');

    expect(response.statusCode).toBe(200);
  });
});
