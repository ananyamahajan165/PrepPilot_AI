const test = require("node:test");
const assert = require("node:assert/strict");
const { resolveFrontendOrigin } = require("../src/utils/frontendOrigin");

test("prefers the explicit origin header when present", () => {
  const req = {
    headers: {
      origin: "http://localhost:5174",
      referer: "http://localhost:5173/login",
    },
  };

  assert.equal(resolveFrontendOrigin(req), "http://localhost:5174");
});

test("falls back to the referer origin when no origin header exists", () => {
  const req = {
    headers: {
      referer: "https://example.test/dashboard",
    },
  };

  assert.equal(resolveFrontendOrigin(req), "https://example.test");
});

test("falls back to the configured client URL when no request origin is available", () => {
  const previous = process.env.CLIENT_URL;
  process.env.CLIENT_URL = "http://localhost:5173";

  try {
    assert.equal(resolveFrontendOrigin({ headers: {} }), "http://localhost:5173");
  } finally {
    if (previous === undefined) {
      delete process.env.CLIENT_URL;
    } else {
      process.env.CLIENT_URL = previous;
    }
  }
});
