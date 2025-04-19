const { GenericContainer } = require('testcontainers');
const postgresConnector = require('../../src/connectors/postgres');
const fs = require('fs');
const describeIfDocker = fs.existsSync('/var/run/docker.sock') ? describe : describe.skip;

describeIfDocker('PostgreSQL Connector Integration', () => {
  let container;
  let config;

  beforeAll(async () => {
    container = await new GenericContainer('postgres', '15')
      .withEnvironment({ POSTGRES_PASSWORD: 'pass', POSTGRES_DB: 'testdb' })
      .withExposedPorts(5432)
      .start();

    config = {
      host: container.getHost(),
      port: container.getMappedPort(5432),
      user: 'postgres',
      password: 'pass',
      database: 'testdb',
      tls: false
    };
  }, 120000);

  afterAll(async () => {
    await container.stop();
  });

  it('should connect and run test query', async () => {
    await expect(postgresConnector.test(config)).resolves.not.toThrow();
  });
});
