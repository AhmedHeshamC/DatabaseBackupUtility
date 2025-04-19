const sqliteConnector = require('../../src/connectors/sqlite');

describe('SQLite Connector Integration', () => {
  it('should connect and run test query on in-memory DB', async () => {
    const config = { filename: ':memory:' };
    await expect(sqliteConnector.test(config)).resolves.not.toThrow();
  });
});