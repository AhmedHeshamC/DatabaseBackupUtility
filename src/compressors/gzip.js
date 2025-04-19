const zlib = require('zlib');

function createGzip(_, outStream) {
  const gzip = zlib.createGzip();
  gzip.pipe(outStream);
  return { stream: gzip, finalize: () => Promise.resolve() };
}

module.exports = { createGzip };