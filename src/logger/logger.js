const pino = require('pino');
const path = require('path');

// log to console and file
const logPath = path.resolve(process.cwd(), 'logs', 'app.log');
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime
}, pino.multistream([
  { stream: process.stdout },
  { stream: pino.destination({ dest: logPath, sync: false }) }
]));

module.exports = logger;