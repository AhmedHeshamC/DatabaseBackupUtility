const { loadConfig } = require('../config/loader');

module.exports = (program) => {
  program.command('config')
    .description('Validate or display current configuration')
    .option('--show', 'Display resolved config')
    .option('--validate', 'Validate configuration file')
    .action(async (opts) => {
      try {
        const cfg = await loadConfig(opts.config);
        if (opts.validate) {
          console.log('Configuration is valid.');
        }
        if (opts.show) {
          console.log(JSON.stringify(cfg, null, 2));
        }
      } catch (err) {
        console.error('Config error:', err.message);
        process.exit(1);
      }
    });
};