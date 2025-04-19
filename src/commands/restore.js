const { runRestore } = require('../engine/restoreEngine');

module.exports = (program) => {
  program.command('restore')
    .description('Restore a database from backup file')
    .requiredOption('--file <path>', 'Backup file to restore')
    .option('--db <type>', 'Database type (mysql, postgres, mongo, sqlite)')
    .option('--host <host>', 'Database host', 'localhost')
    .option('--port <port>', 'Database port')
    .option('--user <user>', 'Database user')
    .option('--password <password>', 'Database password')
    .option('--decrypt-key <hex>', 'AES-256-CBC decryption key in hex')
    .action(async (opts) => {
      try {
        await runRestore(opts);
      } catch (err) {
        console.error('Restore failed:', err.message);
        process.exit(1);
      }
    });
};