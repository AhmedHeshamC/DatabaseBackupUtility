const sched = require('../scheduler');

module.exports = (program) => {
  const schedule = program.command('schedule')
    .description('Manage scheduled tasks');

  schedule.command('add')
    .description('Add a scheduled task')
    .requiredOption('--name <name>', 'Job name')
    .requiredOption('--cron <expr>', 'Cron expression')
    .requiredOption('--command <cmd>', 'Shell command to run')
    .option('--args <items...>', 'Command arguments', [])
    .action(opts => {
      sched.addJob(opts.name, opts.cron, opts.command, opts.args);
      console.log(`Job added: ${opts.name}`);
    });

  schedule.command('list')
    .description('List scheduled tasks')
    .action(() => {
      const jobs = sched.listJobs();
      console.table(jobs);
    });

  schedule.command('remove')
    .description('Remove a scheduled task')
    .requiredOption('--id <id>', 'Job ID')
    .action(opts => {
      sched.removeJob(parseInt(opts.id, 10));
      console.log(`Job removed: ${opts.id}`);
    });

  schedule.command('start')
    .description('Start scheduler daemon')
    .action(() => {
      console.log('Scheduler started.');
      sched.startScheduler();
    });
};