import { createConnection, getConnection } from 'typeorm';

const connection = {
  async create() {
    await createConnection();
  },

  async close() {
    await getConnection().close();
  },
};

export default connection;
