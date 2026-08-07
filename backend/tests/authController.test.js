const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authController = require("../src/controllers/authController");
const User = require("../src/models/User");
const { REFRESH_COOKIE_NAME } = require("../src/utils/cookieConfig");
const crypto = require("crypto");

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function buildRes() {
  return {
    statusCode: null,
    cookies: [],
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    clearCookie(name, options) {
      this.cookies.push({ name, options });
    },
  };
}

test("refreshToken handles stale refresh-token rotation without crashing", async () => {
  const userId = "507f1f77bcf86cd799439011";
  const token = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1h" });
  const incomingHash = hashToken(token);

  const originalFindOneAndUpdate = User.findOneAndUpdate;

  User.findOneAndUpdate = async () => null;

  try {
    const req = { cookies: { [REFRESH_COOKIE_NAME]: token } };
    const res = buildRes();

    await authController.refreshToken(req, res);

    assert.equal(res.statusCode, 401);
    assert.equal(res.body?.message, "Refresh token has been revoked");
  } finally {
    User.findOneAndUpdate = originalFindOneAndUpdate;
  }
});
