const backupEngine = require('../engine/backupEngine');

module.exports = (program) => {
  program.command('backup')
    .description('Run a backup for a specified database')
    .requiredOption('--db <type>', 'Database type (mysql, postgres, mongo, sqlite)')
    .option('--host <host>', 'Database host', 'localhost')
    .option('--port <port>', 'Database port')
    .option('--user <user>', 'Database user')
    .option('--password <password>', 'Database password')
    .option('--out <path>', 'Output backup file or directory')
    .option('--type <mode>', 'Backup mode (full|incremental|differential)', 'full')
    .option('--encrypt-key <hex>', 'AES-256-CBC encryption key in hex')
    .action(async (opts) => {
      try {
        await backupEngine.runBackup(opts);
      } catch (err) {
        console.error('Backup failed:', err.message);
        process.exit(1);
      }
    });
};