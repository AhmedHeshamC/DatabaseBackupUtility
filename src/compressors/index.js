// src/compressors/index.js
const { createGzip } = require('./gzip');
const { createZip } = require('./zip');

function getCompressor(type) {
  switch (type) {
    case 'gzip': return createGzip;
    case 'zip': return createZip;
    default: throw new Error(`Unsupported compressor: ${type}`);
  }
}

module.exports = { getCompressor };