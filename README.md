# Database Backup Utility

## 📦 Overview

This utility is a versatile command-line backup utility for multiple database engines (PostgreSQL, MySQL, MongoDB, SQLite) supporting:

- Full, incremental, and differential backups (full implemented)
- Gzip or ZIP compression
- AES-256-CBC encryption of backup archives
- Scheduling via cron-like syntax
- Local, AWS S3, Google Cloud Storage, and Azure Blob Storage sinks
- Slack notifications on success or failure
- Config file (YAML/JSON) + environment variable overrides

## 🛠️ Tech Stack

- **Runtime:** Node.js (>=14.x)
- **CLI framework:** [commander](https://www.npmjs.com/package/commander)
- **Configuration management:** [convict](https://github.com/mozilla/node-convict) + dotenv + yaml/js-yaml
- **Credentials storage:** [keytar](https://github.com/atom/node-keytar) for secure secret retrieval
- **Compression:** Node built-in `zlib` (gzip) + [archiver](https://www.npmjs.com/package/archiver) (ZIP)
- **Encryption:** Custom AES-256-CBC via `crypto` API
- **Database drivers:**
  - PostgreSQL: [pg](https://www.npmjs.com/package/pg)
  - MySQL: [mysql2](https://www.npmjs.com/package/mysql2)
  - MongoDB: [mongodb](https://www.npmjs.com/package/mongodb)
  - SQLite: [sqlite3](https://www.npmjs.com/package/sqlite3)
- **Cloud SDKs:**
  - AWS: [@aws-sdk/client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3)
  - GCP: [@google-cloud/storage](https://www.npmjs.com/package/@google-cloud/storage)
  - Azure: [@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob)
- **Logging:** [pino](https://www.npmjs.com/package/pino)
- **Testing:** [jest](https://www.npmjs.com/package/jest) + [testcontainers](https://www.npmjs.com/package/testcontainers)
- **Scheduler:** [node-cron](https://www.npmjs.com/package/node-cron)

## 🚀 Installation

```bash
# Clone the repo
git clone https://github.com/your-org/dbackup.git
cd dbackup

# Install dependencies
npm install

# Link CLI globally (optional)
npm link
```

## 📝 Configuration

dbackup reads settings from environment variables, a `.env` file, or a YAML/JSON config file.

### Sample `backup-config.yaml`
```yaml
# Database connection
 db:
   host: localhost
   port: 5432            # use 3306 for MySQL
   user: myuser
   password: mypass      # or use keytar-secret via 'secret:service'
   database: mydb

# Storage location
 storage:
   type: local           # local | s3 | gcs | azure
   bucket:                   # bucket/container name for cloud
   region:
   keyFilename:             # GCS key file
   projectId:
   accountName:             # Azure
   accountKey:
   connectionString:

# Notification
 notify:
   slackWebhook: ''      # optional Slack webhook URL
```

Run validation and view effective config:
```bash
dbackup config --config ./backup-config.yaml --validate --show
```

## 💾 Usage

All commands share the global flags:
```text
  -c, --config <path>   path to config file (YAML/JSON)
  -v, --verbose         enable verbose logging
      --dry-run         simulate actions without changes
      --tls             enable TLS/SSL for DB connections
```

### 1. Backup

Create a full dump (gzip + optional encryption):
```bash
# Direct CLI args
dbackup backup \
  --db postgres \
  --host localhost --port 5432 \
  --user myuser --password mypass \
  --out ./pg_full_$(date +%Y%m%d).sql.gz \
  --type full               # full | incremental | differential
```

With config file and AES encryption:
```bash
dbackup backup \
  --config ./backup-config.yaml \
  --db mysql \
  --encrypt-key <hex-string> \
  --out ./mysql_enc.sql.gz.enc
```

### 2. Restore (coming soon)

```bash
dbackup restore \
  --db postgres --host … --port … --user … --password … \
  --in ./pg_full.sql.gz
```

### 3. Schedule

Define recurring backups via cron syntax:
```bash
dbackup schedule \
  --db sqlite \
  --cron "0 2 * * *" \
  --out ./snapshots/
```

Schedules persist in a local SQLite scheduler database. Use `dbackup schedule --help` for details.

## 🌐 Storage Targets

- **Local disk** (default)
- **AWS S3:** configure via `STORAGE_BUCKET` + `AWS_*` env variables
- **Google Cloud Storage:** supply `GCS_KEYFILE` + `GCS_PROJECT`
- **Azure Blob:** `AZURE_ACCOUNT` + `AZURE_KEY` or `AZURE_CONN`

## 🔐 Encryption

Specify a 32‑byte hex key:
```bash
dbackup backup … --encrypt-key $(openssl rand -hex 32)
```

Internally uses AES‑256‑CBC. Encrypted files have extension `.enc`.

## 🧪 Testing

```bash
# Run all tests
npm test

# E2E with real containers:
npm test -- test/e2e/backup-restore.e2e.test.js
```

## 📂 Project Structure

```text
src/
 ├── cli/               # command definitions
 ├── commands/          # backup, restore, schedule, config
 ├── connectors/        # per‑engine dump/restore logic
 ├── engine/            # orchestrates backup/restore workflows
 ├── compressors/       # zip, gzip
 ├── storage/           # local, S3, GCS, Azure
 ├── security/          # encryption
 ├── scheduler/         # cron persistence
 └── config/loader.js   # convict loader

test/                  # unit, integration, e2e
```
## Project URLs

- [GitHub](https://github.com/AhmedHeshamC/DatabaseBackupUtility)
- https://roadmap.sh/projects/database-backup-utility

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Write tests
4. Submit a PR

Please adhere to the existing code style and coverage requirements.

---

© 2025 Ahmed Hesham. MIT License.