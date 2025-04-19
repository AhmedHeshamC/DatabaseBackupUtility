const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const convict = require('convict');
const dotenv = require('dotenv');
const keytar = require('keytar');

// load .env variables
dotenv.config();

// define configuration schema
const schema = {
  db: {
    host: { doc: 'DB host', format: String, default: 'localhost', env: 'DB_HOST' },
    port: { doc: 'DB port', format: 'port', default: 0, env: 'DB_PORT' },
    user: { doc: 'DB user', format: String, default: '', env: 'DB_USER' },
    password: { doc: 'DB password', format: String, default: '', env: 'DB_PASSWORD', sensitive: true },
    database: { doc: 'DB name', format: String, default: '', env: 'DB_NAME' }
  },
  storage: {
    type: { doc: 'Storage type', format: ['local','s3','gcs','azure'], default: 'local', env: 'STORAGE_TYPE' },
    bucket: { doc: 'Cloud bucket/container name', format: String, default: '', env: 'STORAGE_BUCKET' },
    region: { doc: 'Cloud region', format: String, default: '', env: 'STORAGE_REGION' },
    keyFilename: { doc: 'GCS key file', format: String, default: '', env: 'GCS_KEYFILE' },
    projectId: { doc: 'GCS project', format: String, default: '', env: 'GCS_PROJECT' },
    accountName: { doc: 'Azure account name', format: String, default: '', env: 'AZURE_ACCOUNT' },
    accountKey: { doc: 'Azure account key', format: String, default: '', env: 'AZURE_KEY', sensitive: true },
    connectionString: { doc: 'Azure connection string', format: String, default: '', env: 'AZURE_CONN' }
  },
  notify: {
    slackWebhook: { doc: 'Slack webhook URL', format: String, default: '', env: 'SLACK_WEBHOOK', sensitive: true }
  }
};

/**
 * Load and merge config file (YAML/JSON) and env then validate
 * @param {string} filePath - path to config file
 */
async function loadConfig(filePath) {
  // initialize env and config
  dotenv.config();
  const config = convict(schema);
  // load file if provided
  if (filePath && fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const raw = fs.readFileSync(filePath, 'utf-8');
    const obj = ext === '.json' ? JSON.parse(raw) : yaml.load(raw);
    config.load(obj);
  }
  // decrypt sensitive values that start with 'secret:'
  const all = config.getProperties();
  Object.keys(all).forEach(section => {
    Object.entries(all[section]).forEach(async ([key, val]) => {
      if (typeof val === 'string' && val.startsWith('secret:')) {
        const service = `${section}:${key}`;
        const secret = await keytar.getPassword(service, val.slice(7));
        config.set(`${section}.${key}`, secret);
      }
    });
  });
  // validate and return properties
  config.validate({ allowed: 'strict' });
  return config.getProperties();
}

module.exports = { loadConfig };