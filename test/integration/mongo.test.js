const { GenericContainer } = require('testcontainers');
const mongoConnector = require('../../src/connectors/mongo');
const fs = require('fs');
const describeIfDocker = fs.existsSync('/var/run/docker.sock') ? describe : describe.skip;

describeIfDocker('MongoDB Connector Integration', () => {
  let container;
  let config;

  beforeAll(async () => {
    container = await new GenericContainer('mongo', '6')
      .withExposedPorts(27017)
      .start();

    config = {
      host: container.getHost(),
      port: container.getMappedPort(27017),
      database: 'admin',
      tls: false
    };
  }, 120000);

  afterAll(async () => {
    await container.stop();
  });

  it('should connect and ping the database', async () => {
    await expect(mongoConnector.test(config)).resolves.not.toThrow();
  });
});