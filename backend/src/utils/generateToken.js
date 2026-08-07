const jwt = require("jsonwebtoken");

// Short-lived (15m default) — sent in the JSON body, kept in memory on the
// client, attached as "Authorization: Bearer <token>" on every request.
function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
}

// Long-lived — signed with a SEPARATE secret so a leaked access token alone
// can never be used to mint new sessions. Delivered only as an httpOnly
// cookie, never readable by JS. Lifetime depends on "remember me".
function generateRefreshToken(userId, rememberMe) {
  const expiresIn = rememberMe
    ? process.env.REFRESH_TOKEN_EXPIRES_IN_LONG || "30d"
    : process.env.REFRESH_TOKEN_EXPIRES_IN_SHORT || "1d";
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn });
}

module.exports = { generateAccessToken, generateRefreshToken };
