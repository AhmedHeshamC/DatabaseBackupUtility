# DESIGN.md

## 1. Introduction
- Purpose: Define architecture, modules, interfaces, and workflows for a CLI database backup utility.
- Scope: Backup/restore operations, multi-DB support, scheduling, compression, storage (local/cloud), logging, notifications.

## 2. System Architecture
- CLI application orchestrating submodules.
- Plugin-based connectors for each DBMS.
- Storage adapters for local and cloud targets.
- Scheduler component for automated runs.
- Logging service and optional notifier.

## 3. Module Breakdown
1. **CLI Core**
   - Arg parsing (`--backup`, `--restore`, `--schedule`, `--config`).
   - Dispatch to commands and plugins.
2. **Connector Plugins**
   - MySQL, PostgreSQL, MongoDB, SQLite modules.
   - Interface: connect(), test(), dump(), restore(), diffBackup().
3. **Backup Engine**
   - Full, incremental, differential workflows.
   - Timestamp and metadata management.
4. **Compression Layer**
   - Pluggable compressors: gzip, zip.
   - Stream-based to minimize memory.
5. **Storage Adapters**
   - Local FS adapter.
   - AWS S3, GCS, Azure Blob Storage SDK wrappers.
6. **Scheduler**
   - Cron-like syntax.
   - Persistent job store (e.g., JSON or SQLite).
7. **Logging & Notifications**
   - Structured logs (timestamp, level, module, message).
   - Optional Slack/webhook notifier.
8. **Config Manager**
   - YAML/JSON config file support.
   - Secrets encryption for credentials.

## 4. CLI Interface
- Commands:
  - `backup --db mysql --host … --type full --out /path`
  - `restore --file backup.tar.gz --db postgres`
  - `schedule add --cron "0 2 * * *" --task backup`
  - `config validate`, `config show`
- Global flags: `--config`, `--verbose`, `--dry-run`

## 5. Database Connectivity & Error Handling
- Validate connection before operations.
- Retries with exponential backoff.
- Detailed error codes and user-friendly messages.

## 6. Backup Strategies
- Full: complete dump.
- Incremental: track and dump changes since last full.
- Differential: changes since last full snapshot.
- Metadata store for state management.

## 7. Compression & Storage
- Stream compress backup files on-the-fly.
- Multi-target push: local and then cloud.
- Retry and checksum verification.

## 8. Scheduling
- Job runner daemon or system service.
- Handles missed runs and overlapping tasks.
- Alert on failures.

## 9. Logging & Notifications
- Info, warning, error levels.
- Log rotation and retention policy.
- Slack/Webhook integration on success/failure.

## 10. Restore Operations
- Validate backup integrity.
- Support full restore, point-in-time, selective table/collection restore.
- Dry-run mode to preview impact.

## 11. Configuration Management
- Hierarchical overrides: CLI > env vars > config file.
- Profiles per environment (dev, staging, prod).
- Secure credential storage/encryption.

## 12. Security Considerations
- TLS for DB connections and cloud APIs.
- Encrypt backups at rest.
- Least-privilege IAM roles.

## 13. Testing Strategy
- Unit tests for modules.
- Integration tests against real DB instances (dockerized).
- End-to-end CLI test scenarios.

## 14. Deployment & Maintenance
- Packaged as a single binary or pip/npm package.
- Auto-update mechanism.
- Monitoring of storage usage.

## 15. Future Enhancements
- UI dashboard (web).
- Plugin marketplace for new DBs.
- Differential restore and data validation tools.

## 16. Implementation Tracking

- [x] CLI Core: Command-line parsing and dispatch
- [x] Connector Plugins: DBMS connectors (mysql, postgres, mongo, sqlite)
- [x] Backup Engine: Full, incremental, and differential workflows
- [x] Compression Layer: gzip and zip compressors
- [x] Storage Adapters: Local FS, AWS S3, GCS, Azure Blob
- [x] Scheduler: Cron scheduling and persistent job store
- [x] Logging & Notifications: Structured logs and Slack/webhook notifier
- [x] Config Manager: Config loading, profiles, and encrypted secrets
- [x] Restore Operations: Integrity checks and restore workflows
- [x] Security: TLS enforcement, encryption at rest, IAM roles
- [ ] Testing Strategy: Unit, integration, and end-to-end tests
- [ ] Deployment & Maintenance: Packaging, auto-update, monitoring