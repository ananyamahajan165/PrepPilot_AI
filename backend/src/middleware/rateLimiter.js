const rateLimit = require("express-rate-limit");
const { error } = require("../utils/apiResponse");

function handler(req, res) {
  return error(res, 429, "Too many requests. Please try again later.");
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

module.exports = { apiLimiter, authLimiter };
