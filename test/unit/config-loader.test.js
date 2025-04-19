const path = require('path');
const { loadConfig } = require('../../src/config/loader');

describe('Config Loader', () => {
  it('loads defaults and overrides via env', async () => {
    process.env.DB_HOST = '127.0.0.1';
    process.env.STORAGE_TYPE = 's3';
    const cfg = await loadConfig();
    expect(cfg.db.host).toBe('127.0.0.1');
    expect(cfg.storage.type).toBe('s3');
  });

  it('loads from YAML file and validates schema', async () => {
    const file = path.resolve(__dirname, 'fixtures/sample-config.yaml');
    const cfg = await loadConfig(file);
    expect(cfg.db.database).toBe('testdb');
  });
});