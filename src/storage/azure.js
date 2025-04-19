const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const path = require('path');

async function upload(opts, filePath) {
  // opts.container or opts.bucket, opts.blobName or opts.key, credentials via opts or env
  let blobServiceClient;
  if (opts.connectionString) {
    blobServiceClient = BlobServiceClient.fromConnectionString(opts.connectionString);
  } else {
    const account = opts.accountName;
    const key = opts.accountKey;
    const credential = new StorageSharedKeyCredential(account, key);
    const url = `https://${account}.blob.core.windows.net`;
    blobServiceClient = new BlobServiceClient(url, credential);
  }
  const containerName = opts.container || opts.bucket;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobName = opts.blobName || opts.key || path.basename(filePath);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadFile(filePath);
  return { location: `https://${blobServiceClient.accountName}.blob.core.windows.net/${containerName}/${blobName}` };
}

module.exports = { upload };