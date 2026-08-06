const test = require("node:test");
const assert = require("node:assert/strict");
const net = require("net");
const { getAvailablePort } = require("../src/utils/port");

test("getAvailablePort skips ports that are already in use", async () => {
  const occupiedServer = net.createServer();
  await new Promise((resolve) => occupiedServer.listen(0, "127.0.0.1", resolve));
  const occupiedPort = occupiedServer.address().port;

  try {
    const availablePort = await getAvailablePort(occupiedPort, 3);
    assert.notEqual(availablePort, occupiedPort);
  } finally {
    await new Promise((resolve, reject) => {
      occupiedServer.close((err) => (err ? reject(err) : resolve()));
    });
  }
});
