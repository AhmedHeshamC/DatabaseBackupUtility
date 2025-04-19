const fs = require('fs');
const path = require('path');

async function upload(opts, filePath) {
  const dest = opts.dst || opts.out || path.basename(filePath);
  const destPath = path.resolve(dest);
  await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
  await fs.promises.copyFile(filePath, destPath);
  return { location: destPath };
}

module.exports = { upload };