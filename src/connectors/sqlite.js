const sqlite3 = require('sqlite3').verbose();

module.exports = {
  connect: async (opts) => {
    // filename or database path
    const dbFile = opts.filename || opts.database;
    return new sqlite3.Database(dbFile);
  },
  test: async (opts) => {
    const db = await module.exports.connect(opts);
    return new Promise((resolve, reject) => {
      db.get('SELECT 1', (err) => {
        db.close();
        err ? reject(err) : resolve();
      });
    });
  },
  dump: async (opts, outStream) => {
    // TODO: read file and pipe to outStream
  },
  restore: async (opts, inStream) => {
    // TODO: write incoming SQL or file data to database file
  },
  diffBackup: async (opts, since, outStream) => {
    // TODO: implement differential backup logic based on file timestamp or WAL
  },
};