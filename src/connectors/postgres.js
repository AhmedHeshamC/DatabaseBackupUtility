const { Client } = require('pg');

module.exports = {
  connect: async (opts) => {
    const client = new Client({
      host: opts.host,
      port: opts.port,
      user: opts.user,
      password: opts.password,
      database: opts.database,
      ssl: opts.tls ? { rejectUnauthorized: false } : undefined
    });
    await client.connect();
    return client;
  },
  test: async (opts) => {
    const client = await module.exports.connect(opts);
    await client.query('SELECT 1');
    await client.end();
  },
  dump: async (opts, outStream) => {
    // TODO: stream pg_dump via child_process or pg-copy-streams
  },
  restore: async (opts, inStream) => {
    // TODO: pipe SQL from inStream into postgres connection
  },
  diffBackup: async (opts, since, outStream) => {
    // TODO: implement differential backup logic
  },
};