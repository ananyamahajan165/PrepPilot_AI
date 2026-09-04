const jwt = require("jsonwebtoken");

function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
}

function generateRefreshToken(userId, rememberMe) {
  const expiresIn = rememberMe
    ? process.env.REFRESH_TOKEN_EXPIRES_IN_LONG || "30d"
    : process.env.REFRESH_TOKEN_EXPIRES_IN_SHORT || "1d";
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn });
}

module.exports = { generateAccessToken, generateRefreshToken };
