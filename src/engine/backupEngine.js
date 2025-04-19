// src/engine/backupEngine.js
const connectors = require('../connectors');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { createEncryptor } = require('../security/encryption');
// const compressors = require('../compressors');
// const storage = require('../storage');
// const metadata = require('./metadata');

/**
 * Dispatch backup based on type
 */
async function runBackup(opts) {
  switch (opts.type) {
    case 'full':
      return runFullBackup(opts);
    case 'incremental':
      return runIncrementalBackup(opts);
    case 'differential':
      return runDifferentialBackup(opts);
    default:
      throw new Error(`Unknown backup type: ${opts.type}`);
  }
}

/**
 * Perform a full backup workflow
 */
async function runFullBackup(opts) {
  const connector = connectors[opts.db];
  if (!connector) throw new Error(`Unsupported db type: ${opts.db}`);

  // determine output path
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = opts.out || `${opts.db}_full_${timestamp}.sql` + (opts.compress === 'zip' ? '.zip' : '.gz') + (opts.encryptKey ? '.enc' : '');
  const outPath = path.resolve(filename);

  // prepare streams
  const fileStream = fs.createWriteStream(outPath);
  const gzip = zlib.createGzip();

  let finalizeEncryption = () => Promise.resolve();
  if (opts.encryptKey) {
    const encryptor = createEncryptor(opts.encryptKey, fileStream);
    gzip.pipe(encryptor.stream);
    finalizeEncryption = () => encryptor.finalize();
  } else {
    gzip.pipe(fileStream);
  }

  // perform dump into gzip stream
  await connector.dump(opts, gzip);

  // finalize encryption if used
  await finalizeEncryption();

  // finalize and wait for finish
  await new Promise((resolve, reject) => {
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });

  console.log(`Full backup completed: ${outPath}`);
}

/**
 * Perform an incremental backup workflow
 */
async function runIncrementalBackup(opts) {
  // TODO: implement incremental backup: changes since last full
}

/**
 * Perform a differential backup workflow
 */
async function runDifferentialBackup(opts) {
  // TODO: implement differential backup: changes since last snapshot
}

module.exports = {
  runBackup,
};