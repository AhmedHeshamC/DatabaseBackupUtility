const connectors = require('../connectors');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { createDecryptor } = require('../security/encryption');

async function runRestore(opts) {
  const connector = connectors[opts.db];
  if (!connector) throw new Error(`Unsupported db type: ${opts.db}`);

  // resolve backup file path
  const filePath = path.resolve(opts.file);
  let inStream = fs.createReadStream(filePath);

  // handle decryption if key provided
  if (opts.decryptKey) {
    inStream = inStream.pipe(createDecryptor(opts.decryptKey));
  }

  // handle gzip-compressed SQL
  if (filePath.endsWith('.gz') || filePath.endsWith('.gz.enc')) {
    const gunzip = zlib.createGunzip();
    inStream = inStream.pipe(gunzip);
  }
  // TODO: add zip or other formats support

  // perform restore via connector
  await connector.restore(opts, inStream);
  console.log(`Restore completed from ${filePath}`);
}

module.exports = { runRestore };