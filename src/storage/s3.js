const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

async function upload(opts, filePath) {
  // opts.bucket, opts.key, opts.region, credentials via env or opts
  const client = new S3Client({ region: opts.region });
  const stream = fs.createReadStream(filePath);
  const params = {
    Bucket: opts.bucket,
    Key: opts.key || path.basename(filePath),
    Body: stream
  };
  await client.send(new PutObjectCommand(params));
  return { location: `s3://${params.Bucket}/${params.Key}` };
}

module.exports = { upload };