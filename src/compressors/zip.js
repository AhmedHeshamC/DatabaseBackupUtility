const archiver = require('archiver');

function createZip(opts, outStream) {
  const archive = archiver('zip', { zlib: { level: opts.level || 9 } });
  archive.pipe(outStream);
  return {
    stream: archive,
    finalize: () => archive.finalize()
  };
}

module.exports = { createZip };