const mysql = require('mysql2/promise');

module.exports = {
  connect: async (opts) => {
    // TODO: establish connection using opts.host, opts.port, opts.user, opts.password
    return mysql.createConnection({
      host: opts.host,
      port: opts.port,
      user: opts.user,
      password: opts.password,
      database: opts.database,
      ssl: opts.tls ? { rejectUnauthorized: false } : undefined
    });
  },
  test: async (opts) => {
    const conn = await module.exports.connect(opts);
    await conn.execute('SELECT 1');
    await conn.end();
  },
  dump: async (opts, outStream) => {
    // TODO: stream mysqldump via child_process or mysqljs dump library
  },
  restore: async (opts, inStream) => {
    // TODO: pipe SQL from inStream into mysql connection
  },
  diffBackup: async (opts, since, outStream) => {
    // TODO: implement differential backup logic
  },
};