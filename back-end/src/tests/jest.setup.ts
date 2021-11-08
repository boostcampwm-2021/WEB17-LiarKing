import connection from '../database/connection';

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  await connection.close();
});
