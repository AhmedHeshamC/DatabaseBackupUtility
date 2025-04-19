#!/usr/bin/env node
const { Command } = require('commander');
const pkg = require('../../package.json');

const program = new Command();

program
  .name('dbackup')
  .version(pkg.version)
  .description('CLI database backup utility')
  .option('-c, --config <path>', 'set config file path')
  .option('-v, --verbose', 'enable verbose logging')
  .option('--dry-run', 'simulate actions without making changes')
  .option('--tls', 'enable TLS/SSL for database connections');

// Load commands
require('../commands/backup')(program);
require('../commands/restore')(program);
require('../commands/schedule')(program);
require('../commands/config')(program);

program.parse(process.argv);
