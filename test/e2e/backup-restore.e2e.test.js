const { GenericContainer } = require('testcontainers');
const path = require('path');
const fs = require('fs');
const execa = require('execa');
const mysql = require('mysql2/promise');
const describeIfDocker = fs.existsSync('/var/run/docker.sock') ? describe : describe.skip;

describeIfDocker('E2E: MySQL Full Backup & Restore', () => {
  let container;
  let config;
  const backupFile = path.resolve(__dirname, 'backup.sql.gz');

  beforeAll(async () => {
    container = await new GenericContainer('mysql', '8.0')
      .withEnv('MYSQL_ROOT_PASSWORD', 'pass')
      .withEnv('MYSQL_DATABASE', 'testdb')
      .withExposedPorts(3306)
      .start();
    config = {
      host: container.getHost(),
      port: container.getMappedPort(3306),
      user: 'root',
      password: 'pass'
    };
    // initialize sample table
    const conn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: 'testdb'
    });
    await conn.execute('CREATE TABLE IF NOT EXISTS items (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255));');
    await conn.execute("INSERT INTO items (name) VALUES ('foo'), ('bar');");
    await conn.end();
  }, 120000);

  afterAll(async () => {
    await container.stop();
    if (fs.existsSync(backupFile)) fs.unlinkSync(backupFile);
  });

  it('runs backup command successfully', async () => {
    const result = await execa('node', ['src/cli/index.js', 'backup',
      '--db', 'mysql',
      '--host', config.host,
      '--port', config.port.toString(),
      '--user', config.user,
      '--password', config.password,
      '--database', 'testdb',
      '--out', backupFile
    ]);
    expect(result.exitCode).toBe(0);
    expect(fs.existsSync(backupFile)).toBe(true);
  });

  it('runs restore command successfully', async () => {
    // create new DB for restore
    const conn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password
    });
    await conn.query('CREATE DATABASE IF NOT EXISTS restored;');
    await conn.end();

    const result = await execa('node', ['src/cli/index.js', 'restore',
      '--file', backupFile,
      '--db', 'mysql',
      '--host', config.host,
      '--port', config.port.toString(),
      '--user', config.user,
      '--password', config.password,
      '--database', 'restored'
    ]);
    expect(result.exitCode).toBe(0);
  });
});