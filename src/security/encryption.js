const crypto = require('crypto');
const { Transform } = require('stream');

/**
 * Create an encryptor that prefixes IV then pipes data through cipher into outStream.
 * @param {string} keyHex - encryption key as hex
 * @param {WritableStream} outStream
 */
function createEncryptor(keyHex, outStream) {
  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  // write IV prefix
  outStream.write(iv);
  cipher.pipe(outStream);
  return { stream: cipher, finalize: () => Promise.resolve() };
}

/**
 * Create a decryptor that reads IV prefix then pipes data through decipher
 * @param {string} keyHex - decryption key as hex
 */
function createDecryptor(keyHex) {
  const key = Buffer.from(keyHex, 'hex');
  let iv;
  let buffered = Buffer.alloc(0);
  let decipher;

  const transform = new Transform({
    transform(chunk, _, callback) {
      if (!decipher) {
        buffered = Buffer.concat([buffered, chunk]);
        if (buffered.length >= 16) {
          iv = buffered.slice(0, 16);
          decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
          const rest = buffered.slice(16);
          this.push(decipher.update(rest));
        }
        callback();
      } else {
        this.push(decipher.update(chunk));
        callback();
      }
    },
    flush(callback) {
      if (decipher) {
        this.push(decipher.final());
      }
      callback();
    }
  });

  return transform;
}

module.exports = { createEncryptor, createDecryptor };