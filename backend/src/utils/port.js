const net = require("net");

async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, "127.0.0.1");
  });
}

async function getAvailablePort(startPort, attempts = 10) {
  let candidate = startPort;

  for (let i = 0; i < attempts; i += 1) {
    if (await isPortAvailable(candidate)) {
      return candidate;
    }
    candidate += 1;
  }

  throw new Error(`No available port found starting from ${startPort}`);
}

module.exports = { isPortAvailable, getAvailablePort };
