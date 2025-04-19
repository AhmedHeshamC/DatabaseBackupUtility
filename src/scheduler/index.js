const cron = require('node-cron');
const { spawn } = require('child_process');
const Database = require('better-sqlite3');
const path = require('path');

// Initialize SQLite DB for job persistence
const db = new Database(path.resolve(__dirname, '../scheduler.db'));
db.exec(`
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  cron TEXT,
  command TEXT,
  args TEXT
);
`);

function addJob(name, cronExpr, command, args) {
  const stmt = db.prepare('INSERT INTO jobs (name, cron, command, args) VALUES (?, ?, ?, ?)');
  const result = stmt.run(name, cronExpr, command, JSON.stringify(args || []));
  scheduleJob(result.lastInsertRowid, cronExpr, command, args || []);
}

function listJobs() {
  return db.prepare('SELECT * FROM jobs').all();
}

function removeJob(id) {
  return db.prepare('DELETE FROM jobs WHERE id = ?').run(id);
}

function scheduleJob(id, cronExpr, command, args) {
  cron.schedule(cronExpr, () => {
    const proc = spawn(command, args, { stdio: 'inherit', shell: true });
    proc.on('exit', code => {
      console.log(`Job ${id} executed: ${command} exited with ${code}`);
    });
  });
}

function startScheduler() {
  const jobs = listJobs();
  jobs.forEach(job => scheduleJob(job.id, job.cron, job.command, JSON.parse(job.args)));
}

module.exports = { addJob, listJobs, removeJob, startScheduler };