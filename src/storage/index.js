const local = require('./local');
const s3 = require('./s3');
const gcs = require('./gcs');
const azure = require('./azure');

function getStorage(type) {
  switch (type) {
    case 'local': return local;
    case 's3': return s3;
    case 'gcs': return gcs;
    case 'azure': return azure;
    default: throw new Error(`Unsupported storage type: ${type}`);
  }
}

module.exports = { getStorage };