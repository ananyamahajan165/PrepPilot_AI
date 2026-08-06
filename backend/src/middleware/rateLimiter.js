const rateLimit = require("express-rate-limit");
const { error } = require("../utils/apiResponse");

function handler(req, res) {
  return error(res, 429, "Too many requests. Please try again later.");
}

// Applied to all /api routes — generous, just here to stop abuse/scraping.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

// Applied only to /api/auth/login and /api/auth/register — tight, to slow
// down credential-stuffing / brute-force attempts against real accounts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

module.exports = { apiLimiter, authLimiter };
