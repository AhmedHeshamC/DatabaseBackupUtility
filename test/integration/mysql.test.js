const { GenericContainer } = require('testcontainers');
const mysqlConnector = require('../../src/connectors/mysql');
const fs = require('fs');
const describeIfDocker = fs.existsSync('/var/run/docker.sock') ? describe : describe.skip;

describeIfDocker('MySQL Connector Integration', () => {
  let container;
  let config;

  beforeAll(async () => {
    container = await new GenericContainer('mysql', '8.0')
      .withEnvironment({ MYSQL_ROOT_PASSWORD: 'pass', MYSQL_DATABASE: 'testdb' })
      .withExposedPorts(3306)
      .start();

    config = {
      host: container.getHost(),
      port: container.getMappedPort(3306),
      user: 'root',
      password: 'pass',
      database: 'testdb',
      tls: false
    };
  }, 120000);

  afterAll(async () => {
    await container.stop();
  });

  it('should connect and run test query', async () => {
    await expect(mysqlConnector.test(config)).resolves.not.toThrow();
  });
});