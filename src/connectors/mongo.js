const { MongoClient } = require('mongodb');

module.exports = {
  connect: async (opts) => {
    const uri = opts.uri || `mongodb://${opts.host}:${opts.port}`;
    const client = new MongoClient(uri, { useUnifiedTopology: true, tls: opts.tls });
    await client.connect();
    return client;
  },
  test: async (opts) => {
    const client = await module.exports.connect(opts);
    await client.db(opts.database).command({ ping: 1 });
    await client.close();
  },
  dump: async (opts, outStream) => {
    // TODO: use mongodump binary or MongoDB driver to stream BSON
  },
  restore: async (opts, inStream) => {
    // TODO: pipe BSON from inStream into mongorestore or driver
  },
  diffBackup: async (opts, since, outStream) => {
    // TODO: implement change stream based differential backup
  },
};