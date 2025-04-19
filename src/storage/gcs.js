const { Storage } = require('@google-cloud/storage');
const path = require('path');

async function upload(opts, filePath) {
  // opts.keyFilename, opts.projectId, opts.bucket, opts.key
  const storage = new Storage({ keyFilename: opts.keyFilename, projectId: opts.projectId });
  const bucket = storage.bucket(opts.bucket);
  const destination = opts.key || path.basename(filePath);
  await bucket.upload(filePath, { destination });
  return { location: `gs://${opts.bucket}/${destination}` };
}

module.exports = { upload };